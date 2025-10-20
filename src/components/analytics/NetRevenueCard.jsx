import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Percent,
  PiggyBank,
  CreditCard,
  Scissors,
  Users,
} from "lucide-react";
import apiService from "../../api/services";
import formatCurrency from "../../../src/utils/formatCurrency.jsx";

const NetRevenueCard = ({ startDate, endDate, triggerFetch }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startDate && endDate && triggerFetch > 0) {
      fetchData();
    }
  }, [triggerFetch]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getNetRevenueByDateRange(
        startDate,
        endDate
      );
      setRevenueData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    bgColor,
    percentage,
  }) => (
    <div
      className={`${bgColor} rounded-xl shadow-lg p-6 border-2 ${color} transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-3 rounded-lg ${color
            .replace("border-", "bg-")
            .replace("400", "500")}`}
        >
          <Icon className="text-white" size={28} />
        </div>
        {percentage && (
          <div className={`px-3 py-1 rounded-full bg-white/20`}>
            <span className="text-sm font-bold text-white">{percentage}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-300 text-sm font-semibold mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-2xl lg:text-3xl font-bold text-white mb-1 break-all">{value}</p>
      {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
    </div>
  );

  const ProgressBar = ({ label, value, total, color, percentage }) => {
    const widthPercentage = total > 0 ? (value / total) * 100 : 0;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold text-sm">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">
              {formatCurrency(value)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${color} text-white`}
            >
              {percentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-2`}
            style={{ width: `${widthPercentage}%` }}
          >
            {widthPercentage > 10 && (
              <span className="text-white text-xs font-bold">
                {widthPercentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 rounded-xl shadow-md p-12 text-center border border-blue-700">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-medium">
          Cargando datos de ganancia neta...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
        <p className="text-red-300 font-medium">❌ Error: {error}</p>
      </div>
    );
  }

  if (!revenueData?.data) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 rounded-xl shadow-md p-12 text-center border border-blue-700">
        <PiggyBank className="mx-auto text-slate-300 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          Sin datos de ganancia neta
        </h3>
        <p className="text-slate-500">
          Selecciona un período y presiona "Consultar"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Ingresos Brutos"
          value={formatCurrency(revenueData.data.grossRevenue)}
          subtitle="Total de servicios"
          color="border-blue-400"
          bgColor="bg-gradient-to-br from-blue-900/40 to-blue-900/40"
        />

        <StatCard
          icon={PiggyBank}
          title="Ganancia Neta"
          value={formatCurrency(revenueData.data.netRevenue)}
          subtitle="Para el negocio"
          color="border-green-600"
          bgColor="bg-gradient-to-br from-blue-900/40 to-green-900/40"
          percentage={revenueData.data.netRevenuePercentage}
        />

        <StatCard
          icon={CreditCard}
          title="Comisiones"
          value={formatCurrency(revenueData.data.totalCommissions)}
          subtitle="Para barberos"
          color="border-purple-400"
          bgColor="bg-gradient-to-br from-blue-900/40 to-purple-900/40"
          percentage={revenueData.data.commissionPercentage}
        />

        <StatCard
          icon={Users}
          title="Citas Completadas"
          value={revenueData.data.totalAppointments}
          subtitle={`Promedio: ${formatCurrency(
            revenueData.data.grossRevenue / revenueData.data.totalAppointments
          )}`}
          color="border-orange-600"
          bgColor="bg-gradient-to-br from-blue-900/40 to-orange-900/40"
        />
      </div>

      {/* Distribución de Ingresos */}
      <div className="bg-gradient-to-br from-black-900/30 to-blue-900/30 rounded-xl p-6 border-2 border-blue-800">
        <div className="flex items-center gap-3 mb-6">
          <Percent className="text-white" size={24} />
          <h2 className="text-xl font-semibold text-white">
            Distribución de Ingresos
          </h2>
        </div>

        <ProgressBar
          label="Ganancia Neta del Negocio"
          value={revenueData.data.netRevenue}
          total={revenueData.data.grossRevenue}
          color="bg-green-500"
          percentage={revenueData.data.netRevenuePercentage}
        />

        <ProgressBar
          label="Comisiones a Barberos"
          value={revenueData.data.totalCommissions}
          total={revenueData.data.grossRevenue}
          color="bg-purple-500"
          percentage={revenueData.data.commissionPercentage}
        />
      </div>

      {/* Resumen Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose Financiero */}
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl shadow-lg p-6 border-2 border-green-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <PiggyBank className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-green-400">
              Desglose Financiero
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
              <span className="text-slate-300 font-medium">
                💰 Ingresos Totales
              </span>
              <span className="text-white font-bold text-lg">
                {formatCurrency(revenueData.data.grossRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/50">
              <span className="text-purple-300 font-medium">
                ✂️ Comisiones (37.5%)
              </span>
              <span className="text-purple-200 font-bold text-lg">
                - {formatCurrency(revenueData.data.totalCommissions)}
              </span>
            </div>

            <div className="border-t-2 border-green-500/50 pt-3">
              <div className="flex justify-between items-center p-4 bg-green-900/50 rounded-lg border-2 border-green-500">
                <span className="text-green-300 font-bold text-lg">
                  🏪 Ganancia Neta
                </span>
                <span className="text-green-400 font-bold text-2xl">
                  {formatCurrency(revenueData.data.netRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Adicionales */}
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl shadow-lg p-6 border-2 border-blue-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-blue-400">
              Métricas de Rendimiento
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm font-medium">
                  Ingreso Promedio por Cita
                </span>
                <Scissors className="text-blue-400" size={18} />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(
                  revenueData.data.grossRevenue /
                    revenueData.data.totalAppointments
                )}
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm font-medium">
                  Ganancia Neta por Cita
                </span>
                <DollarSign className="text-green-400" size={18} />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(
                  revenueData.data.netRevenue /
                    revenueData.data.totalAppointments
                )}
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm font-medium">
                  Comisión Promedio
                </span>
                <CreditCard className="text-purple-400" size={18} />
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(
                  revenueData.data.totalCommissions /
                    revenueData.data.totalAppointments
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Período de Consulta */}
      <div className="text-center p-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-lg">
        <p className="text-white text-sm">
          📅 Período analizado:{" "}
          <span className="font-semibold">{revenueData.startDate}</span> al{" "}
          <span className="font-semibold">{revenueData.endDate}</span>
        </p>
      </div>
    </div>
  );
};

export default NetRevenueCard;
