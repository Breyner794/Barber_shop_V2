
const InlineError = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative text-center">
      <div className="flex flex-col items-center">
        {/* Un ícono más pequeño y sutil */}
        <svg
          className="h-8 w-8 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <strong className="font-bold">¡Oops! Hubo un problema</strong>
        <span className="block sm:inline mt-1 text-sm">{message}</span>
        
        <p className="text-xs text-red-300 mt-3">
          Puedes reintentar o seleccionar una fecha diferente.
        </p>

        <button
          onClick={onRetry}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 text-sm rounded-md transition duration-300"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};


export default InlineError;