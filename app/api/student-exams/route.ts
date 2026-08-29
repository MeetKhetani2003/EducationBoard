import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import StudentExam from '../../../models/StudentExam';
import Exam from '../../../models/Exam';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const studentEnrollment = searchParams.get('studentEnrollment');

    if (examId && studentEnrollment) {
      const studentExam = await StudentExam.findOne({ examId, studentEnrollment });
      return NextResponse.json(studentExam || { error: 'Not joined' });
    }

    if (examId) {
      const list = await StudentExam.find({ examId });
      return NextResponse.json(list);
    }

    return NextResponse.json({ error: 'Parameters missing' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { action, studentEnrollment, examId, answers, theoryMarks, isChecked } = data;

    if (!studentEnrollment || !examId) {
      return NextResponse.json({ error: 'studentEnrollment and examId are required' }, { status: 400 });
    }

    if (action === 'join') {
      const existing = await StudentExam.findOne({ examId, studentEnrollment });
      if (existing) {
        return NextResponse.json(existing);
      }
      const doc = new StudentExam({
        studentEnrollment,
        examId,
        joinedAt: new Date(),
        leftExam: false,
        answers: { mcqs: {}, theory: {} },
        isChecked: false,
        isSubmitted: false
      });
      await doc.save();
      return NextResponse.json(doc);
    }

    if (action === 'lockout') {
      const updated = await StudentExam.findOneAndUpdate(
        { examId, studentEnrollment },
        { leftExam: true, isSubmitted: true, submittedAt: new Date() },
        { new: true }
      );
      return NextResponse.json({ message: 'Locked out successfully', data: updated });
    }

    if (action === 'submit') {
      // Find the exam configuration to auto-calculate MCQ scores
      const exam = await Exam.findById(examId);
      let mcqMarks = 0;
      if (exam && exam.paper && exam.paper.mcqs && answers && answers.mcqs) {
        exam.paper.mcqs.forEach((q, idx) => {
          const selected = answers.mcqs[idx];
          if (selected !== undefined && Number(selected) === q.correctOption) {
            mcqMarks += q.marks;
          }
        });
      }

      const updated = await StudentExam.findOneAndUpdate(
        { examId, studentEnrollment },
        { 
          answers, 
          mcqMarks,
          isSubmitted: true, 
          submittedAt: new Date() 
        },
        { new: true }
      );
      return NextResponse.json({ message: 'Exam submitted successfully', data: updated });
    }

    if (action === 'grade') {
      const updated = await StudentExam.findOneAndUpdate(
        { examId, studentEnrollment },
        { 
          theoryMarks, 
          isChecked: isChecked ?? true
        },
        { new: true }
      );
      return NextResponse.json({ message: 'Grading updated successfully', data: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
