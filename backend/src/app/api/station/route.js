// src/app/api/station/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    console.time("Database query time");

    // Truy vấn database trực tiếp - không dùng cache
    const stations = await prisma.station.findMany({
      select: {
        station_id: true,
        station_name: true,
      },
      orderBy: {
        station_id: "asc",
      },
    });

    console.timeEnd("Database query time");
    console.log(`Fetched ${stations.length} stations directly from database`);

    if (!stations || stations.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Không tìm thấy ga nào" }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new NextResponse(JSON.stringify(stations), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching stations:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Lỗi cơ sở dữ liệu", details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
