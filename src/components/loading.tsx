export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-y-2">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-md">Loading...</div>
      </div>
    </div>
  );
}
