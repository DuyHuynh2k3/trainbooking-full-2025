import { Link } from "react-router-dom";

function BlogCard({ blog }) {
  // Đảm bảo imageUrls là array
  const imageUrls = Array.isArray(blog.imageUrls) ? blog.imageUrls : [];
  const firstImage = imageUrls.length > 0 ? imageUrls[0] : "/default.jpg";

  // Đảm bảo content là string
  const content = typeof blog.content === "string" ? blog.content : "";

  return (
    <div
      className="card shadow-sm w-100 h-100"
      style={{ borderRadius: "10px" }}
    >
      <img
        src={firstImage}
        alt={blog.title}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-primary">{blog.title}</h5>
        <p
          className="card-text text-muted flex-grow-1"
          style={{ fontSize: "14px" }}
        >
          {content.substring(0, 100)}...
        </p>
        <Link
          to={`/blog/${blog.id}`}
          className="btn btn-outline-primary btn-sm align-self-start"
        >
          Đọc tiếp...
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
