//src/app/blogs/page.tsx:
"use client";
import React, { useState } from "react";
import DataTableBlogs from "./data-table";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Dialog } from "@/components/ui/dialog";
import { X, Eye, Edit, Trash2, Plus, FileImage } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BlogSection {
  id: string;
  imageUrl: string;
  content: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imageUrls: string[];
  categoryId: number;
  category?: Category;
  sections: BlogSection[];
}

const TrainPage = () => {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  const normalizeBlog = (blog: Blog): Blog => {
    return {
      ...blog,
      sections: Array.isArray(blog.sections) ? blog.sections : [],
      imageUrls: Array.isArray(blog.imageUrls) ? blog.imageUrls : [],
    };
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog) return;

    try {
      await axios.put(`/api/blogs?id=${editingBlog.id}`, {
        ...editingBlog,
        imageUrls: JSON.stringify(editingBlog.imageUrls),
        sections: JSON.stringify(editingBlog.sections),
      });
      toast.success("Cập nhật bài viết thành công!");
      setEditingBlog(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật bài viết:", err);
      toast.error("Có lỗi xảy ra khi cập nhật bài viết!");
    }
  };

  const handleSectionChange = (
    index: number,
    field: keyof BlogSection,
    value: string
  ) => {
    if (!editingBlog) return;

    const updatedSections = [...editingBlog.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };

    setEditingBlog({
      ...editingBlog,
      sections: updatedSections,
    });
  };

  const handleAddSection = () => {
    if (!editingBlog) return;

    const newSection: BlogSection = {
      id: Date.now().toString(),
      imageUrl: "",
      content: "",
    };

    setEditingBlog({
      ...editingBlog,
      sections: [...editingBlog.sections, newSection],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!editingBlog) return;

    const updatedSections = [...editingBlog.sections];
    updatedSections.splice(index, 1);

    setEditingBlog({
      ...editingBlog,
      sections: updatedSections,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý tin tức
          </h1>
          <p className="text-gray-600">
            Quản lý và chỉnh sửa các bài viết trên website
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <DataTableBlogs
            onEdit={(blog) => setEditingBlog(normalizeBlog(blog))}
            onView={(blog) => setViewingBlog(normalizeBlog(blog))}
          />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

      {/* Modal xem bài viết */}
      {viewingBlog && (
        <Dialog open={!!viewingBlog} onOpenChange={() => setViewingBlog(null)}>
          <DialogContent className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl relative">
              {/* Nút close mới - đẹp hơn */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingBlog(null)}
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 z-10"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng</span>
              </Button>

              <div className="pr-8">
                <DialogTitle className="text-3xl font-bold text-gray-800 mb-2">
                  {viewingBlog.title}
                </DialogTitle>

                <div className="text-md text-gray-600 mb-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span>
                      Chuyên mục:{" "}
                      <span className="font-semibold">
                        {viewingBlog.category?.name || "Không xác định"}
                      </span>
                    </span>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <span>Tổng đoạn: {viewingBlog.sections.length}</span>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <span>
                      Ngày tạo:{" "}
                      {new Date(viewingBlog.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Nội dung chính */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-md border">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Nội dung chính
                    </h3>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {viewingBlog.content}
                    </p>
                  </div>

                  {/* Hình ảnh chính */}
                  {viewingBlog.imageUrls && viewingBlog.imageUrls.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                      <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
                        <FileImage className="h-5 w-5" />
                        Ảnh bài viết ({viewingBlog.imageUrls.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {viewingBlog.imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Ảnh ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 italic">
                        Chưa có ảnh bài viết
                      </p>
                    </div>
                  )}

                  {/* Các đoạn nội dung */}
                  {viewingBlog.sections.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                      <h3 className="font-semibold text-lg mb-6 text-gray-800 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Các đoạn nội dung ({viewingBlog.sections.length})
                      </h3>
                      <div className="space-y-6">
                        {viewingBlog.sections.map((section, index) => (
                          <div
                            key={section.id || index}
                            className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm border"
                          >
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Ảnh đoạn */}
                              <div className="lg:w-1/3">
                                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                    {index + 1}
                                  </span>
                                  Đoạn {index + 1}
                                </h4>
                                {section.imageUrl ? (
                                  <img
                                    src={section.imageUrl}
                                    alt={`Ảnh đoạn ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                                  />
                                ) : (
                                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <FileImage className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Nội dung đoạn */}
                              <div className="lg:w-2/3">
                                <p className="whitespace-pre-line text-gray-700 leading-relaxed bg-white p-4 rounded-lg">
                                  {section.content || (
                                    <span className="text-gray-400 italic">
                                      Chưa có nội dung
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Plus className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 italic">
                        Chưa có đoạn nội dung nào
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Form chỉnh sửa bài viết */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl relative">
            {/* Nút close cho form edit */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingBlog(null)}
              className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </Button>

            <div className="pr-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Edit className="h-6 w-6" />
                Chỉnh sửa bài viết
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Tiêu đề
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, title: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-content"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Nội dung chính
                  </label>
                  <textarea
                    id="edit-content"
                    value={editingBlog.content}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        content: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32"
                    placeholder="Nhập nội dung chính"
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-medium text-gray-700 text-lg">
                      Các đoạn nội dung ({editingBlog.sections.length})
                    </label>
                    <Button
                      variant="outline"
                      onClick={handleAddSection}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm đoạn
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editingBlog.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-700 flex items-center gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                              {index + 1}
                            </span>
                            Đoạn {index + 1}
                          </h3>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveSection(index)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`section-image-${index}`}
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              URL ảnh
                            </label>
                            <input
                              id={`section-image-${index}`}
                              type="text"
                              value={section.imageUrl}
                              onChange={(e) =>
                                handleSectionChange(
                                  index,
                                  "imageUrl",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nhập URL ảnh"
                            />
                            {section.imageUrl && (
                              <img
                                src={section.imageUrl}
                                alt={`Preview ${index + 1}`}
                                className="mt-2 w-full h-32 object-cover rounded border"
                              />
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={`section-content-${index}`}
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              Nội dung
                            </label>
                            <textarea
                              id={`section-content-${index}`}
                              value={section.content}
                              onChange={(e) =>
                                handleSectionChange(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                              placeholder="Nhập nội dung đoạn"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button
                  onClick={handleUpdateBlog}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingBlog(null)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainPage;
