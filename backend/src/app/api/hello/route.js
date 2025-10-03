// src/app/api/hello/route.js (BACKEND)
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Backend: API /api/hello được gọi!");

  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:3001", // Frontend port 3001
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  return NextResponse.json(
    {
      message: "Xin chào từ Next.js backend local!",
      timestamp: new Date().toISOString(),
      backend: "http://localhost:3000",
      frontend: "http://localhost:3001",
    },
    { headers }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
