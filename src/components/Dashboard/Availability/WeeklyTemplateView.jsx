import React, { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  Plus,
  Copy,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";

const WeeklyTemplateView = ({ initialSchedule, onSave, isSaving }) => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [activeDay, setActiveDay] = useState(1); // 1 = Lunes
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: "", endTime: "" });
  const [error, setError] = useState("");

   useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);
  
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (!schedule) {
    return <div className="w-full flex justify-center items-center p-8"><LoaderCircle className="animate-spin w-8 h-8" /></div>;
  }

  const activeDayData = schedule[activeDay];

  const handleToggleWorkingDay = () =>
    setSchedule((p) => ({
      ...p,
      [activeDay]: {
        ...p[activeDay],
        isWorkingDay: !p[activeDay].isWorkingDay,
      },
    }));

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
  };

  const handleRemoveTimeSlot = (indexToRemove) => {
    setSchedule((p) => {
        const filteredSlots = p[activeDay].timeSlots.filter((_, index) => index !== indexToRemove)
        return {...p, [activeDay]: {...p[activeDay], timeSlots: filteredSlots}};
    })
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
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl w-full h-full flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">
          Weekly Recurring Template
        </h3>
        <p className="text-sm text-gray-400">
          Set the default working hours for all future weeks.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Panel Izquierdo: Selector de Días */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 p-3 space-y-1">
          {[1, 2, 3, 4, 5, 6, 0].map((index) => (
            <button
              key={index}
              onClick={() => setActiveDay(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${
                activeDay === index
                  ? "bg-blue-600/80 text-white"
                  : "hover:bg-gray-700/50"
              }`}
            >
              <span className="font-semibold">{daysOfWeek[index]}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  schedule[index].isWorkingDay
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {schedule[index].isWorkingDay
                  ? `${schedule[index].timeSlots.length} slots`
                  : "Day Off"}
              </span>
            </button>
          ))}
        </div>

        {/* Panel Derecho: Editor de Horarios */}
        <div className="w-full md:w-2/3 p-5 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-white">
              Editing: {daysOfWeek[activeDay]}
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  activeDayData.isWorkingDay ? "text-white" : "text-gray-500"
                }`}
              >
                Working Day
              </span>
              <button
                onClick={handleToggleWorkingDay}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  activeDayData.isWorkingDay ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTimeSlot(i)}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeDayData.timeSlots.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No time slots added yet.
                </p>
              )}
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <h5 className="text-sm font-semibold text-white">
                  Add new slot:
                </h5>

                {error && (
                  <div className="p-2 rounded-md bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">
                      Start:
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
                      className="w-full bg-gray-900 text-white p-2 border border-gray-600 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">
                      End:
                    </label>
                    <input
                      type="time"
                      value={newTimeSlot.endTime}
                      onChange={(e) =>
                        setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })
                      }
                      className="w-full bg-gray-900 text-white p-2 border border-gray-600 rounded-md"
                    />
                  </div>
                  <button
                    onClick={handleAddTimeSlot}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md sm:w-auto w-full justify-center flex"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="relative w-full sm:w-1/2">
                  <Copy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    onChange={handleCopySchedule}
                    className="w-full appearance-none pl-9 p-2 bg-gray-700 text-sm rounded-md border border-gray-600 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Copy schedule from...</option>
                    {[1, 2, 3, 4, 5, 6, 0].map(
                      (i) =>
                        activeDay !== i && (
                          <option key={i} value={i}>
                            {daysOfWeek[i]}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="font-bold">This is a day off.</p>
              <p className="text-sm mt-1">
                Enable "Working Day" to add availability.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex justify-end">
        <button
          onClick={() => onSave(schedule)}
          disabled={isSaving}
          className="px-8 py-2 w-40 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Save Template"
          )}
        </button>
      </div>
    </div>
  );
};

export default WeeklyTemplateView;
