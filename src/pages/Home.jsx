import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-sky-100 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">Chat Web Ghibli UI</h1>
      <Link
        to="/register"
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow"
      >
        Đi đến trang Đăng ký
      </Link>
    </div>
  );
}
