const LoadingState = ({ message, spinnerColor, height }) => {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full h-16 w-16 border-b-4 mx-auto ${spinnerColor}`}></div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
