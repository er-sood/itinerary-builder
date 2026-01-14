import Image from "next/image";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-transparent">
      
      {/* Logo → Dashboard */}
      <Link href="/dashboard" className="flex items-center">
        <Image
          src="/images/oggy-logo.png"
          alt="Oggy Holidays"
          width={160}
          height={50}
          priority
        />
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="text-sm font-medium text-gray-700 hover:text-blue-700 transition">
          My Profile
        </button>

        <form action="/api/auth/logout" method="POST">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition text-sm font-medium">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
