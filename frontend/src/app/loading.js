export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="flex flex-col items-center gap-6">
        <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

        <p className="text-sm text-gray-600 tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
