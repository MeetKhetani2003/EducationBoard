import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Programme from '../../../models/Programme';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const query = search 
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const programmes = await Programme.find(query).sort({ createdAt: 1 });
    return NextResponse.json(programmes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.eligibility || !data.duration || !data.text) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const prog = new Programme({
      title: data.title,
      eligibility: data.eligibility,
      duration: data.duration,
      image: data.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      text: data.text
    });

    await prog.save();
    return NextResponse.json({ message: 'Programme created successfully', programme: prog }, { status: 201 });
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
    await Programme.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Programme deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
