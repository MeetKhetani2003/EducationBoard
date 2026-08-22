import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Student from '../../../models/Student';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const query = search 
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { enrollmentNumber: { $regex: search, $options: 'i' } }] }
      : {};
      
    const students = await Student.find(query).sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.enrollmentNumber || !data.name || !data.dob || !data.fatherName) {
      return NextResponse.json({ error: 'Enrollment, Name, Father\'s Name and DOB are required' }, { status: 400 });
    }

    const existing = await Student.findOne({ enrollmentNumber: data.enrollmentNumber });
    if (existing) {
      return NextResponse.json({ error: 'A student with this enrollment number already exists' }, { status: 400 });
    }

    // Default password is DOB or a standard password hash if none provided
    const passwordHash = data.passwordHash || 'student123'; 

    const newStudent = new Student({
      enrollmentNumber: data.enrollmentNumber,
      name: data.name,
      fatherName: data.fatherName,
      dob: new Date(data.dob),
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      passwordHash: passwordHash
    });

    await newStudent.save();
    return NextResponse.json({ message: 'Student created successfully', student: newStudent }, { status: 201 });
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
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
