import React from 'react';
import { CRMLead, PQRSItem } from '../types';

interface CrmDashboardProps {
  leads: CRMLead[];
  pqrsList: PQRSItem[];
  onNavigateTab: (tab: 'leads' | 'pqrs' | 'sheets') => void;
  googleSheetConfigured: boolean;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  leads,
  pqrsList,
  onNavigateTab,
  googleSheetConfigured,
}) => {
  // Compute metrics
  const totalLeads = leads.length;
  const pendingPqrs = pqrsList.filter((p) => p.status !== 'Respondida / Cerrada').length;
  const overduePqrs = pqrsList.filter((p) => {
    if (p.status === 'Respondida / Cerrada') return false;
    const days = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return days > 15;
  }).length;

  const contactedCount = leads.filter(
    (l) => l.status === 'Contactado' || l.status === 'Cita Agendada'
  ).length;

  const inProcessCount = leads.filter(
    (l) => l.status === 'En trámite de crédito' || l.status === 'Venta Cerrada'
  ).length;

  // Project breakdown
  const alamosCount = leads.filter(
    (l) => l.project.toLowerCase().includes('álamo') || l.project.toLowerCase().includes('alamo')
  ).length;
  const samanCount = leads.filter(
    (l) => l.project.toLowerCase().includes('samán') || l.project.toLowerCase().includes('saman')
  ).length;
  const generalCount = totalLeads - (alamosCount + samanCount);

  const alamosPercent = totalLeads ? Math.round((alamosCount / totalLeads) * 100) : 0;
  const samanPercent = totalLeads ? Math.round((samanCount / totalLeads) * 100) : 0;
  const generalPercent = totalLeads ? Math.round((generalCount / totalLeads) * 100) : 0;

  // Channel breakdown
  const sourceForm = leads.filter((l) => l.source === 'formulario').length;
  const sourceCalc = leads.filter((l) => l.source === 'calculadora').length;
  const sourceChat = leads.filter((l) => l.source === 'chatbot').length;
  const sourcePqrs = pqrsList.length;
  const totalInteractions = totalLeads + sourcePqrs;

  // Status Funnel
  const statusFunnel = [
    { label: 'Nuevo', count: leads.filter((l) => l.status === 'Nuevo').length, color: 'bg-blue-500' },
    { label: 'Contactado', count: leads.filter((l) => l.status === 'Contactado').length, color: 'bg-amber-500' },
    { label: 'Cita Agendada', count: leads.filter((l) => l.status === 'Cita Agendada').length, color: 'bg-emerald-500' },
    { label: 'En trámite de crédito', count: leads.filter((l) => l.status === 'En trámite de crédito').length, color: 'bg-indigo-500' },
    { label: 'Venta Cerrada', count: leads.filter((l) => l.status === 'Venta Cerrada').length, color: 'bg-[#86c33c]' },
    { label: 'Descartado', count: leads.filter((l) => l.status === 'Descartado').length, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E2620] via-[#2A342D] to-[#364239] rounded-3xl p-6 sm:p-8 text-white border border-[#3E4D41] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#86c33c] text-2xl">monitoring</span>
            <span className="text-xs font-semibold text-[#86c33c] uppercase tracking-widest">
              Panel de Control Central
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Métricas Comerciales &amp; Atención VIS
          </h2>
          <p className="text-xs sm:text-sm text-[#B3C1B6] max-w-xl font-light">
            Seguimiento en tiempo real de prospectos capturados desde la web, estado del Sisbén y radicados de PQRS
            con plazos legales en Cartago.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-xs flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                googleSheetConfigured ? 'bg-[#86c33c] animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-white/90">
              Google Sheet: <strong>{googleSheetConfigured ? 'Sincronizado' : 'Pendiente URL'}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('sheets')}
            className="px-4 py-2 bg-[#86c33c] hover:bg-[#97d64d] text-[#132A13] font-bold text-xs rounded-2xl transition-all shadow cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Ver Sincronización</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs hover:border-[#86c33c] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#054316]/10 text-[#054316] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <span className="text-[11px] font-semibold text-[#054316] bg-[#054316]/10 px-2.5 py-1 rounded-full">
              Todos los canales
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6B6B54] uppercase tracking-wider block">
            Total Prospectos (Leads)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#2A2A2A]">{totalLeads}</span>
            <span className="text-xs text-[#054316] font-semibold">Familias interesadas</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEB] text-[11px] text-[#6B6B54] flex items-center justify-between">
            <span>Nuevos sin contactar:</span>
            <strong className="text-[#054316]">
              {leads.filter((l) => l.status === 'Nuevo').length}
            </strong>
          </div>
        </div>

        {/* Card 2: PQRS Pendientes */}
        <div
          onClick={() => onNavigateTab('pqrs')}
          className="bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs hover:border-[#C1694F] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C1694F]/10 text-[#C1694F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">contact_mail</span>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                overduePqrs > 0
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-[#C1694F]/10 text-[#C1694F]'
              }`}
            >
              {overduePqrs > 0 ? `${overduePqrs} Vencidas` : 'Término 15 días'}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6B6B54] uppercase tracking-wider block">
            PQRS Pendientes
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#2A2A2A]">{pendingPqrs}</span>
            <span className="text-xs text-[#C1694F] font-semibold">Por responder</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEB] text-[11px] text-[#6B6B54] flex items-center justify-between">
            <span>Respondidas y cerradas:</span>
            <strong className="text-[#4A4A30]">
              {pqrsList.filter((p) => p.status === 'Respondida / Cerrada').length}
            </strong>
          </div>
        </div>

        {/* Card 3: Clientes Contactados */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs hover:border-[#4A4A30] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4A4A30]/10 text-[#4A4A30] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
            </div>
            <span className="text-[11px] font-semibold text-[#4A4A30] bg-[#4A4A30]/10 px-2.5 py-1 rounded-full">
              Fase Activa
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6B6B54] uppercase tracking-wider block">
            Clientes Contactados
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#2A2A2A]">{contactedCount}</span>
            <span className="text-xs text-[#4A4A30] font-semibold">En asesoría comercial</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEB] text-[11px] text-[#6B6B54] flex items-center justify-between">
            <span>Citas presenciales agendadas:</span>
            <strong className="text-[#054316]">
              {leads.filter((l) => l.status === 'Cita Agendada').length}
            </strong>
          </div>
        </div>

        {/* Card 4: Ventas en Proceso */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs hover:border-[#86c33c] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#86c33c]/20 text-[#054316] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">real_estate_agent</span>
            </div>
            <span className="text-[11px] font-semibold text-[#054316] bg-[#86c33c]/20 px-2.5 py-1 rounded-full">
              Cierres &amp; Crédito
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6B6B54] uppercase tracking-wider block">
            Ventas en Proceso
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#2A2A2A]">{inProcessCount}</span>
            <span className="text-xs text-[#054316] font-semibold">Crédito o Separación</span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F0EFEB] text-[11px] text-[#6B6B54] flex items-center justify-between">
            <span>Ventas ya cerradas:</span>
            <strong className="text-[#054316]">
              {leads.filter((l) => l.status === 'Venta Cerrada').length}
            </strong>
          </div>
        </div>
      </div>

      {/* Interactive Charts: Solicitudes por Proyecto & Por Canal de Origen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Solicitudes por Proyecto (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
            <div>
              <span className="text-xs font-semibold text-[#C1694F] uppercase tracking-wider block">
                Demanda Inmobiliaria VIS
              </span>
              <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
                Solicitudes por Proyecto (Álamos vs. El Samán)
              </h3>
            </div>
            <span className="text-xs text-[#6B6B54] font-medium">Cartago, Valle</span>
          </div>

          {/* Comparative Progress Bars */}
          <div className="space-y-5">
            {/* Los Álamos */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#2A2A2A] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#054316]" />
                  Urbanización Los Álamos (Casas VIS)
                </span>
                <span className="font-mono font-bold text-[#054316]">
                  {alamosCount} solicitudes ({alamosPercent}%)
                </span>
              </div>
              <div className="h-4 w-full bg-[#F0EFEB] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#054316] rounded-full transition-all duration-700"
                  style={{ width: `${alamosPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6B6B54]">
                Sector Norte Cartago · Casas desde 65 m² hasta 78 m² · 135 SMMLV
              </p>
            </div>

            {/* El Samán */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#2A2A2A] flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C1694F]" />
                  Residencial El Samán (Apartamentos VIS)
                </span>
                <span className="font-mono font-bold text-[#C1694F]">
                  {samanCount} solicitudes ({samanPercent}%)
                </span>
              </div>
              <div className="h-4 w-full bg-[#F0EFEB] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#C1694F] rounded-full transition-all duration-700"
                  style={{ width: `${samanPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6B6B54]">
                Vía Zaragoza · Apartamentos de 48 m² y 54 m² con piscina · 110 SMMLV
              </p>
            </div>

            {/* General */}
            {generalCount > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2A2A2A] flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#9E9E8E]" />
                    Asesoría General en Subsidios
                  </span>
                  <span className="font-mono font-bold text-[#6B6B54]">
                    {generalCount} solicitudes ({generalPercent}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-[#F0EFEB] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#9E9E8E] rounded-full transition-all duration-700"
                    style={{ width: `${generalPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick takeaway */}
          <div className="p-4 bg-[#F8FAF3] rounded-2xl border border-[#D5DDD2] text-xs text-[#41493F] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#054316] text-xl shrink-0">insights</span>
            <div>
              <strong className="text-[#054316] block font-bold">Resumen de Preferencia:</strong>
              El proyecto con mayor demanda actualmente es{' '}
              <strong>{alamosCount >= samanCount ? 'Urbanización Los Álamos' : 'Residencial El Samán'}</strong> con{' '}
              {Math.max(alamosCount, samanCount)} solicitudes directas. Las familias cartagüeñas buscan principalmente
              aplicar a Mi Casa Ya y Comfamiliar.
            </div>
          </div>
        </div>

        {/* Solicitudes por Canal de Origen (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB]">
              <div>
                <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider block">
                  Captación Omnicanal
                </span>
                <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
                  Solicitudes por Canal de Origen
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#2A2A2A]">{totalInteractions} total</span>
            </div>

            <div className="space-y-4 mt-5">
              {/* Formulario Asesoría */}
              <div className="p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">description</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2A2A2A] block">Formulario Web Asesoría</span>
                    <span className="text-[10px] text-[#6B6B54]">Página principal de contacto</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#2A2A2A]">{sourceForm}</span>
                  <span className="text-[10px] text-[#6B6B54] block">
                    {totalInteractions ? Math.round((sourceForm / totalInteractions) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Calculadora VIS */}
              <div className="p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#86c33c]/20 text-[#054316] flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">calculate</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2A2A2A] block">Simulador Financiero VIS</span>
                    <span className="text-[10px] text-[#6B6B54]">Cálculo de cuota y subsidios</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#2A2A2A]">{sourceCalc}</span>
                  <span className="text-[10px] text-[#6B6B54] block">
                    {totalInteractions ? Math.round((sourceCalc / totalInteractions) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Asistente Virtual Mariana */}
              <div className="p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">smart_toy</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2A2A2A] block">Asistente Virtual Mariana</span>
                    <span className="text-[10px] text-[#6B6B54]">Chatbot IA y captura conversacional</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#2A2A2A]">{sourceChat}</span>
                  <span className="text-[10px] text-[#6B6B54] block">
                    {totalInteractions ? Math.round((sourceChat / totalInteractions) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Canal PQRS */}
              <div className="p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2A2A2A] block">Canal Oficial PQRS</span>
                    <span className="text-[10px] text-[#6B6B54]">Atención al ciudadano y reclamos</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#2A2A2A]">{sourcePqrs}</span>
                  <span className="text-[10px] text-[#6B6B54] block">
                    {totalInteractions ? Math.round((sourcePqrs / totalInteractions) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0EFEB] flex justify-between items-center text-xs">
            <span className="text-[#6B6B54]">Base de datos centralizada</span>
            <button
              type="button"
              onClick={() => onNavigateTab('leads')}
              className="font-bold text-[#054316] hover:underline cursor-pointer"
            >
              Ver todos los prospectos &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Embudo de Estados Comerciales (Funnel) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F0EFEB]">
          <div>
            <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider block">
              Proceso Comercial VIS
            </span>
            <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
              Embudo de Conversión de Prospectos
            </h3>
          </div>
          <span className="text-xs text-[#6B6B54]">
            De contacto inicial a cierre de encargo fiduciario
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {statusFunnel.map((item) => (
            <div
              key={item.label}
              className="p-4 bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl text-center space-y-2"
            >
              <span className={`inline-block w-3 h-3 rounded-full ${item.color}`} />
              <div className="text-2xl font-black text-[#2A2A2A]">{item.count}</div>
              <span className="text-[11px] font-semibold text-[#6B6B54] block leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
