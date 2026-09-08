import React, { useState } from 'react';
import { CRMLead, CRMLeadStatus, CRMLeadNote, CRMStaffUser } from '../types';

interface CrmLeadsModuleProps {
  leads: CRMLead[];
  currentUser: CRMStaffUser;
  onUpdateLeadStatus: (leadId: string, newStatus: CRMLeadStatus) => Promise<void>;
  onAddLeadNote: (leadId: string, noteText: string) => Promise<CRMLeadNote | null>;
  onSyncWithGoogleSheet?: () => void;
}

export const CrmLeadsModule: React.FC<CrmLeadsModuleProps> = ({
  leads,
  currentUser,
  onUpdateLeadStatus,
  onAddLeadNote,
  onSyncWithGoogleSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterSource, setFilterSource] = useState('todos');

  // Selected lead for notes and full detail modal
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Status colors & labels
  const STATUS_CONFIG: Record<
    CRMLeadStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    Nuevo: { label: 'Nuevo', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Contactado: { label: 'Contactado', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Cita Agendada': {
      label: 'Cita Agendada',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    'En trámite de crédito': {
      label: 'En trámite de crédito',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
    },
    'Venta Cerrada': {
      label: 'Venta Cerrada',
      bg: 'bg-lime-50',
      text: 'text-lime-800',
      border: 'border-lime-300',
    },
    Descartado: {
      label: 'Descartado',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
    },
  };

  const ALL_STATUSES: CRMLeadStatus[] = [
    'Nuevo',
    'Contactado',
    'Cita Agendada',
    'En trámite de crédito',
    'Venta Cerrada',
    'Descartado',
  ];

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    // search text
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      lead.name.toLowerCase().includes(term) ||
      lead.phone.toLowerCase().includes(term) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      lead.project.toLowerCase().includes(term) ||
      (lead.message && lead.message.toLowerCase().includes(term));

    // project filter
    const matchesProject =
      filterProject === 'todos' ||
      (filterProject === 'alamos' && (lead.project.toLowerCase().includes('álamo') || lead.project.toLowerCase().includes('alamo'))) ||
      (filterProject === 'saman' && (lead.project.toLowerCase().includes('samán') || lead.project.toLowerCase().includes('saman'))) ||
      (filterProject === 'general' && !lead.project.toLowerCase().includes('álamo') && !lead.project.toLowerCase().includes('alamo') && !lead.project.toLowerCase().includes('samán') && !lead.project.toLowerCase().includes('saman'));

    // status filter
    const matchesStatus = filterStatus === 'todos' || lead.status === filterStatus;

    // source filter
    const matchesSource = filterSource === 'todos' || lead.source === filterSource;

    return matchesSearch && matchesProject && matchesStatus && matchesSource;
  });

  // Handle status change
  const handleStatusChange = async (leadId: string, newStatus: CRMLeadStatus) => {
    setStatusUpdatingId(leadId);
    try {
      await onUpdateLeadStatus(leadId, newStatus);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handle submit note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    setAddingNote(true);
    try {
      const added = await onAddLeadNote(selectedLead.id, newNoteText.trim());
      if (added) {
        const updatedNotes = [added, ...(selectedLead.notes || [])];
        setSelectedLead({
          ...selectedLead,
          notes: updatedNotes,
        });
        setNewNoteText('');
      }
    } finally {
      setAddingNote(false);
    }
  };

  // Export to CSV/Excel with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Fecha Creacion',
      'Nombre Completo',
      'Telefono',
      'Correo Electronico',
      'Proyecto',
      'Estado Sisben / Subsidio',
      'Canal de Origen',
      'Estado CRM',
      'Consulta / Mensaje',
      'Precio Vivienda',
      'Subsidios Aplicables',
      'Cuota Mensual Est.',
      'Sincronizado a Google Sheet',
      'Numero de Notas',
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleDateString('es-CO')} ${new Date(l.createdAt).toLocaleTimeString('es-CO')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${l.project.replace(/"/g, '""')}"`,
      `"${(l.subsidyStatus || 'En validación').replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.calculatorDetails?.totalHousePrice || ''}"`,
      `"${l.calculatorDetails?.totalSubsidies || ''}"`,
      `"${l.calculatorDetails?.monthlyPayment || ''}"`,
      `"${l.syncedToGoogleSheet ? 'SI' : 'NO'}"`,
      `"${l.notes ? l.notes.length : 0}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Leads_Marin_y_Salgado_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp quick contact generator
  const getWhatsAppLink = (lead: CRMLead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
    const msg = encodeURIComponent(
      `Hola ${lead.name}, te saludamos de Marín & Salgado Construcciones S.A.S. respecto a tu interés en el proyecto ${lead.project} en Cartago. ¿Cómo podemos orientarte hoy con los subsidios de Mi Casa Ya y Cajas de Compensación?`
    );
    return `https://wa.me/${fullPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-[#E5E5DF] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#054316] text-xl">contacts</span>
            <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider">
              Gestión Comercial Activa
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A2A2A]">
            Base de Prospectos (Leads)
          </h2>
          <p className="text-xs text-[#6B6B54]">
            {filteredLeads.length} de {leads.length} clientes registrados desde canales web
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onSyncWithGoogleSheet && (
            <button
              type="button"
              onClick={onSyncWithGoogleSheet}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F0EFEB] hover:bg-[#E5E5DF] text-[#4A4A30] font-bold text-xs rounded-2xl transition-all cursor-pointer"
              title="Sincronizar leads con Google Sheet"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Sincronizar Sheet</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#054316] hover:bg-[#07591e] text-white font-bold text-xs rounded-2xl shadow transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exportar a Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E5DF] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#9E9E8E] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, tel, correo..."
              className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl pl-10 pr-3 py-2 text-xs text-[#2A2A2A] placeholder:text-[#9E9E8E] focus:border-[#054316] focus:outline-none"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl px-3 py-2 text-xs text-[#2A2A2A] focus:border-[#054316] focus:outline-none"
            >
              <option value="todos">Todos los Proyectos</option>
              <option value="alamos">Urbanización Los Álamos</option>
              <option value="saman">Residencial El Samán</option>
              <option value="general">Consulta General Subsidios</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl px-3 py-2 text-xs text-[#2A2A2A] focus:border-[#054316] focus:outline-none"
            >
              <option value="todos">Todos los Estados</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl px-3 py-2 text-xs text-[#2A2A2A] focus:border-[#054316] focus:outline-none"
            >
              <option value="todos">Todos los Canales</option>
              <option value="formulario">Formulario Web</option>
              <option value="calculadora">Calculadora Financiera</option>
              <option value="chatbot">Asistente Mariana (Chatbot)</option>
            </select>
          </div>
        </div>

        {/* Filter tags summary */}
        {(searchTerm || filterProject !== 'todos' || filterStatus !== 'todos' || filterSource !== 'todos') && (
          <div className="flex items-center gap-2 pt-2 text-[11px] text-[#6B6B54]">
            <span>Filtros activos:</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterProject('todos');
                setFilterStatus('todos');
                setFilterSource('todos');
              }}
              className="text-[#C1694F] font-bold hover:underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-[#E5E5DF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E5DF] text-[#6B6B54] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Cliente / Contacto</th>
                <th className="py-3.5 px-4">Proyecto</th>
                <th className="py-3.5 px-4">Sisbén / Subsidio</th>
                <th className="py-3.5 px-4">Canal</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Estado Comercial</th>
                <th className="py-3.5 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFEB]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6B6B54]">
                    <span className="material-symbols-outlined text-3xl text-[#9E9E8E] block mb-2">
                      person_search
                    </span>
                    No se encontraron prospectos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const statusConf = STATUS_CONFIG[lead.status] || STATUS_CONFIG.Nuevo;
                  return (
                    <tr key={lead.id} className="hover:bg-[#FDFCF8] transition-colors">
                      {/* Cliente */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#2A2A2A] text-sm">{lead.name}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-[#054316] font-mono hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">call</span>
                            {lead.phone}
                          </a>

                          <a
                            href={getWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#86c33c]/20 text-[#054316] px-2 py-0.5 rounded-full hover:bg-[#86c33c]/40 transition-colors"
                            title="Chatear en WhatsApp con mensaje personalizado"
                          >
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        {lead.email && (
                          <span className="text-[11px] text-[#6B6B54] block mt-0.5 truncate max-w-[200px]">
                            {lead.email}
                          </span>
                        )}
                      </td>

                      {/* Proyecto */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-[#2A2A2A] block">{lead.project}</span>
                        {lead.calculatorDetails && (
                          <span className="text-[10px] text-[#054316] font-semibold block mt-0.5">
                            Simulado: {lead.calculatorDetails.totalHousePrice}
                          </span>
                        )}
                      </td>

                      {/* Sisbén / Subsidio */}
                      <td className="py-4 px-4">
                        <span className="inline-block text-[11px] px-2 py-1 rounded-lg bg-[#F8FAF3] border border-[#D5DDD2] text-[#41493F]">
                          {lead.subsidyStatus || 'En validación'}
                        </span>
                      </td>

                      {/* Canal */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B6B54]">
                          {lead.source === 'calculadora' && (
                            <span className="material-symbols-outlined text-sm text-[#86c33c]">
                              calculate
                            </span>
                          )}
                          {lead.source === 'chatbot' && (
                            <span className="material-symbols-outlined text-sm text-purple-600">
                              smart_toy
                            </span>
                          )}
                          {lead.source === 'formulario' && (
                            <span className="material-symbols-outlined text-sm text-blue-600">
                              description
                            </span>
                          )}
                          <span className="capitalize">{lead.source}</span>
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-4 px-4 text-[#6B6B54] text-[11px] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Estado Dropdown */}
                      <td className="py-4 px-4">
                        <div className="relative inline-block">
                          <select
                            disabled={statusUpdatingId === lead.id}
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as CRMLeadStatus)
                            }
                            className={`text-[11px] font-bold py-1.5 px-3 rounded-xl border appearance-none pr-7 cursor-pointer focus:outline-none transition-colors ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-1.5 top-2 text-[16px] pointer-events-none text-current">
                            arrow_drop_down
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EFEB] text-[#2A2A2A] font-semibold text-[11px] rounded-xl border border-[#E5E5DF] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#054316]">
                            history_edu
                          </span>
                          <span>Notas ({lead.notes ? lead.notes.length : 0})</span>
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

      {/* Modal: Historial de Notas y Seguimiento por Cliente */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E5E5DF] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF9F5] border-b border-[#E5E5DF] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#054316]">account_circle</span>
                  <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
                    {selectedLead.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      STATUS_CONFIG[selectedLead.status]?.bg
                    } ${STATUS_CONFIG[selectedLead.status]?.text} ${
                      STATUS_CONFIG[selectedLead.status]?.border
                    }`}
                  >
                    {selectedLead.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6B54] mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    {selectedLead.phone}
                  </span>
                  {selectedLead.email && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">mail</span>
                      {selectedLead.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[#054316] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">home</span>
                    {selectedLead.project}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-[#E5E5DF] hover:bg-[#D5D5CF] text-[#2A2A2A] flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Financial Simulation / Message box */}
              {(selectedLead.calculatorDetails || selectedLead.message) && (
                <div className="p-4 bg-[#F8FAF3] rounded-2xl border border-[#D5DDD2] text-xs space-y-2">
                  <span className="font-bold text-[#054316] uppercase tracking-wider block text-[10px]">
                    Detalles de la Simulación VIS &amp; Consulta
                  </span>
                  {selectedLead.calculatorDetails && (
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                      <div>
                        <span className="text-[#6B6B54] block text-[10px]">Valor Vivienda:</span>
                        <strong>{selectedLead.calculatorDetails.totalHousePrice}</strong>
                      </div>
                      <div>
                        <span className="text-[#6B6B54] block text-[10px]">Subsidios:</span>
                        <strong className="text-[#054316]">
                          {selectedLead.calculatorDetails.totalSubsidies}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#6B6B54] block text-[10px]">Cuota Estimada:</span>
                        <strong>{selectedLead.calculatorDetails.monthlyPayment}</strong>
                      </div>
                    </div>
                  )}
                  {selectedLead.message && (
                    <p className="text-[#41493F] italic pt-1 border-t border-[#D5DDD2]">
                      "{selectedLead.message}"
                    </p>
                  )}
                </div>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">
                  Agregar Nueva Nota de Seguimiento
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    required
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Escribe el resultado de la llamada, acuerdos de pago o fecha de cita presencial..."
                    className="flex-1 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl p-3 text-xs text-[#2A2A2A] placeholder:text-[#9E9E8E] focus:border-[#054316] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !newNoteText.trim()}
                    className="self-end px-4 py-2.5 bg-[#054316] hover:bg-[#07591e] text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    {addingNote ? 'Guardando...' : 'Guardar Nota'}
                  </button>
                </div>
              </form>

              {/* Timeline of Notes */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#6B6B54] uppercase tracking-wider block">
                  Historial de Notas ({selectedLead.notes ? selectedLead.notes.length : 0})
                </span>

                {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                  <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-dashed border-[#E5E5DF] text-center text-xs text-[#9E9E8E]">
                    Aún no hay notas registradas para este cliente. Añade la primera arriba.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedLead.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 bg-[#FAF9F5] border border-[#E5E5DF] rounded-2xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#054316] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">edit_note</span>
                            {note.author}
                          </span>
                          <span className="text-[#9E9E8E] font-mono">
                            {new Date(note.createdAt).toLocaleDateString('es-CO')} ·{' '}
                            {new Date(note.createdAt).toLocaleTimeString('es-CO', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[#2A2A2A] leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E5DF] flex items-center justify-between text-xs">
              <a
                href={getWhatsAppLink(selectedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#054316] font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Contactar por WhatsApp ahora</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-[#E5E5DF] hover:bg-[#D5D5CF] text-[#2A2A2A] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
