// src/app/api/blogs/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CORS headers được định nghĩa một lần
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Chỉ select các field cần thiết
    const selectFields = {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      imageUrls: true,
      categoryId: true,
      sections: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    };

    let whereClause = {};
    if (categorySlug) {
      whereClause = {
        category: {
          slug: categorySlug,
        },
      };
    }

    // Sử dụng transaction để chạy song song
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: whereClause,
        select: selectFields,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where: whereClause }),
    ]);

    // Parse data hiệu quả hơn
    const parsedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      createdAt: blog.createdAt.toISOString(),
      category: blog.category,
      imageUrls: blog.imageUrls ? JSON.parse(blog.imageUrls) : [],
      sections: blog.sections ? JSON.parse(blog.sections) : [],
    }));

    const response = NextResponse.json({
      blogs: parsedBlogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

    return withCors(response);
  } catch (err) {
    console.error("Lỗi khi lấy blog:", err);
    const errorResponse = NextResponse.json(
      { message: "Lỗi khi lấy dữ liệu bài viết" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}

// POST - Thêm bài viết mới
export async function POST(request) {
  try {
    const {
      title,
      content,
      categoryId,
      imageUrls = [],
      sections = [],
    } = await request.json();

    if (!title || !categoryId) {
      const errorResponse = NextResponse.json(
        { message: "Thiếu thông tin bài viết" },
        { status: 400 }
      );
      return withCors(errorResponse);
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        categoryId,
        imageUrls: JSON.stringify(imageUrls),
        sections: JSON.stringify(sections),
      },
    });

    const response = NextResponse.json({
      ...newBlog,
      imageUrls,
      sections,
    });
    return withCors(response);
  } catch (err) {
    console.error("Lỗi khi thêm blog:", err);
    const errorResponse = NextResponse.json(
      { message: "Lỗi khi thêm dữ liệu bài viết" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}

// PUT - Cập nhật bài viết
export async function PUT(request) {
  try {
    const { id, title, content, categoryId, imageUrls, sections } =
      await request.json();

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        imageUrls: imageUrls ? JSON.stringify(imageUrls) : null,
        sections: sections ? JSON.stringify(sections) : null,
      },
    });

    const response = NextResponse.json(updatedBlog);
    return withCors(response);
  } catch (err) {
    console.error("Lỗi khi cập nhật blog:", err);
    const errorResponse = NextResponse.json(
      { message: "Lỗi khi cập nhật bài viết" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}

// DELETE - Xóa bài viết
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      const errorResponse = NextResponse.json(
        { message: "Argument 'id' is missing." },
        { status: 400 }
      );
      return withCors(errorResponse);
    }

    const deletedBlog = await prisma.blog.delete({
      where: { id: Number(id) },
    });

    const response = NextResponse.json(deletedBlog);
    return withCors(response);
  } catch (err) {
    console.error("Lỗi khi xóa blog:", err);
    const errorResponse = NextResponse.json(
      { message: "Lỗi khi xóa bài viết" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}
