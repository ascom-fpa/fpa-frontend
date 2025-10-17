// LoadingPage.tsx
export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full grid place-items-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#1C9658] animate-spin" />
      </div>
    </div>
  );
}