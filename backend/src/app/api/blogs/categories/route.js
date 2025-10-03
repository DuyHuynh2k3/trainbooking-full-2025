// src/app/api/blogs/categories/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(response) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const response = NextResponse.json(categories);
    return withCors(response);
  } catch (error) {
    console.error("Lỗi khi fetch categories:", error);
    const errorResponse = NextResponse.json(
      { error: "Không thể lấy các chuyên mục" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}
