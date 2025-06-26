
const ProgressBar = ({ currentStep, totalSteps = 5}) => {
    const steps = ['Servicios', 'Sede', 'Barbero', 'Horario', 'Datos'];
    const progressPercentage = ((currentStep - 1)/(totalSteps - 1)) * 100;

    return (
      <div className="w-full max-w-2xl mx-auto mb-8 px-4">
        {/* Nombres de los pasos */}
        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`transition-colors duration-500 ${
                index + 1 <= currentStep ? "font-bold text-white" : ""
              }`}
            >
              {step}
            </span>
          ))}
        </div>

        {/* Barra de progreso visual */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 via-white to-red-500 rounded-full h-2 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
}

export default ProgressBar;