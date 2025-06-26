
const Alert = ({ type = 'error', message, onClose }) => {
  // Definimos los estilos base y los específicos para cada tipo
  const baseClasses = 'p-4 mb-4 text-sm rounded-lg relative';
  
  const typeClasses = {
    error: 'bg-red-900 bg-opacity-30 text-red-200 border border-red-700',
    success: 'bg-green-900 bg-opacity-30 text-green-200 border border-green-700',
    warning: 'bg-yellow-900 bg-opacity-30 text-yellow-200 border border-yellow-700',
  };

  // Si el mensaje está vacío, no renderizamos nada
  if (!message) {
    return null;
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}: </span> {message}
      
      {/* Botón opcional para cerrar la alerta */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Cerrar"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;