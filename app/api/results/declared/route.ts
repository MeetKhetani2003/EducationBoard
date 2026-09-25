import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Result from '@/models/Result';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Group by examination and programme to find unique result sets
    const uniqueResults = await Result.aggregate([
      {
        $group: {
          _id: {
            examination: "$examination",
            programme: "$programme"
          },
          date: { $max: "$printDate" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id.examination",
          programme: "$_id.programme",
          date: "$date",
          status: "Declared"
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    return NextResponse.json(uniqueResults);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
