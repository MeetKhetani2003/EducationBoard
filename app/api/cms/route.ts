import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';
import Content from '../../../models/Content';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const content = await Content.findOne({ key });
      return NextResponse.json(content || { error: 'Not found' }, { status: content ? 200 : 404 });
    }

    const allContent = await Content.find({});
    return NextResponse.json(allContent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { key, type, value, description } = body;

    const content = await Content.findOneAndUpdate(
      { key },
      { type, value, description },
      { upsert: true, new: true }
    );

    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
