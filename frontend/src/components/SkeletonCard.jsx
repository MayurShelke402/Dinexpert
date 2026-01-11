export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow animate-pulse p-2 h-40">
      <div className="w-full h-24 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 w-3/4 rounded"></div>
      <div className="h-4 bg-gray-100 mt-1 w-1/2 rounded"></div>
    </div>
  );
}
