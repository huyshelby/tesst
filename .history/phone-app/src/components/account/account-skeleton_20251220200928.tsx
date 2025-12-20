"use client";

export function AccountSkeleton() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] py-8 md:py-12">
      <div className="content-container max-w-[1200px]">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl p-8 mb-6 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-grow">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-3" />
              <div className="h-5 bg-gray-200 rounded-lg w-64 mb-4" />
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded-full w-24" />
                <div className="h-8 bg-gray-200 rounded-full w-28" />
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-full w-32" />
          </div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-4" />
              <div className="h-8 bg-gray-200 rounded-lg w-16 mx-auto mb-3" />
              <div className="h-4 bg-gray-200 rounded-lg w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Menu Items Skeleton */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-6 border-b animate-pulse">
            <div className="h-6 bg-gray-200 rounded-lg w-40" />
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 p-6 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="h-5 bg-gray-200 rounded-lg w-36 mb-2" />
                  <div className="h-4 bg-gray-200 rounded-lg w-48" />
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Support Section Skeleton */}
        <div className="bg-gray-200 rounded-2xl p-8 mt-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded-lg w-32 mb-2" />
          <div className="h-4 bg-gray-300 rounded-lg w-64 mb-6" />
          <div className="flex gap-3">
            <div className="h-10 bg-gray-300 rounded-full w-32" />
            <div className="h-10 bg-gray-300 rounded-full w-32" />
          </div>
        </div>
      </div>
    </main>
  );
}
