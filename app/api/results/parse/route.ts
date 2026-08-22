import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

function detectMapping(headers: string[]) {
  const find = (variants: string[]) => {
    return headers.find(h => 
      variants.some(v => h.toLowerCase().replace(/[_\s-]/g, '') === v.toLowerCase().replace(/[_\s-]/g, ''))
    ) || '';
  };

  return {
    enrollmentNumber: find(['enrollment', 'enrollmentno', 'enrollmentnumber', 'enrollno', 'regNo', 'registrationno', 'regno', 'id']),
    rollNumber: find(['roll', 'rollno', 'rollnumber', 'seatno', 'seatnumber']),
    studentName: find(['name', 'studentname', 'fullname', 'candidatename', 'student', 'candidate']),
    fatherName: find(['father', 'fathername', 'fathersname', 'parentname', 'guardianname']),
    dob: find(['dob', 'dateofbirth', 'birthdate', 'birth']),
    programme: find(['programme', 'program', 'course', 'stream', 'class']),
    examination: find(['exam', 'examination', 'examname', 'examinationname']),
    examYear: find(['year', 'examyear', 'sessionyear', 'session', 'batch']),
    grandTotal: find(['total', 'grandtotal', 'marksscored', 'obtainedmarks', 'totalmarks', 'marks']),
    percentage: find(['percentage', 'percent', '%', 'pct', 'percnt']),
    resultStatus: find(['status', 'result', 'resultstatus', 'pass', 'passfail']),
  };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Multipart/form-data required' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(Buffer.from(buffer), { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    if (rawRows.length === 0) {
      return NextResponse.json({ error: 'The uploaded file is empty' }, { status: 400 });
    }

    // Get all column headers from the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    const headers: string[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[xlsx.utils.encode_cell({ r: range.s.r, c: C })];
      if (cell && cell.v) {
        headers.push(String(cell.v).trim());
      }
    }

    // Auto detect mapping
    const mapping = detectMapping(headers);

    return NextResponse.json({
      fileName: file.name,
      fileSize: file.size,
      headers,
      mapping,
      rawRows, // Return all rows for dynamic validation and mapping
      totalRowsCount: rawRows.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
