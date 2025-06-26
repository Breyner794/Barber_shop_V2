import React from "react";
import SkeletonButtons from "./SkeletonButtons"; // Importa el botón individual

const SkeletonButtonGroup = () => {
  return (
    // El DIV contenedor con las clases flex vive DENTRO de este componente
    <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-1/3">
        <SkeletonButtons />
      </div>
      <div className="w-full sm:w-2/3">
        <SkeletonButtons />
      </div>
    </div>
  );
};

export default SkeletonButtonGroup;
