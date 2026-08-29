import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '../../../lib/db';
import DocumentModel from '../../../models/Document';

export async function GET(request: Request) {
  try {
    const conn = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Download file from GridFS
      const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
        bucketName: 'documents'
      });
      
      const doc = await DocumentModel.findById(id);
      if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const stream = bucket.openDownloadStream(doc.gridFsId);
      
      // Convert Node.js stream to Web Stream for Next.js response
      const webStream = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => controller.enqueue(chunk));
          stream.on('end', () => controller.close());
          stream.on('error', (err) => controller.error(err));
        }
      });

      return new NextResponse(webStream, {
        headers: {
          'Content-Type': doc.contentType,
          'Content-Disposition': `inline; filename="${doc.filename}"`
        }
      });
    }

    // List all documents with optional filters
    const category = searchParams.get('category') || '';
    const programme = searchParams.get('programme') || '';
    const query: any = {};
    if (category) query.category = category;
    if (programme) query.programme = programme;

    const docs = await DocumentModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const conn = await connectToDatabase();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const programme = formData.get('programme') as string || 'All Programmes';

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'File, title, and category are required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'documents'
    });

    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type
      } as any);

      uploadStream.on('error', (error) => {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      });

      uploadStream.on('finish', async () => {
        try {
          const newDoc = new DocumentModel({
            title,
            category,
            programme,
            gridFsId: uploadStream.id,
            filename: file.name,
            contentType: file.type,
            size: file.size
          });
          
          await newDoc.save();
          resolve(NextResponse.json(newDoc, { status: 201 }));
        } catch (err: any) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        }
      });

      uploadStream.end(buffer);
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const conn = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const doc = await DocumentModel.findById(id);
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    const bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'documents'
    });

    try {
      await bucket.delete(doc.gridFsId);
    } catch (e) {
      // Ignore if GridFS delete fails
    }

    await DocumentModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
