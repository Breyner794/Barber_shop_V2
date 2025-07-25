import React, { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  Plus,
  Copy,
  AlertTriangle,
  LoaderCircle,
  Save
} from "lucide-react";

const WeeklyTemplateView = ({ initialSchedule, onSave, isSaving }) => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [activeDay, setActiveDay] = useState(1); // 1 = Lunes
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: "", endTime: "" });
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSchedule, setOriginalSchedule] = useState(initialSchedule); // 👈 NUEVO: Guardamos el schedule original

  // 👈 NUEVO: Resetear cuando llegue un nuevo initialSchedule
  useEffect(() => {
    setSchedule(initialSchedule);
    setOriginalSchedule(initialSchedule); // Guardamos como referencia original
    setHasUnsavedChanges(false); // Reseteamos cambios
  }, [initialSchedule]);

  // 👈 NUEVO: Detectar cambios comparando con el schedule original
  useEffect(() => {
    if (!originalSchedule || !schedule) return;
    
    // Comparamos profundamente el schedule actual con el original
    const hasChanges = JSON.stringify(schedule) !== JSON.stringify(originalSchedule);
    setHasUnsavedChanges(hasChanges);
  }, [schedule, originalSchedule]);

  // 👈 NUEVO: Resetear hasUnsavedChanges cuando se guarda exitosamente
  useEffect(() => {
    if (!isSaving && hasUnsavedChanges) {
      // Aquí podrías agregar lógica adicional si necesitas saber cuándo se completó el guardado
      // Por ejemplo, si tienes un prop `saveSuccess` podrías usarlo aquí
    }
  }, [isSaving]);

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  if (!schedule) {
    return <div className="w-full flex justify-center items-center p-8"><LoaderCircle className="animate-spin w-8 h-8" /></div>;
  }

  const activeDayData = schedule[activeDay];

  const handleToggleWorkingDay = () => {
    setSchedule((p) => ({
      ...p,
      [activeDay]: {
        ...p[activeDay],
        isWorkingDay: !p[activeDay].isWorkingDay,
      },
    }));
    // 👈 CAMBIO: No necesitas setHasUnsavedChanges aquí, el useEffect lo detectará automáticamente
  };

  const handleAddTimeSlot = () => {
    setError('');
    const {startTime, endTime} = newTimeSlot;
    
    if(!startTime || !endTime){
        setError('Se requieren tanto la hora de inicio como la hora de finalización.');
        return;
    }

    if(startTime >= endTime){
        setError('La hora de finalización debe ser posterior a la hora de inicio.')
        return;
    }

    const hasOverlap = activeDayData.timeSlots.some(slot => startTime < slot.endTime && endTime > slot.startTime);
    if(hasOverlap){
       setError('La nueva ranura se superpone con una existente.');
       return;
    }

    setSchedule((p)=>{
        const newSlots = [...p [activeDay].timeSlots, newTimeSlot].sort((a,b)=> a.startTime.localeCompare(b.startTime));
        return {...p, [activeDay]: {...p [activeDay], timeSlots: newSlots}};
    });
    setNewTimeSlot({startTime: '', endTime: ''});
    // 👈 CAMBIO: No necesitas setHasUnsavedChanges aquí, el useEffect lo detectará automáticamente
  };

  const handleRemoveTimeSlot = (indexToRemove) => {
    setSchedule((p) => {
        const filteredSlots = p[activeDay].timeSlots.filter((_, index) => index !== indexToRemove)
        return {...p, [activeDay]: {...p[activeDay], timeSlots: filteredSlots}};
    });
    // 👈 CAMBIO: No necesitas setHasUnsavedChanges aquí, el useEffect lo detectará automáticamente
  }

  const handleCopySchedule = (e) => {
    const sourceDayIndex = e.target.value;
    if (sourceDayIndex === "") return;
    
    const sourceSchedule = schedule[sourceDayIndex];
    setSchedule((p) => ({
      ...p,
      [activeDay]: { ...sourceSchedule }
    }));
    e.target.value = ""; // Reseteamos el select
    // 👈 CAMBIO: No necesitas setHasUnsavedChanges aquí, el useEffect lo detectará automáticamente
  };

  // 👈 NUEVO: Función para manejar el guardado
  const handleSave = async () => {
    try {
      await onSave(schedule);
      // Una vez guardado exitosamente, actualizamos la referencia original
      setOriginalSchedule(schedule);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      // Aquí podrías mostrar un mensaje de error si lo deseas
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl w-full h-full flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">
          Plantilla recurrente semanal
        </h3>
        <p className="text-sm text-gray-400">
          Establezca el horario laboral predeterminado para las próximas semanas.
        </p>
      </div>

      {/* Sección de avisos y sugerencias */}
      <div className="p-4 space-y-3">
        {/* Panel de información importante */}
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2">📋 Importante:</p>
              <ul className="text-sm space-y-1 text-blue-200">
                <li>• Siempre presiona <strong>"Guardar plantilla"</strong> para confirmar cualquier cambio</li>
                <li>• <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Switch verde
                  </span> = día laboral (disponible para citas con horarios excepcionales)</li>
                <li>• <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Switch gris
                  </span> = día no laboral (sin citas disponibles)</li>
                <li>• Por defecto cada día inicia como <strong>día laboral</strong> para mejor UX</li>
                <li>• Los horarios excepcionales <strong>sobrescriben</strong> tu disponibilidad semanal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sugerencias rápidas */}
        <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">💡</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-2">Sugerencias Rápidas:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="bg-purple-500/5 rounded-lg p-2">
                  <p className="font-medium">⏰ Duración sugerida::</p>
                  <p className="text-xs text-purple-200">Slots de 1 hora por cita</p>
                </div>
                <div className="bg-purple-500/5 rounded-lg p-2">
                  <p className="font-medium">🍽️ Hora de almuerzo:</p>
                  <p className="text-xs text-purple-200">12:00 PM - 1:00 PM</p>
                </div>
                <div className="bg-purple-500/5 rounded-lg p-2">
                  <p className="font-medium">📅 Fines de semana:</p>
                  <p className="text-xs text-purple-200">Horarios reducidos</p>
                </div>
                <div className="bg-purple-500/5 rounded-lg p-2">
                  <p className="font-medium">🔄 Copiar horario:</p>
                  <p className="text-xs text-purple-200">Usa el selector inferior</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Aviso de cambios pendientes */}
        {hasUnsavedChanges && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">⚠️ Cambios Pendientes de Guardar</p>
              <p className="text-sm text-amber-200">
                Tus cambios son temporales y no están guardados aún. 
                <span className="font-medium"> Presiona "Guardar plantilla"</span> para que los cambios tomen efecto 
                y los clientes puedan ver esta disponibilidad.
              </p>
              <p className="text-xs text-amber-300/80 mt-2">
                💡 <strong>Tip:</strong> Usa "Borrar" si quieres volver al horario semanal normal
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Panel Izquierdo: Selector de Días */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 p-3 space-y-1">
          {[1, 2, 3, 4, 5, 6, 0].map((index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200 flex justify-between items-center ${
                activeDay === index
                  ? "bg-blue-600/80 text-white shadow-lg scale-[1.02]"
                  : "hover:bg-gray-700/50 hover:scale-[1.01]"
              }`}
            >
              <span className="font-semibold">{daysOfWeek[index]}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  schedule[index].isWorkingDay
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-gray-600/50 text-gray-300 border border-gray-500/30"
                }`}
              >
                {schedule[index].isWorkingDay
                  ? `${schedule[index].timeSlots.length} franjas horarias`
                  : "Día libre"}
              </span>
            </button>
          ))}
        </div>

        {/* Panel Derecho: Editor de Horarios */}
        <div className="w-full md:w-2/3 p-5 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-white">
              Edición: {daysOfWeek[activeDay]}
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium transition-colors ${
                  activeDayData.isWorkingDay ? "text-white" : "text-gray-500"
                }`}
              >
                Día laborable
              </span>
              <button
                onClick={handleToggleWorkingDay}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 cursor-pointer ${
                  activeDayData.isWorkingDay ? "bg-green-500 shadow-lg shadow-green-500/30" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    activeDayData.isWorkingDay
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {activeDayData.isWorkingDay ? (
            <div className="space-y-4">
              {activeDayData.timeSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/30 hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTimeSlot(i)}
                    className="p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {activeDayData.timeSlots.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-700/20 rounded-xl border-2 border-dashed border-gray-600">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Aún no se han añadido franjas horarias.</p>
                  <p className="text-sm mt-1">Agrega tu primer horario de trabajo abajo ⬇️</p>
                </div>
              )}
              
              <div className="border-t border-gray-700 pt-4 space-y-3">
                <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" />
                  Añadir nueva franja horaria:
                </h5>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 font-medium">
                      Inicio:
                    </label>
                    <input
                      type="time"
                      value={newTimeSlot.startTime}
                      onChange={(e) =>
                        setNewTimeSlot({
                          ...newTimeSlot,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full bg-gray-900 text-white p-2.5 border border-gray-600 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1 font-medium">
                      Fin:
                    </label>
                    <input
                      type="time"
                      value={newTimeSlot.endTime}
                      onChange={(e) =>
                        setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })
                      }
                      className="w-full bg-gray-900 text-white p-2.5 border border-gray-600 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleAddTimeSlot}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg sm:w-auto w-full justify-center flex cursor-pointer transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="relative w-full sm:w-2/3">
                  <Copy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    onChange={handleCopySchedule}
                    className="w-full appearance-none pl-9 p-2.5 bg-gray-700 text-sm rounded-lg 
                    border border-gray-600 focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all hover:bg-gray-600"
                  >
                    <option value="">🔄 Copiar horario de...</option>
                    {[1, 2, 3, 4, 5, 6, 0].map(
                      (i) =>
                        activeDay !== i && (
                          <option key={i} value={i}>
                            {daysOfWeek[i]} {schedule[i].isWorkingDay ? `(${schedule[i].timeSlots.length} franjas)` : '(Día libre)'}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-700/20 rounded-xl border-2 border-dashed border-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-600/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">😴</span>
              </div>
              <p className="font-bold text-lg mb-2">Este es un día libre.</p>
              <p className="text-sm">
                Habilite "Día laborable" arriba para agregar disponibilidad.
              </p>
              <div className="mt-4 text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3 max-w-sm mx-auto">
                <p><strong>Nota:</strong> Si guardas este estado, este día específico no tendrá citas disponibles, 
                incluso si tu horario semanal normal indica que sí trabajas.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-between items-center">
        {/* Indicador de estado */}
        <div className="flex items-center gap-2 text-sm">
          {hasUnsavedChanges ? (
            <>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-300 font-medium">Cambios sin guardar</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-300 font-medium">Plantilla guardada</span>
            </>
          )}
        </div>

        {/* Botón de guardado */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 font-bold py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer ${
            hasUnsavedChanges 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105' 
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {isSaving ? (
             <Clock className="w-5 h-5 animate-spin" />
          ) : (
             <Save className="w-5 h-5" />
          )}
          {isSaving ? "Guardando..." : "Guardar plantilla"}
        </button>
      </div>
    </div>
  );
};

export default WeeklyTemplateView;
