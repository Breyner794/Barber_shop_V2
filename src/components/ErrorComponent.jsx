

const ErrorComponent = ({ message, onRetry }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {/* Icono de advertencia */}
        <svg
          className="mx-auto h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <h1 className="text-2xl font-bold text-white mb-2">
          ¡Oops! Algo salió mal.
        </h1>

        <p className="text-gray-400 mb-6">
          Parece que no podemos conectarnos con nuestros servidores en este momento.
          Esto puede ser un problema temporal.
        </p>

        {/* Mostramos el mensaje de error que recibimos por props */}
        <p className="text-red-400 text-sm font-mono bg-gray-900 rounded p-2 mb-6">
          Error: {message || "Ocurrió un error inesperado."}
        </p>

        {/* El botón ejecuta la función que recibimos por props */}
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white 
          font-bold py-2 px-6 rounded-lg transition 
          duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};



export default ErrorComponent;