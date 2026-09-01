import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import Result from "@/models/Result";
import Programme from "@/models/Programme";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalStudents,
      totalResults,
      publishedResults,
      totalProgrammes,
      totalDocuments,
      recentResults
    ] = await Promise.all([
      Student.countDocuments(),
      Result.countDocuments(),
      Result.countDocuments({ resultStatus: "Published" }),
      Programme.countDocuments(),
      Document.countDocuments(),
      Result.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalResults,
        publishedResults,
        pendingResults: totalResults - publishedResults,
        totalProgrammes,
        totalDocuments
      },
      recentResults
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
