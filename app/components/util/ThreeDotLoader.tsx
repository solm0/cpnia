'use client'

export default function ThreeDotLoader() {
  return (
    <div className="flex space-x-2 justify-center items-center h-16">
      <span className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-0"></span>
      <span className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-200"></span>
      <span className="w-4 h-4 bg-gray-800 rounded-full animate-bounce delay-400"></span>
    </div>
  )
}