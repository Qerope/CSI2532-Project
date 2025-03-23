export function HotelListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-gray-200 animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 bg-gray-300"></div>
            <div className="md:w-2/3 p-6 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded-md"></div>
                ))}
              </div>

              <div className="flex justify-end">
                <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center space-x-2 pt-4">
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
}

