import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Exam from '../../../models/Exam';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const query = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const exams = await Exam.find(query).sort({ examStartDate: -1 });
    return NextResponse.json(exams);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.programme || !data.examYear || !data.registrationStartDate || !data.examStartDate || !data.resultDate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const exam = new Exam({
      title: data.title,
      programme: data.programme,
      examYear: data.examYear,
      registrationStartDate: new Date(data.registrationStartDate),
      examStartDate: new Date(data.examStartDate),
      resultDate: new Date(data.resultDate),
      status: data.status || 'Upcoming'
    });

    await exam.save();
    return NextResponse.json({ message: 'Examination created successfully', exam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    await Exam.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Examination deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
