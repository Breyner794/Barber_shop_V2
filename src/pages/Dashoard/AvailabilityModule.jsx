import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../api/services.js";
import {
  LoaderCircle,
  AlertTriangle,
  ListChecks,
  Calendar,
  Settings,
} from "lucide-react";
import WeeklyTemplateView from "../../components/Dashboard/Availability/WeeklyTemplateView.jsx";
import CalendarAndExceptionsView from "../../components/Dashboard/Availability/CalendarAndExceptionsView";
import BarberSelector from "../../components/Dashboard/Availability/BarberSelector.jsx";

const AvailabilityModule = () => {
  //const { users } = mockData;
  const [barbersList, setBarbersList] = useState([]);
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState("weekly");
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [originalSchedule, setOriginalSchedule] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [hasNoAvailability, setHasNoAvailability] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(()=>{
  //   if(currentUser){
  //     setSelectedBarberId(currentUser._id);
  //   }
  // },[currentUser]);

  // useEffect(()=>{
  //   const loadBarbers = async () =>{
  //     if(privilegedRoles.includes(currentUser?.role)){
  //       try{
  //         const barbers = await apiService.getAllBarbers();
  //         setBarbersList(barbers)
  //       }catch (error){
  //         console.error("Failed to load barbers list for admin view.", error);
  //       }
  //     }
  //   };
  //   loadBarbers();
  // }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return; // Esperamos a que currentUser exista

    const privilegedRoles = ["admin", "superadmin"];
    const isPrivileged = privilegedRoles.includes(currentUser?.role);

    if (isPrivileged) {
      const loadBarbers = async () => {
        setIsLoading(true);
        try {
          const barbers = await apiService.getAllBarbers();
          setBarbersList(barbers);
          
          if (barbers.length > 0) {
            // Por defecto, seleccionamos el primer barbero de la lista
            setSelectedBarberId(barbers[0]._id);
          } else {
            setHasNoAvailability(true);
            setIsLoading(false);
          }
        } catch (err) {
          setError("Failed to load barbers list.");
          setIsLoading(false);
        }
      };
      loadBarbers();
    } else {
      // Si no es un usuario privilegiado, es un barbero normal.
      // Establecemos el ID a sí mismo y la lista de barberos vacía.
      setBarbersList([]);
      setSelectedBarberId(currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!selectedBarberId) {
      if(!isLoading) setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }

    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);
      setHasNoAvailability(false);
      setWeeklySchedule(null);

      try {
        const availabilityData = await apiService.getBarberAvailability(
          selectedBarberId
        );
        if (!availabilityData) {
          throw new Error("API did not return data.");
        }
        if (availabilityData.length === 0) {
          setHasNoAvailability(true);
        } else {
          const scheduleObject = {};

          for (let i = 0; i < 7; i++) {
            scheduleObject[i] = { isWorkingDay: false, timeSlots: [] };
          }
          availabilityData.forEach((day) => {
            scheduleObject[day.dayOfWeek] = {
              isWorkingDay: day.isWorkingDay,
              timeSlots: day.timeSlots,
            };
          });
          setWeeklySchedule(scheduleObject);
          setOriginalSchedule(scheduleObject);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedBarberId]);

  const handleSaveSchedule = async (editedSchedule) => {
    setIsSaving(true);
    setError(null);

    if (!originalSchedule) {
      setError("Cannot save, original schedule not loaded.");
      setIsSaving(false);
      return;
    }

    const promises = [];

    for (let i = 0; i < 7; i++) {
      if (
        JSON.stringify(originalSchedule[i]) !==
        JSON.stringify(editedSchedule[i])
      ) {
        promises.push(
          apiService.saveDayAvailability(selectedBarberId, i, editedSchedule[i])
        );
      }
    }

    if (promises.length === 0) {
      console.log("No changes to save.");
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all(promises);
      setWeeklySchedule(editedSchedule);
      setOriginalSchedule(editedSchedule);
      //Implementar un pop-up
    } catch (err) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const isPrivilegedUser = ['admin', 'superadmin'].includes(currentUser?.role);
  const selectedBarberObject =
    barbersList.find((user) => user._id === selectedBarberId) || currentUser;

  return (
    <div className="bg-gray-900 min-h-full p-4 sm:p-6">
      {/* --- INICIO DEL DEPURADOR VISUAL (puedes borrar este div después) --- */}
      {/* <div className="bg-gray-700 p-2 mb-4 rounded-lg text-xs text-white font-mono">
        <p>-- DEBUG INFO --</p>
        <p>
          currentUser ID:{" "}
          <span className="text-yellow-400">{currentUser?.id || "null"}</span>
        </p>
        <p>
          currentUser Role:{" "}
          <span className="text-yellow-400">{currentUser?.role || "null"}</span>
        </p>
        <p>
          Is Privileged User?:{" "}
          <span className="text-green-400">{isPrivilegedUser.toString()}</span>
        </p>
        <p>
          Selected Barber ID:{" "}
          <span className="text-yellow-400">{selectedBarberId || "null"}</span>
        </p>
        <p>
          Barbers List Count:{" "}
          <span className="text-yellow-400">{barbersList.length}</span>
        </p>
      </div> */}
      {/* --- FIN DEL DEPURADOR VISUAL --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
            Availability
          </span>
        </h2>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-800 border border-gray-700">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              viewMode === "weekly"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <ListChecks className="w-5 h-5 inline mr-2" /> Weekly Template
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" /> Daily Exceptions
          </button>
        </div>
      </div>

        <div className="mb-6">
        <BarberSelector
          barbers={barbersList}
          selectedBarber={selectedBarberObject}
          onSelect={setSelectedBarberId}
          currentUser={currentUser}
          isPrivileged={isPrivilegedUser}
        />
      </div>
     

      {/* --- ESTRUCTURA DE RENDERIZADO CORREGIDA --- */}
      <div className="min-h-[60vh] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex w-full items-center justify-center">
            <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="ml-4 text-xl text-gray-400">
              Loading Availability...
            </p>
          </div>
        ) : hasNoAvailability ? (
          <div className="flex w-full flex-col items-center justify-center text-center bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-700">
            <Calendar className="w-16 h-16 text-sky-400" />
            <h3 className="mt-4 text-2xl font-bold text-white">
              No Schedule Found
            </h3>
            <p className="mt-2 max-w-md text-gray-400">
              The selected barber has not yet configured their weekly recurring
              availability.
            </p>
            <button
              onClick={() => {
                const defaultSchedule = {};
                for (let i = 0; i < 7; i++) {
                  defaultSchedule[i] = {
                    isWorkingDay: i > 0 && i < 6,
                    timeSlots: [],
                  };
                }
                setWeeklySchedule(defaultSchedule);
                setOriginalSchedule(defaultSchedule);
                setHasNoAvailability(false);
              }}
              className="mt-6 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Set Up Schedule Now
            </button>
          </div>
        ) : weeklySchedule ? (
          <>
            {error && (
              <div className="flex w-full flex-col items-center justify-center bg-red-500/10 p-8 rounded-2xl">
                <AlertTriangle className="w-12 h-12 text-red-400" />
                <p className="mt-4 text-xl font-bold text-red-400">
                  An Error Occurred
                </p>
                <p className="mt-2 text-gray-300">{error}</p>
              </div>
            )}

            {!isLoading &&
              !error &&
              !hasNoAvailability &&
              weeklySchedule &&
              (viewMode === "weekly" ? (
                <WeeklyTemplateView
                  initialSchedule={weeklySchedule}
                  onSave={handleSaveSchedule}
                  isSaving={isSaving}
                />
              ) : (
                <CalendarAndExceptionsView
                  weeklySchedule={weeklySchedule}
                  onExceptionSave={() => {}}
                />
              ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AvailabilityModule;
