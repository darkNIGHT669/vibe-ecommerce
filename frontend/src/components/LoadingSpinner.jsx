function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20">
          <div className="absolute border-4 border-blue-200 rounded-full w-20 h-20"></div>
          <div className="absolute border-4 border-blue-600 border-t-transparent rounded-full w-20 h-20 animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading Vibe Commerce...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;