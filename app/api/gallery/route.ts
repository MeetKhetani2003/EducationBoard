import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Gallery from '../../../models/Gallery';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    
    const query = category && category !== 'All' ? { category } : {};
    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.imageUrl || !data.category) {
      return NextResponse.json({ error: 'Title, imageUrl, and category are required' }, { status: 400 });
    }

    const item = new Gallery({
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category
    });

    await item.save();
    return NextResponse.json({ message: 'Gallery item added successfully', item }, { status: 201 });
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
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
