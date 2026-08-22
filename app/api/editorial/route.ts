import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Editorial from '../../../models/Editorial';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get('kind'); // 'News' or 'Notices'
    const search = searchParams.get('search') || '';

    const query: any = {};
    if (kind) query.kind = kind;
    if (search) query.title = { $regex: search, $options: 'i' };

    const items = await Editorial.find(query).sort({ publishDate: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    if (!data.title || !data.kind || !data.category) {
      return NextResponse.json({ error: 'Title, Kind and Category are required' }, { status: 400 });
    }

    const item = new Editorial({
      title: data.title,
      kind: data.kind,
      category: data.category,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      summary: data.summary || '',
      content: data.content || '',
      status: data.status || 'Published',
      imageUrl: data.imageUrl || ''
    });

    await item.save();
    return NextResponse.json({ message: 'Content created successfully', item }, { status: 201 });
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
    await Editorial.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
