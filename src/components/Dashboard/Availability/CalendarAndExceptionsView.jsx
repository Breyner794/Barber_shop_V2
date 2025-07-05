import React, { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  AlertCircle,
  AlertTriangle,
  X
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths, 
  subMonths
} from "date-fns";
import { es } from "date-fns/locale";
import apiService from "../../../api/services";
import Swal from "sweetalert2";

const CalendarAndExceptionsView = ({ selectedBarberId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailySchedule, setDailySchedule] = useState({
    timeSlots: [],
    isWorkingDay: false,
    
  });
  const [originalSchedule, setOriginalSchedule] = useState({
    timeSlots: [],
    isWorkingDay: false,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    if (error) {
      
      timer = setTimeout(() => {
        setError(null); // Limpia el error
      }, 5000); // 5000 milisegundos = 5 segundos
    }
    return () => {
      if (timer) {
        clearTimeout(timer); 
      }
    };
  }, [error]); 

  useEffect(() => {
    if (!selectedBarberId || !selectedDate) return;
    const fecthBarberId = async () => {
      setIsLoading(true);
      setError(null)
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        const exceptionData = await apiService.getAvailabilityExceptions(
          selectedBarberId,
          formattedDate
        );

        if (exceptionData) {
          const scheduleData = {
            timeSlots: exceptionData.timeSlots,
            isWorkingDay: exceptionData.isWorkingDay,
          };
          setDailySchedule(scheduleData)
          setOriginalSchedule(scheduleData);
        }else{
          const defaultSchedule ={
            timeSlots: [],
            isWorkingDay: false,
          };
          setDailySchedule(defaultSchedule);
          setOriginalSchedule(defaultSchedule);
        }
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error("Error loading daily schedule:", error);
        const defaultSchedule ={
            timeSlots: [],
            isWorkingDay: false,
          };
          setDailySchedule(defaultSchedule);
          setOriginalSchedule(defaultSchedule);
          setHasUnsavedChanges(false);
      } finally {
        setIsLoading(false);
      }
    };
    fecthBarberId();
  }, [selectedDate, selectedBarberId]);

  const checkForChanges = (newSchedule) =>{
    const hasChanges = JSON.stringify(newSchedule) !== JSON.stringify(originalSchedule);
    setHasUnsavedChanges(hasChanges);
  }

  const handleDeleteException = async () => {
    if (!selectedBarberId) return;
    try {
    setIsSaving(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
    const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará toda la configuración de disponibilidad para este día y no se puede deshacer.',
    icon: 'warning', // Puedes usar 'warning', 'error', 'info', 'question'
    showCancelButton: true,
    confirmButtonColor: '#DC2626', // Rojo de Tailwind (red-600)
    cancelButtonColor: '#6B7280', // Gris de Tailwind (gray-500/600)
    confirmButtonText: 'Sí, ¡eliminar!',
    cancelButtonText: 'Cancelar',
    reverseButtons: true, // Para que el botón "Cancelar" esté a la izquierda y "Eliminar" a la derecha
    customClass: {
      popup: 'swal2-dark-mode', // Clase personalizada para aplicar estilos, si tienes un modo oscuro global
      title: 'text-white',
      htmlContainer: 'text-gray-300',
      confirmButton: 'px-4 py-2 rounded-lg text-sm font-semibold',
      cancelButton: 'px-4 py-2 rounded-lg text-sm font-semibold',
    },
    background: '#1F2937', // Fondo oscuro (gray-800)
    color: '#E5E7EB', // Color de texto general (gray-200)
  });
    
    if (result.isConfirmed) {
      await apiService.deleteBarberExceptionForDate(selectedBarberId, formattedDate);
      
      const defaultSchedule = {
        timeSlots: [],
        isWorkingDay: false,
        reason: "",
      };
      
      setDailySchedule(defaultSchedule);
      setOriginalSchedule(defaultSchedule);
      setHasUnsavedChanges(false);
      
      console.log("Excepción eliminada!");
      await Swal.fire({
        icon: "success",
        title: "Se elimino correctamente la disponibilidad del día",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
          confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });
    };

    } catch (err) {
      console.error("Error al eliminar la excepción", err);
      Swal.fire({
        title: "¡Error!", // Puedes hacer el título más expresivo
        text: `No se pudo eliminar la disponibilidad del día. Detalles: ${err.message || err}`,
        icon: "error", // El icono de error rojo por defecto
        confirmButtonText: "Entendido", // Un texto de botón más amigable
        confirmButtonColor: "#2563EB", // Un color de botón azul (blue-600 de Tailwind)
        customClass: {
          popup: "swal2-dark-mode", // Clase personalizada para tu modo oscuro global (si la tienes definida)
          title: "text-white", // Título blanco para contrastar con el fondo oscuro
          htmlContainer: "text-gray-300", // Texto del mensaje en gris claro
          confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold", // Estilos para el botón de confirmar
        },
        background: "#1F2937", // Fondo oscuro (gray-800 de Tailwind)
        color: "#E5E7EB", // Color del texto principal (gray-200 de Tailwind)
      });

    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveException = async () => {
    if (!selectedBarberId) return;

    setIsSaving(true);
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    try {
      await apiService.saveBarberExceptionForDate(
        selectedBarberId,
        formattedDate,
        dailySchedule.timeSlots,
        dailySchedule.isWorkingDay
      );

      console.log("Excepcion Guardada!");

      setOriginalSchedule({
        timeSlots: dailySchedule.timeSlots,
        isWorkingDay: dailySchedule.isWorkingDay,
      }),

      setHasUnsavedChanges(false);

      await Swal.fire({
        icon: "success",
        title: "Los Cambios Se  Aplicaron Exitosamente",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "swal2-dark-mode",
          title: "text-white",
          htmlContainer: "text-gray-300",
          confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold",
        },
        background: "#1F2937",
        color: "#E5E7EB",
      });

      //pensar en agregar un pop-poup
    } catch (err) {
      console.error("Error al guardar la excepción", err);
      Swal.fire({
        title: "¡Error!", // Puedes hacer el título más expresivo
        text: `No se pudo guardar la disponibilidad del día. Detalles: ${err.message || err}`,
        icon: "error", // El icono de error rojo por defecto
        confirmButtonText: "Entendido", // Un texto de botón más amigable
        confirmButtonColor: "#2563EB", // Un color de botón azul (blue-600 de Tailwind)
        customClass: {
          popup: "swal2-dark-mode", // Clase personalizada para tu modo oscuro global (si la tienes definida)
          title: "text-white", // Título blanco para contrastar con el fondo oscuro
          htmlContainer: "text-gray-300", // Texto del mensaje en gris claro
          confirmButton: "px-4 py-2 rounded-lg text-sm font-semibold", // Estilos para el botón de confirmar
        },
        background: "#1F2937", // Fondo oscuro (gray-800 de Tailwind)
        color: "#E5E7EB", // Color del texto principal (gray-200 de Tailwind)
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleIsWorkingDay = () => {
    const isNowWorking = !dailySchedule.isWorkingDay;
    const slots = isNowWorking ? dailySchedule.timeSlots : [];
    const newSchedule= {
      timeSlots: slots,
      isWorkingDay: isNowWorking,
    };
    setDailySchedule(newSchedule);
    checkForChanges(newSchedule);
  };

  const addTimeSlot = () => {
    setError("");
    const { startTime, endTime } = newTimeSlot;

    if (!startTime || !endTime) {
      setError(
        "Se requieren tanto la hora de inicio como la hora de finalización."
      );
      return;
    }

    if (startTime >= endTime) {
      setError(
        "La hora de finalización debe ser posterior a la hora de inicio."
      );
      return;
    }

    const hasOverlap = dailySchedule.timeSlots.some(
      (slot) => startTime < slot.endTime && endTime > slot.startTime
    );
    if (hasOverlap) {
      setError("La nueva ranura se superpone con una existente.");
      return;
    }

    const updatedSlots = [...dailySchedule.timeSlots, newTimeSlot].sort((a,b) => 
      a.startTime.localeCompare(b.startTime)
    );

    const newSchedule = {
      ...dailySchedule, 
      timeSlots: updatedSlots
    }

    setDailySchedule(newSchedule);
    checkForChanges(newSchedule);
    setNewTimeSlot({ startTime: "", endTime: "" });

  };

  const removeTimeSlot = (indexToRemove) => {
    const updatedSlots = dailySchedule.timeSlots.filter(
      (_, index) => index !== indexToRemove
    );
    
    const newSchedule = {
      ...dailySchedule,
      timeSlots: updatedSlots,
      isWorkingDay: updatedSlots.length > 0,
    };
    
    setDailySchedule(newSchedule);
    checkForChanges(newSchedule);
  };

  const CalendarView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeekShort = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

    return (
      <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-5 h-full">
        {/* --- INICIO DEL DEPURADOR VISUAL (puedes borrar este div después) --- */}
        {/* <div className="bg-gray-700 p-2 mb-4 rounded-lg text-xs text-white font-mono">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">
            -- DEBUGGER --
          </h4>
          <p>
            <strong>Barbero ID:</strong> {selectedBarberId || "N/A"}
          </p>
          <p>
            <strong>Fecha Seleccionada:</strong>{" "}
            {format(selectedDate, "yyyy-MM-dd")}
          </p>
          <p className="mt-2">
            <strong>Horario del Día (dailySchedule state):</strong>
          </p>
          <pre className="bg-black/30 p-2 rounded text-white text-[10px]">
            {JSON.stringify(dailySchedule, null, 2)}
          </pre>
          <p className="mt-2">
            <strong>Nuevo TimeSlot (input state):</strong>
          </p>
          <pre className="bg-black/30 p-2 rounded text-white text-[10px]">
            {JSON.stringify(newTimeSlot, null, 2)}
          </pre>
          {error && (
            <p className="mt-2">
              <strong>Error Actual:</strong>{" "}
              <span className="text-red-400 font-bold">{error}</span>
            </p>
          )}
        </div> */}
        {/* --- FIN DEL DEPURADOR VISUAL --- */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentMonth(
                prev=> subMonths(prev, 1)
              )
            }
            className="p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold text-white">
            {format(currentMonth, "EEEE d 'de' MMMM", { locale: es })}
          </h3>
          <button
            onClick={() =>
              setCurrentMonth(
                prev => addMonths(prev, 1)
              )
            }
            className="p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 font-bold mb-2">
          {daysOfWeekShort.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonthDay = isSameMonth(day, currentMonth);
            const today = isToday(day);
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  w-full h-10 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer
                  ${!isCurrentMonthDay && "text-gray-600 hover:bg-gray-700/50"}
                  ${
                    isCurrentMonthDay &&
                    (isSelected
                      ? "bg-cyan-500 text-white font-bold"
                      : today
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "hover:bg-gray-700")
                  }
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const DailyScheduleView = () => (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-white mb-1">
            Horario para
          </h3>
          <p className="text-cyan-400 font-bold text-xl mb-4">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleDeleteException}
            disabled={isSaving}
            className="flex items-center gap-2 bg-red-600 
            hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg 
            transition-colors disabled:bg-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
            Borrar
          </button>

          <button
            onClick={handleSaveException}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors ${
              hasUnsavedChanges
                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            } disabled:bg-gray-500`}
          >
            {isSaving ? (
              <Clock className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Guardando..." : "Guardar Día"}
          </button>
        </div>
      </div>

      {/* Mensaje de cambios no guardados */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-300 text-sm">
              <strong>Cambios temporales:</strong> Los cambios que haces aquí
              son solo de prueba. Presiona "Guardar Día" para confirmar y guardar
              este horario.
            </p>
          </div>
        </div>
      )}

      {/* Switch para marcar como día libre */}

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-sm font-medium ${
            dailySchedule.isWorkingDay ? "text-white" : "text-gray-500"
          }`}
        >
          Día Laboral
        </span>
        <button
          onClick={toggleIsWorkingDay}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            dailySchedule.isWorkingDay ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              dailySchedule.isWorkingDay ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto pr-2 ">
        {dailySchedule.isWorkingDay ? (
          <div className="space-y-4">
            {dailySchedule.timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium text-white">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
                <button
                  onClick={() => removeTimeSlot(index)}
                  className="p-1 text-red-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {dailySchedule.timeSlots.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aún no hay franjas horarias añadidas.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Día Libre</p>
            <p className="text-xs">No hay disponibilidad para este día.</p>
          </div>
        )}
      </div>

      {dailySchedule.isWorkingDay && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h4 className="font-semibold text-white mb-2 text-sm">
            Añadir una nueva franja horaria para este día:
          </h4>

          {error && (
            <div className="p-2 rounded-md bg-red-500/10 text-red-400 text-sm flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Inicio:</label>
              <input
                type="time"
                value={newTimeSlot.startTime}
                onChange={(e) =>
                  setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })
                }
                className="w-full bg-gray-900 text-white p-2 border border-gray-600 rounded-md cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">Fin:</label>
              <input
                type="time"
                value={newTimeSlot.endTime}
                onChange={(e) =>
                  setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })
                }
                className="w-full bg-gray-900 text-white p-2 border border-gray-600 rounded-md cursor-pointer"
              />
            </div>
            <button
              onClick={addTimeSlot}
              className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-md cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"> {/* Agrega items-start */}
  {/* Columna del Calendario */}
  <div className="flex flex-col">
    <CalendarView />
  </div>

  {/* Columna del Horario Diario con Altura Fija y Scroll */}
  <div className="flex flex-col"> {/* Contenedor para el DailyScheduleView */}
    <DailyScheduleView className="max-h-[600px] overflow-y-auto" /> {/* Clase para altura máxima y scroll */}
  </div>
</div>
  );
};

export default CalendarAndExceptionsView;
