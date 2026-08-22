import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Recognition from '../../../models/Recognition';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const items = await Recognition.find({}).sort({ createdAt: 1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.reference) {
      return NextResponse.json({ error: 'Title and reference are required' }, { status: 400 });
    }

    const item = new Recognition({
      title: data.title,
      reference: data.reference,
      documentUrl: data.documentUrl || ''
    });

    await item.save();
    return NextResponse.json({ message: 'Recognition record added successfully', item }, { status: 201 });
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
    await Recognition.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Recognition record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
