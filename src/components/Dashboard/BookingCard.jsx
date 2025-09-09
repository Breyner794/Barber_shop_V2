import React, { useState} from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  Bell,
  History,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Scissors,
  Calendar,
  Info,
  Clock,
  LoaderCircle,
  Lock,
  ClipboardCheck,
  Mail,
  Hash,
  Footprints,
  AlertTriangle, 
  RefreshCw, 
  Home,
  Phone, 
  MessageCircle
} from "lucide-react"; // Added Mail, Hash, Walk icons
import apiService from "../../api/services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import BookingForm from "./BookingForm"; // Ajusta la ruta si es necesario
import WalkinForm from "./WalkinForm.jsx";
import Swal from "sweetalert2";

const getStatusStyles = (status) => {
  const styles = {
    pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmada: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completada: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelada: "bg-red-500/10 text-red-400 border-red-500/20",
    "no-asistio": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return styles[status] || styles["no-asistio"];
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pendiente":
      return <Clock className="w-4 h-4" />;
    case "confirmada":
      return <CheckCircle className="w-4 h-4" />;
    case "completada":
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case "cancelada":
      return <XCircle className="w-4 h-4" />;
    case "no-asistio":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const BookingCard = ({
  booking,
  onStatusChange,
  onEdit,
  onDeleteOrCancel,
  isHistory = false,
}) => {
  const [currentStatus, setCurrentStatus] = useState(booking.status);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const { currentUser } = useAuth();
  const isAdmin =
    currentUser.role === "admin" || currentUser.role === "superadmin";
  const isBarber = currentUser.role === "barbero";

  const isDisabled = isHistory && !isAdmin;
  const isLocked = isHistory && !isAdmin;

  const handleLocalStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onStatusChange(booking.id, newStatus);
  };

  const handleDeleteOrCancelClick = async () => {
    if (!currentUser) {
      Swal.fire(
        "Error",
        "Necesitas estar autenticado para realizar esta acción.",
        "error"
      );
      return;
    }

    let result;
    if (isBarber) {
      result = await Swal.fire({
        title: "Cancelar Cita",
        html: `
          <p>Estás a punto de cancelar la cita de <strong>${
            booking.clientName
          }</strong> con el servicio de <strong>${
          booking.serviceName
        }</strong> para el <strong>${format(
          parseISO(booking.date),
          "EEEE, d 'de' MMMM",
          { locale: es }
        )}</strong> a las <strong>${booking.startTime}</strong>.</p>
          <p class="mt-4">Por favor, ingresa la razón de la cancelación:</p>
          <textarea id="cancellation-reason" class="swal2-textarea" placeholder="Motivo de la cancelación..." style="width: 100%; height: 100px;"></textarea>
          <p class="text-sm text-gray-500 mt-2">Esta acción cambiará el estado de la cita a "cancelada" y registrará la razón en las notas.</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Cancelar Cita",
        cancelButtonText: "No, Mantener Cita",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        focusConfirm: false,
        preConfirm: () => {
          const reason = Swal.getPopup().querySelector(
            "#cancellation-reason"
          ).value;
          if (!reason || reason.trim() === "") {
            Swal.showValidationMessage(
              "La razón de cancelación es obligatoria."
            );
            return false;
          }
          return reason;
        },customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
        background: "#1F2937",
        color: "#E5E7EB",
      });

      if (result.isConfirmed) {
        performDeleteOrCancel(result.value);
      }
    } else if (isAdmin) {
      result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `
          <p>Estás a punto de <strong>eliminar permanentemente</strong> la cita de <strong>${
            booking.clientName
          }</strong> con el servicio de <strong>${
          booking.serviceName
        }</strong> para el <strong>${format(
          parseISO(booking.date),
          "EEEE, d 'de' MMMM",
          { locale: es }
        )}</strong> a las <strong>${booking.startTime}</strong>.</p>
          <p class="mt-4 text-red-600 font-semibold">¡Esta acción es irreversible y la data se perderá por completo!</p>
        `,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sí, Eliminar Permanentemente",
        cancelButtonText: "No, Cancelar",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
        background: "#1F2937",
        color: "#E5E7EB",
      });

      if (result.isConfirmed) {
        performDeleteOrCancel();
      }
    } else {
      Swal.fire(
        "Permiso Denegado",
        "No tienes los permisos para realizar esta acción.",
        "error"
      );
    }
  };

  const performDeleteOrCancel = async (cancellationReason = null) => {
    setIsProcessingAction(true);
    try {
      let payload = {};
      if (cancellationReason) {
        payload.cancellationReason = cancellationReason;
      }

      const response = await apiService.deleteAppointment(booking.id, payload);

      Swal.fire({
        icon: "success",
        title:"Éxito", 
        text: response.message,
        confirmButtonColor: "#2cb9fd",
        customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
        background: "#1F2937",
        color: "#E5E7EB",
      });

      if (onDeleteOrCancel) {
        onDeleteOrCancel(booking.id, response.data);
      }
    } catch (error) {
      //console.error("Error al procesar la cita:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Hubo un error al procesar la cita.",
        "error"
      );
    } finally {
      setIsProcessingAction(false);
    }
  };

  const generateWhatsAppMessage = (booking) => {
    // Formatear la fecha si existe
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };

    const messages = {
      
      statusBased: (() => {
        switch (booking.status) {
          case "pendiente":
            return `Hola ${booking.clientName}! 👋

Te contacto para confirmar tu cita. ¿Podrías confirmarme si sigues disponible?

¡Espero tu respuesta! 😁` ;

          case "confirmada":
            return `Hola ${booking.clientName}! ✅

Tu cita está confirmada para el ${formatDate(booking.date)} a las ${booking.startTime}.

Si tienes alguna pregunta, no dudes en escribirme.`;

          case "completada":
            return `Hola ${booking.clientName}! 

Gracias por visitarnos. Espero que hayas tenido una excelente experiencia.

¿Te gustaría programar tu próxima cita? 😊`;

          default:
            return `Hola ${booking.clientName}, espero que estés bien. Te contacto desde Caballeros del señor 💈.`;
        }
      })(),
    };

    return messages.statusBased;
  };

  // Función para crear la URL de WhatsApp
const createWhatsAppURL = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

  return (
    <div
      className={`bg-gray-800/50 border-2 ${
        isHistory ? "border-gray-700/50" : "border-gray-700"
      } rounded-2xl shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:scale-[1.02] flex flex-col`}
    >
      <div className="p-5 flex justify-between items-start border-b border-gray-700 gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg text-white truncate">
            {booking.clientName}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            <span className="text-sm text-gray-400">{booking.clientPhone}</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${booking.clientPhone}`}
                className="flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all text-sm min-h-[44px]"
              >
                <Phone className="w-4 h-4" />
                <span className="sm:hidden">Llamar</span>
              </a>
              <a
                href={createWhatsAppURL(
                  booking.clientPhone,
                  generateWhatsAppMessage(booking)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all text-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className={`relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusStyles(
            currentStatus
          )}`}
        >
          {getStatusIcon(currentStatus)}
          <select
            value={currentStatus}
            onChange={handleLocalStatusChange}
            disabled={isDisabled || isProcessingAction}
            className="bg-transparent appearance-none outline-none cursor-pointer font-medium text-center disabled:cursor-not-allowed"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              paddingRight: "1rem",
            }}
          >
            <option className="bg-gray-800 text-white" value="pendiente">
              Pendiente
            </option>
            <option className="bg-gray-800 text-white" value="confirmada">
              Confirmada
            </option>
            <option className="bg-gray-800 text-white" value="completada">
              Completada
            </option>
            <option className="bg-gray-800 text-white " value="cancelada">
              Cancelada
            </option>
            <option className="bg-gray-800 text-white" value="no-asistio">
              No Asistió
            </option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-1 pointer-events-none" />
        </div>
      </div>
      <div className="p-5 space-y-4 flex-grow">
        <InfoDetail
          icon={<Scissors />}
          label="Servicio"
          value={booking.serviceName}
        />
        <InfoDetail
          icon={<User />}
          label="Barbero"
          value={booking.barberName}
        />
        <InfoDetail
          icon={<Calendar />}
          label="Fecha y Hora"
          value={`${format(parseISO(booking.date), "EEEE, d 'de' MMMM", {
            locale: es,
          })} a las ${booking.startTime}`}
        />

        {/* --- NUEVOS CAMPOS --- */}
        {booking.clientEmail && booking.clientEmail !== "N/A" && (
          <InfoDetail
            icon={<Mail />}
            label="Email Cliente"
            value={booking.clientEmail}
          />
        )}
        {booking.confirmationCode && booking.confirmationCode !== "N/A" && (
          <InfoDetail
            icon={<Hash />}
            label="Cód. Confirmación"
            value={booking.confirmationCode}
          />
        )}
        {booking.isWalkIn && (
          <InfoDetail
            icon={<Footprints />}
            label="Tipo de Cita"
            value="Servicio sin cita (Walk-in)"
            isHighlight={true}
          />
        )}
        {booking.completedAt && (
          <InfoDetail
            icon={<Clock />}
            label="Completado el"
            value={format(parseISO(booking.completedAt), "dd/MM/yyyy HH:mm", {
              locale: es,
            })}
          />
        )}
        {/* --- FIN NUEVOS CAMPOS --- */}

        {booking.notes && (
          <InfoDetail
            icon={<Info />}
            label="Notas"
            value={`"${booking.notes}"`}
            isItalic={true}
          />
        )}
      </div>
      <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex justify-end">
        {isLocked ? (
          <div
            className="w-full bg-gray-700/40 text-gray-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed text-sm font-semibold"
            title="Solo los administradores pueden modificar citas históricas."
          >
            <Lock className="w-4 h-4" />
            <span>Bloqueado (Solo Vista)</span>
          </div>
        ) : (
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={() => onEdit(booking)}
              disabled={isProcessingAction}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              title="Editar Reserva"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteOrCancelClick}
              disabled={isProcessingAction}
              className="px-3 py-1.5 rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Cancelar/Eliminar Reserva"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">Cancelar/Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoDetail = ({
  icon,
  label,
  value,
  isItalic = false,
  isHighlight = false,
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`flex-shrink-0 ${
        isHighlight ? "text-yellow-400" : "text-blue-400"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p
        className={`font-medium text-white ${isItalic ? "italic" : ""} ${
          isHighlight ? "text-yellow-300 font-semibold" : ""
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default BookingCard;