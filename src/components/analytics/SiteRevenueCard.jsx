import React, { useState, useEffect } from 'react';
import { Store, MapPin, TrendingUp, Award } from 'lucide-react';
import apiService from '../../api/services';

const SiteRevenueCard = ({ startDate, endDate, triggerFetch }) => {
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
      const data = await apiService.getRevenueBySite(startDate, endDate);
      setRevenueData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Colores para cada sede
  const siteColors = [
    { bg: 'from-blue-900/40 to-cyan-900/40', border: 'border-blue-500/50', accent: 'bg-blue-500', text: 'text-blue-400' },
    { bg: 'from-purple-900/40 to-pink-900/40', border: 'border-purple-500/50', accent: 'bg-purple-500', text: 'text-purple-400' },
    { bg: 'from-green-900/40 to-emerald-900/40', border: 'border-green-500/50', accent: 'bg-green-500', text: 'text-green-400' },
    { bg: 'from-orange-900/40 to-red-900/40', border: 'border-orange-500/50', accent: 'bg-orange-500', text: 'text-orange-400' },
    { bg: 'from-indigo-900/40 to-blue-900/40', border: 'border-indigo-500/50', accent: 'bg-indigo-500', text: 'text-indigo-400' }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/30 to-black-900/30 rounded-xl shadow-md p-12 text-center border border-blue-700">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 font-medium">Cargando recaudo por sede...</p>
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
        <Store className="mx-auto text-slate-300 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          Sin datos de recaudo por sede
        </h3>
        <p className="text-slate-500">
          Selecciona un período y presiona "Consultar"
        </p>
      </div>
    );
  }

  const getTopSite = () => {
    if (!revenueData.data || revenueData.data.length === 0) return null;
    return revenueData.data[0];
  };

  const topSite = getTopSite();

  return (
    <div className="space-y-6">

      {/* Sede Destacada */}
      {topSite && (
        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl shadow-lg p-6 border-2 border-yellow-500/50">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-yellow-400" size={28} />
            <h3 className="text-xl font-bold text-yellow-400">🏆 Sede con Mayor Recaudo</h3>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-white mb-1">{topSite.siteName}</p>
              <p className="text-slate-300 text-sm">
                {topSite.appointmentCount} citas completadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">Total Recaudado</p>
              <p className="text-3xl font-bold text-yellow-400 break-all">
                {formatCurrency(topSite.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Sedes - Desktop: Tabla, Mobile: Tarjetas */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30 rounded-xl shadow-lg border-2 border-blue-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Desglose por Sede</h3>
        </div>

        {/* Vista de Tabla para Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/30 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Citas
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Recaudado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ganancia Neta
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Comisiones
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Promedio/Cita
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {revenueData.data.map((site, index) => {
                const colors = siteColors[index % siteColors.length];
                return (
                  <tr key={site.siteId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colors.accent} rounded-lg flex items-center justify-center`}>
                          <MapPin className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{site.siteName}</p>
                          <p className="text-xs text-slate-500">ID: {site.siteId.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full font-bold">
                        {site.appointmentCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">
                      {formatCurrency(site.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-400 font-bold">
                        {formatCurrency(site.netRevenue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-purple-400 font-bold">
                        {formatCurrency(site.totalCommissions)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300 font-semibold">
                      {formatCurrency(site.averageRevenuePerAppointment)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Vista de Tarjetas para Mobile */}
        <div className="md:hidden p-4 space-y-4">
          {revenueData.data.map((site, index) => {
            const colors = siteColors[index % siteColors.length];
            return (
              <div 
                key={site.siteId} 
                className={`bg-gradient-to-br ${colors.bg} rounded-lg p-4 border-2 ${colors.border}`}
              >
                {/* Header de la tarjeta */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-600/30">
                  <div className={`w-12 h-12 ${colors.accent} rounded-lg flex items-center justify-center`}>
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">{site.siteName}</p>
                    <p className="text-xs text-slate-400">ID: {site.siteId.slice(-6)}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full font-bold text-lg">
                    {site.appointmentCount}
                  </div>
                </div>

                {/* Información financiera */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Total Recaudado</span>
                    <span className="font-bold text-white text-lg break-all">
                      {formatCurrency(site.totalRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-green-900/20 -mx-4 px-4 py-2 rounded">
                    <span className="text-slate-300 text-sm font-medium">
                      Ganancia Neta
                    </span>
                    <span className="text-green-400 font-bold break-all">
                      {formatCurrency(site.netRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-purple-900/20 -mx-4 px-4 py-2 rounded">
                    <span className="text-slate-300 text-sm font-medium">
                      Comisiones
                    </span>
                    <span className="text-purple-400 font-bold break-all">
                      {formatCurrency(site.totalCommissions)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-600/30">
                    <span className="text-slate-400 text-xs font-medium">Promedio por Cita</span>
                    <span className="text-slate-300 font-semibold break-all">
                      {formatCurrency(site.averageRevenuePerAppointment)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfico de Comparación */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/30  rounded-xl shadow-lg p-6 border-2 border-blue-700">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Comparación de Sedes</h3>
        </div>

        <div className="space-y-4">
          {revenueData.data.map((site, index) => {
            const colors = siteColors[index % siteColors.length];
            const percentage = (site.totalRevenue / revenueData.totals.totalRevenue) * 100;
            
            return (
              <div key={site.siteId}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${colors.accent} rounded-full`}></div>
                    <span className="text-white font-semibold text-sm">{site.siteName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{formatCurrency(site.totalRevenue)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.accent} text-white`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${colors.accent} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SiteRevenueCard;