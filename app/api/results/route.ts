import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Result from '../../../models/Result';
import * as xlsx from 'xlsx';

// Smart column mapper - auto-detects column names from any Excel format
function mapColumns(row: Record<string, any>) {
  const keys = Object.keys(row).map(k => k.trim());
  
  const find = (...variants: string[]) => {
    for (const v of variants) {
      const found = keys.find(k => k.toLowerCase().replace(/[_\s-]/g, '') === v.toLowerCase().replace(/[_\s-]/g, ''));
      if (found !== undefined) return row[found];
    }
    return undefined;
  };

  // Smart date parsing
  const parseDate = (val: any): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return val;
    // Excel serial number
    if (typeof val === 'number') {
      return xlsx.SSF.parse_date_code ? new Date((val - 25569) * 86400 * 1000) : new Date(val);
    }
    const d = new Date(String(val));
    return isNaN(d.getTime()) ? null : d;
  };

  const enrollment = find('enrollment', 'enrollmentno', 'enrollmentnumber', 'enrollno', 'regNo', 'registrationno', 'regno');
  const roll = find('roll', 'rollno', 'rollnumber');
  const name = find('name', 'studentname', 'fullname', 'candidatename', 'student');
  const father = find('father', 'fathername', 'fathersname', 'parentname', 'guardianname');
  const dob = parseDate(find('dob', 'dateofbirth', 'birthdate', 'birth'));
  const programme = find('programme', 'program', 'course', 'stream', 'class');
  const exam = find('exam', 'examination', 'examname', 'examinationname');
  const year = find('year', 'examyear', 'sessionyear', 'session', 'batch');
  const total = find('total', 'grandtotal', 'marksscored', 'obtainedmarks', 'totalmarks', 'marks');
  const percent = find('percentage', 'percent', '%', 'pct', 'percnt');
  const status = find('status', 'result', 'resultstatus', 'pass', 'passfail');

  // Parse subjects - look for columns with subject patterns
  const subjectColumns = keys.filter(k => !['enrollment','enrollmentno','enrollmentnumber','roll','rollno','name','studentname','father','fathername','dob','dateofbirth','programme','program','course','exam','examination','year','examyear','total','grandtotal','percentage','percent','status','result'].some(s => k.toLowerCase().replace(/[_\s-]/g, '').includes(s.replace(/[_\s-]/g, ''))));

  const subjects: any[] = [];
  // Group subject columns in pairs/quads (Subj1_TH, Subj1_PR etc.)
  const subjectMap: Record<string, any> = {};
  subjectColumns.forEach(col => {
    const val = row[col];
    if (typeof val === 'number' || !isNaN(Number(val))) {
      const baseName = col.replace(/_?(TH|PR|Max|Min|Total|Grade)$/i, '').trim();
      if (!subjectMap[baseName]) subjectMap[baseName] = { name: baseName };
      const suffix = (col.match(/_(TH|PR|Max|Min|Total|Grade)$/i) || [])[1]?.toUpperCase();
      if (suffix === 'TH') subjectMap[baseName].th = Number(val);
      else if (suffix === 'PR') subjectMap[baseName].pr = Number(val);
      else if (suffix === 'MAX') subjectMap[baseName].max = Number(val);
      else if (suffix === 'MIN') subjectMap[baseName].min = Number(val);
      else if (suffix === 'TOTAL') subjectMap[baseName].total = Number(val);
      else if (suffix === 'GRADE') subjectMap[baseName].grade = String(val);
      else subjectMap[baseName].th = Number(val); // default to theory marks
    }
  });
  Object.values(subjectMap).forEach((s, i) => subjects.push({ sNo: String(i + 1), name: s.name, max: s.max || 100, min: s.min || 33, th: s.th || 0, pr: s.pr || 0, total: s.total || (s.th || 0) + (s.pr || 0), grade: s.grade || '' }));

  const calcPercent = total && percent === undefined ? Number(total) / (subjects.length * 100) * 100 : Number(percent || 0);
  const calcStatus = status ? String(status).toUpperCase().includes('PASS') ? 'PASS' : String(status).toUpperCase() : (calcPercent >= 33 ? 'PASS' : 'FAIL');

  return {
    enrollmentNumber: enrollment ? String(enrollment).trim() : null,
    rollNumber: roll ? String(roll).trim() : (enrollment ? String(enrollment).trim() : null),
    studentName: name ? String(name).trim() : null,
    fatherName: father ? String(father).trim() : 'N/A',
    dob: dob || null,
    programme: programme ? String(programme).trim() : 'Senior Secondary',
    examination: exam ? String(exam).trim() : 'Public Examination',
    examYear: year ? String(year).trim() : new Date().getFullYear().toString(),
    subjects,
    grandTotal: Number(total || 0),
    percentage: Math.round(calcPercent * 100) / 100,
    resultStatus: calcStatus,
  };
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const enrollmentNumber = searchParams.get('enrollment');
    const dobString = searchParams.get('dob');
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 100);
    const search = searchParams.get('search') || '';

    // Admin: fetch all results
    if (!enrollmentNumber || !dobString) {
      const query = search ? { $or: [{ studentName: { $regex: search, $options: 'i' } }, { enrollmentNumber: { $regex: search, $options: 'i' } }] } : {};
      const [results, total] = await Promise.all([
        Result.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Result.countDocuments(query)
      ]);
      return NextResponse.json({ results, total, page, pages: Math.ceil(total / limit) });
    }

    // Public: search by enrollment + DOB
    const result = await Result.findOne({
      enrollmentNumber: enrollmentNumber.trim(),
      dob: { $gte: new Date(new Date(dobString).setHours(0,0,0,0)), $lte: new Date(new Date(dobString).setHours(23,59,59,999)) }
    });

    if (!result) {
      return NextResponse.json({ error: 'Result not found. Please verify your Enrollment Number and Date of Birth.' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // === EXCEL UPLOAD ===
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

      const buffer = await file.arrayBuffer();
      const workbook = xlsx.read(Buffer.from(buffer), { type: 'buffer', cellDates: true });
      
      const allSheets = workbook.SheetNames;
      const allResults: any[] = [];
      
      for (const sheetName of allSheets) {
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        for (const row of rawData as any[]) {
          const mapped = mapColumns(row);
          if (mapped.enrollmentNumber && mapped.studentName) {
            allResults.push(mapped);
          }
        }
      }

      if (allResults.length === 0) {
        return NextResponse.json({ error: 'No valid data found in Excel. Make sure columns include Enrollment, Name, DOB.' }, { status: 400 });
      }

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const resultData of allResults) {
        try {
          await Result.findOneAndUpdate(
            { enrollmentNumber: resultData.enrollmentNumber },
            { ...resultData, resultDate: new Date() },
            { upsert: true, new: true }
          );
          imported++;
        } catch (e: any) {
          skipped++;
          errors.push(`Row ${resultData.enrollmentNumber}: ${e.message}`);
        }
      }

      return NextResponse.json({
        message: `Imported ${imported} results successfully${skipped > 0 ? `, ${skipped} skipped` : ''}.`,
        imported, skipped,
        errors: errors.slice(0, 5),
        preview: allResults.slice(0, 3)
      });
    } else {
      // === MANUAL SINGLE OR BULK JSON RESULT ===
      const data = await request.json();

      if (Array.isArray(data)) {
        let imported = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const row of data) {
          if (!row.enrollmentNumber || !row.studentName) {
            skipped++;
            errors.push('Row missing enrollment or student name');
            continue;
          }
          try {
            const resultData = {
              enrollmentNumber: String(row.enrollmentNumber).trim(),
              rollNumber: String(row.rollNumber || row.enrollmentNumber).trim(),
              studentName: String(row.studentName).trim(),
              fatherName: String(row.fatherName || 'N/A').trim(),
              dob: new Date(row.dob),
              programme: String(row.programme || 'Senior Secondary'),
              examination: String(row.examination || 'Public Examination'),
              examYear: String(row.examYear || new Date().getFullYear()),
              subjects: row.subjects || [],
              grandTotal: Number(row.grandTotal || 0),
              percentage: Number(row.percentage || 0),
              resultStatus: String(row.resultStatus || 'PASS'),
              resultDate: new Date(),
            };

            await Result.findOneAndUpdate(
              { enrollmentNumber: resultData.enrollmentNumber },
              resultData,
              { upsert: true, new: true }
            );
            imported++;
          } catch (e: any) {
            skipped++;
            errors.push(`Enrollment ${row.enrollmentNumber}: ${e.message}`);
          }
        }
        return NextResponse.json({ 
          message: `Imported ${imported} results successfully${skipped > 0 ? `, ${skipped} skipped` : ''}.`, 
          imported, 
          skipped, 
          errors 
        });
      }
      
      if (!data.enrollmentNumber || !data.studentName || !data.dob) {
        return NextResponse.json({ error: 'Enrollment Number, Student Name and Date of Birth are required.' }, { status: 400 });
      }

      const resultData = {
        enrollmentNumber: String(data.enrollmentNumber).trim(),
        rollNumber: String(data.rollNumber || data.enrollmentNumber).trim(),
        studentName: String(data.studentName).trim(),
        fatherName: String(data.fatherName || 'N/A').trim(),
        dob: new Date(data.dob),
        programme: String(data.programme || 'Senior Secondary'),
        examination: String(data.examination || 'Public Examination'),
        examYear: String(data.examYear || new Date().getFullYear()),
        subjects: data.subjects || [],
        grandTotal: Number(data.grandTotal || 0),
        percentage: Number(data.percentage || 0),
        resultStatus: String(data.resultStatus || 'PASS'),
        resultDate: new Date(),
      };

      const existing = await Result.findOne({ enrollmentNumber: resultData.enrollmentNumber });
      if (existing && !data.forceUpdate) {
        return NextResponse.json({ error: `A result with Enrollment ${resultData.enrollmentNumber} already exists. Send forceUpdate: true to overwrite.`, exists: true }, { status: 409 });
      }

      const result = await Result.findOneAndUpdate(
        { enrollmentNumber: resultData.enrollmentNumber },
        resultData,
        { upsert: true, new: true }
      );

      return NextResponse.json({ message: 'Result saved successfully.', result }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await Result.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Result deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
