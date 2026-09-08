import React, { useState } from 'react';
import { PQRSItem, CRMStaffUser } from '../types';

interface CrmPqrsModuleProps {
  pqrsList: PQRSItem[];
  currentUser: CRMStaffUser;
  onRespondPqrs: (pqrsId: string, officialResponse: string) => Promise<void>;
  onSyncWithGoogleSheet?: () => void;
}

export const CrmPqrsModule: React.FC<CrmPqrsModuleProps> = ({
  pqrsList,
  currentUser,
  onRespondPqrs,
  onSyncWithGoogleSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Selected PQRS for responding / closing
  const [selectedPqrs, setSelectedPqrs] = useState<PQRSItem | null>(null);
  const [officialResponseText, setOfficialResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Type badge styling
  const TYPE_BADGES: Record<string, { bg: string; text: string; border: string }> = {
    Petición: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Queja: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Reclamo: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Sugerencia: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

  // Helper to compute legal days indicator
  const getDeadlineDetails = (item: PQRSItem) => {
    const createdDate = new Date(item.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const legalDays = item.legalDeadlineDays || 15;
    const remainingDays = Math.max(0, legalDays - diffDays);
    const isClosed = item.status === 'Respondida / Cerrada';
    const isOverdue = !isClosed && diffDays > legalDays;

    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let label = `${remainingDays} días restantes (A tiempo)`;

    if (isClosed) {
      badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
      label = 'Respondida y Cerrada';
    } else if (isOverdue) {
      badgeClass = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      label = `¡Vencida por ${diffDays - legalDays} días!`;
    } else if (remainingDays <= 5) {
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      label = `¡Urgente: ${remainingDays} días para vencer!`;
    }

    return { diffDays, remainingDays, isClosed, isOverdue, badgeClass, label };
  };

  // Filtered PQRS list
  const filteredList = pqrsList.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.radicadoCode.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.phone.toLowerCase().includes(term) ||
      (item.email && item.email.toLowerCase().includes(term)) ||
      item.message.toLowerCase().includes(term);

    const matchesType = filterType === 'todos' || item.type === filterType;
    const matchesStatus =
      filterStatus === 'todos' ||
      (filterStatus === 'pendientes' && item.status !== 'Respondida / Cerrada') ||
      (filterStatus === 'cerradas' && item.status === 'Respondida / Cerrada');

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenModal = (item: PQRSItem) => {
    setSelectedPqrs(item);
    setOfficialResponseText(item.officialResponse || '');
    setCopiedResponse(false);
  };

  const handleRespondSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPqrs || !officialResponseText.trim()) return;

    setSubmittingResponse(true);
    try {
      await onRespondPqrs(selectedPqrs.id, officialResponseText.trim());
      setSelectedPqrs({
        ...selectedPqrs,
        status: 'Respondida / Cerrada',
        officialResponse: officialResponseText.trim(),
        respondedAt: new Date().toISOString(),
        respondedBy: `${currentUser.name} (${currentUser.role})`,
      });
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleCopyResponse = () => {
    if (!officialResponseText) return;
    navigator.clipboard.writeText(
      `Estimado/a ${selectedPqrs?.name},\n\nEn respuesta a su solicitud con radicado ${selectedPqrs?.radicadoCode} en Marín & Salgado Construcciones S.A.S.:\n\n"${officialResponseText}"\n\nAtentamente,\n${currentUser.name}\n${currentUser.role}\nMarín & Salgado Construcciones S.A.S.`
    );
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2500);
  };

  const getCitizenWhatsAppLink = (item: PQRSItem) => {
    const cleanPhone = item.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
    const text = encodeURIComponent(
      `Hola ${item.name}, te escribimos de Marín & Salgado Construcciones respecto a tu radicado ${item.radicadoCode} (${item.type}).`
    );
    return `https://wa.me/${fullPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C1694F] text-xl">gavel</span>
            <span className="text-xs font-semibold text-[#C1694F] uppercase tracking-wider">
              Atención al Ciudadano · Ley 1755 de 2015
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A2A2A]">
            Bandeja de Radicados PQRS
          </h2>
          <p className="text-xs text-[#6B6B54]">
            Control de términos legales (15 días hábiles), radicación electrónica y respuestas formales
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onSyncWithGoogleSheet && (
            <button
              type="button"
              onClick={onSyncWithGoogleSheet}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F0EFEB] hover:bg-[#E5E5DF] text-[#4A4A30] font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Sincronizar con Hoja PQRS</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Legal Notice */}
      <div className="p-4 bg-[#FAF9F5] border border-[#E5E5DF] rounded-2xl text-xs text-[#6B6B54] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#054316] text-xl shrink-0">verified_user</span>
          <div>
            <strong className="text-[#2A2A2A] font-bold">Semáforo de Cumplimiento Legal:</strong> Todo requerimiento
            debe ser atendido formalmente en un plazo máximo de <strong>15 días hábiles</strong>. El sistema calcula
            automáticamente los días hábiles y emite alertas de prioridad.
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> A tiempo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Urgente
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vencida
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E5DF] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#9E9E8E] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por radicado, nombre, teléfono..."
            className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl pl-10 pr-3 py-2 text-xs text-[#2A2A2A] placeholder:text-[#9E9E8E] focus:border-[#C1694F] focus:outline-none"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl px-3 py-2 text-xs text-[#2A2A2A] focus:border-[#C1694F] focus:outline-none"
          >
            <option value="todos">Todos los Tipos de Requerimiento</option>
            <option value="Petición">Peticiones</option>
            <option value="Queja">Quejas</option>
            <option value="Reclamo">Reclamos</option>
            <option value="Sugerencia">Sugerencias</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl px-3 py-2 text-xs text-[#2A2A2A] focus:border-[#C1694F] focus:outline-none"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendientes">Pendientes por responder</option>
            <option value="cerradas">Respondidas y cerradas</option>
          </select>
        </div>
      </div>

      {/* PQRS Table */}
      <div className="bg-white rounded-3xl border border-[#E5E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E5DF] text-[#6B6B54] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">N° Radicado</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Ciudadano Solicitante</th>
                <th className="py-3.5 px-4">Proyecto</th>
                <th className="py-3.5 px-4">Fecha Radicación</th>
                <th className="py-3.5 px-4">Término Legal (15 Días)</th>
                <th className="py-3.5 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEB]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B6B54]">
                    <span className="material-symbols-outlined text-3xl text-[#9E9E8E] block mb-2">
                      mark_email_read
                    </span>
                    No hay solicitudes de PQRS con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const deadline = getDeadlineDetails(item);
                  const typeBadge = TYPE_BADGES[item.type] || TYPE_BADGES.Petición;

                  return (
                    <tr key={item.id} className="hover:bg-[#FDFCF8] transition-colors">
                      {/* Radicado */}
                      <td className="py-4 px-4 font-mono font-bold text-[#2A2A2A]">
                        <span className="px-2 py-1 bg-[#F0EFEB] rounded-lg border border-[#E5E5DF] text-[11px]">
                          {item.radicadoCode}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}
                        >
                          {item.type}
                        </span>
                      </td>

                      {/* Solicitante */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#2A2A2A]">{item.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-[#6B6B54] mt-0.5">
                          <a
                            href={`tel:${item.phone}`}
                            className="hover:underline flex items-center gap-1 text-[#054316]"
                          >
                            <span className="material-symbols-outlined text-[13px]">call</span>
                            {item.phone}
                          </a>
                          {item.email && <span>· {item.email}</span>}
                        </div>
                      </td>

                      {/* Proyecto */}
                      <td className="py-4 px-4 text-[#4A4A30] font-medium">
                        {item.project || 'General'}
                      </td>

                      {/* Fecha */}
                      <td className="py-4 px-4 text-[#6B6B54] text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Término Legal */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${deadline.badgeClass}`}
                        >
                          {deadline.label}
                        </span>
                        {!deadline.isClosed && (
                          <span className="block text-[10px] text-[#6B6B54] mt-1">
                            Han pasado {deadline.diffDays} días desde la radicación
                          </span>
                        )}
                      </td>

                      {/* Acción */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer ${
                            item.status === 'Respondida / Cerrada'
                              ? 'bg-[#FAF9F5] text-[#2A2A2A] hover:bg-[#F0EFEB] border border-[#E5E5DF]'
                              : 'bg-[#C1694F] hover:bg-[#aa5840] text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {item.status === 'Respondida / Cerrada' ? 'visibility' : 'rate_review'}
                          </span>
                          <span>
                            {item.status === 'Respondida / Cerrada' ? 'Ver Respuesta' : 'Responder'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Responder y Cerrar Radicado */}
      {selectedPqrs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E5E5DF] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF9F5] border-b border-[#E5E5DF] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C1694F]">inventory</span>
                  <span className="font-mono font-bold text-sm bg-white px-2.5 py-1 rounded-md border border-[#E5E5DF]">
                    {selectedPqrs.radicadoCode}
                  </span>
                  <span className="text-xs font-bold text-[#C1694F]">{selectedPqrs.type}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#2A2A2A] mt-1.5">
                  Radicado de {selectedPqrs.name} · Proyecto {selectedPqrs.project}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPqrs(null)}
                className="w-8 h-8 rounded-full bg-[#E5E5DF] hover:bg-[#D5D5CF] text-[#2A2A2A] flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Citizen Query Original Message */}
              <div className="p-4 bg-[#F8FAF3] rounded-2xl border border-[#D5DDD2] text-xs space-y-2">
                <div className="flex items-center justify-between text-[#6B6B54]">
                  <span className="font-bold text-[#054316] uppercase tracking-wider text-[10px]">
                    Descripción Original del Requerimiento:
                  </span>
                  <span className="font-mono text-[11px]">
                    Radicado el{' '}
                    {new Date(selectedPqrs.createdAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <p className="text-[#2A2A2A] text-sm leading-relaxed whitespace-pre-wrap">
                  "{selectedPqrs.message}"
                </p>
                <div className="pt-2 border-t border-[#D5DDD2] flex items-center gap-4 text-[11px] text-[#6B6B54]">
                  <span>Tel: <strong>{selectedPqrs.phone}</strong></span>
                  {selectedPqrs.email && <span>Email: <strong>{selectedPqrs.email}</strong></span>}
                </div>
              </div>

              {/* Status info if already answered */}
              {selectedPqrs.status === 'Respondida / Cerrada' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Radicado Cerrado y Notificado</span>
                  </div>
                  <p className="text-blue-800 text-[11px]">
                    Respondido por <strong>{selectedPqrs.respondedBy}</strong> el{' '}
                    {selectedPqrs.respondedAt &&
                      new Date(selectedPqrs.respondedAt).toLocaleDateString('es-CO')}{' '}
                    a las{' '}
                    {selectedPqrs.respondedAt &&
                      new Date(selectedPqrs.respondedAt).toLocaleTimeString('es-CO')}
                  </p>
                </div>
              )}

              {/* Official Response Form */}
              <form onSubmit={handleRespondSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-1.5">
                    Respuesta Formal Institucional (Marín &amp; Salgado Construcciones S.A.S.)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={officialResponseText}
                    onChange={(e) => setOfficialResponseText(e.target.value)}
                    placeholder="Escriba la respuesta oficial para el ciudadano, detallando las acciones técnicas, jurídicas o comerciales tomadas..."
                    className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl p-4 text-xs text-[#2A2A2A] placeholder:text-[#9E9E8E] focus:border-[#C1694F] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E5E5DF] rounded-xl flex items-center justify-between text-xs">
                  <span className="text-[#6B6B54]">
                    Funcionario Responsable: <strong>{currentUser.name}</strong> ({currentUser.role})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyResponse}
                      disabled={!officialResponseText.trim()}
                      className="px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EFEB] text-[#2A2A2A] border border-[#E5E5DF] rounded-lg text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {copiedResponse ? '¡Copiado al Portapapeles!' : 'Copiar Texto Formal'}
                    </button>

                    <button
                      type="submit"
                      disabled={submittingResponse || !officialResponseText.trim()}
                      className="px-5 py-2 bg-[#C1694F] hover:bg-[#aa5840] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      <span>
                        {submittingResponse ? 'Guardando...' : 'Cerrar Radicado Oficialmente'}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E5DF] flex items-center justify-between text-xs">
              <a
                href={getCitizenWhatsAppLink(selectedPqrs)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#054316] font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Enviar Notificación a WhatsApp del Ciudadano</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedPqrs(null)}
                className="px-4 py-2 bg-[#E5E5DF] hover:bg-[#D5D5CF] text-[#2A2A2A] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
