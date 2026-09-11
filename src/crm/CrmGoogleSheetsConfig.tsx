import React, { useState, useEffect } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, GOOGLE_SHEETS_SETUP_STEPS } from '../data/googleAppsScriptCode';

interface CrmGoogleSheetsConfigProps {
  currentWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => Promise<boolean>;
  onTestWebhook: (url: string) => Promise<{ success: boolean; message: string }>;
  onSyncAll: () => Promise<{ success: boolean; message: string }>;
  onImportFromSheet: () => Promise<{ success: boolean; message: string }>;
  totalLeads: number;
  syncedLeads: number;
  totalPqrs: number;
  syncedPqrs: number;
}

export const CrmGoogleSheetsConfig: React.FC<CrmGoogleSheetsConfigProps> = ({
  currentWebhookUrl,
  onSaveWebhookUrl,
  onTestWebhook,
  onSyncAll,
  onImportFromSheet,
  totalLeads,
  syncedLeads,
  totalPqrs,
  syncedPqrs,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl || '');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (currentWebhookUrl) {
      setWebhookUrl(currentWebhookUrl);
    }
  }, [currentWebhookUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const ok = await onSaveWebhookUrl(webhookUrl);
      if (ok) {
        setFeedback({
          type: 'success',
          message: 'URL del Webhook de Google Sheets guardada correctamente.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'No se pudo guardar la URL. Verifica que sea un enlace válido (https://...).',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    const trimmed = webhookUrl.trim();
    if (!trimmed) {
      setFeedback({
        type: 'error',
        message: 'Por favor ingresa primero la URL del Webhook de Apps Script (terminada en /exec) antes de enviar la fila de prueba.',
      });
      return;
    }
    if (trimmed.includes('docs.google.com/spreadsheets')) {
      setFeedback({
        type: 'error',
        message:
          'Has ingresado el enlace de visualización de Google Sheets (docs.google.com). Debes usar la URL de la Aplicación Web de Apps Script (terminada en /exec con acceso para "Cualquier usuario"). Consulta los 6 pasos abajo.',
      });
      return;
    }
    setTesting(true);
    setFeedback(null);
    try {
      const res = await onTestWebhook(trimmed);
      setFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'Error inesperado al intentar enviar la fila de prueba.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await onSyncAll();
      setFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleImportFromSheet = async () => {
    setImporting(true);
    setFeedback(null);
    try {
      const res = await onImportFromSheet();
      setFeedback({
        type: res.success ? 'success' : 'error',
        message: res.message,
      });
    } finally {
      setImporting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const isConfigured = Boolean(currentWebhookUrl && currentWebhookUrl.startsWith('http'));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#054316] text-xl">table_view</span>
              <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider">
                Integración en la Nube
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A2A2A]">
              Sincronización Directa con Google Sheets
            </h2>
            <p className="text-xs text-[#6B6B54] mt-1 max-w-2xl">
              Cada formulario de asesoría y radicado de PQRS enviado en el sitio web se almacena automáticamente en tu
              hoja de cálculo de Google Drive en tiempo real mediante un Webhook seguro de Google Apps Script.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isConfigured ? 'Conexión Activa' : 'Pendiente Configuración'}</span>
            </span>
          </div>
        </div>

        {/* Sync Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#F0EFEB]">
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E5E5DF] text-xs">
            <span className="text-[#6B6B54] block font-semibold uppercase text-[10px]">
              Prospectos (Leads) Sincronizados
            </span>
            <div className="text-xl font-bold text-[#2A2A2A] mt-1">
              {syncedLeads} <span className="text-xs font-normal text-[#6B6B54]">de {totalLeads}</span>
            </div>
            <div className="w-full bg-[#E5E5DF] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#054316] h-full"
                style={{ width: `${totalLeads ? (syncedLeads / totalLeads) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E5E5DF] text-xs">
            <span className="text-[#6B6B54] block font-semibold uppercase text-[10px]">
              PQRS Sincronizadas
            </span>
            <div className="text-xl font-bold text-[#2A2A2A] mt-1">
              {syncedPqrs} <span className="text-xs font-normal text-[#6B6B54]">de {totalPqrs}</span>
            </div>
            <div className="w-full bg-[#E5E5DF] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#C1694F] h-full"
                style={{ width: `${totalPqrs ? (syncedPqrs / totalPqrs) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-[#F8FAF3] rounded-2xl border border-[#D5DDD2] text-xs flex flex-col justify-between">
            <div>
              <span className="text-[#054316] block font-bold uppercase text-[10px]">
                Sincronización Manual
              </span>
              <p className="text-[11px] text-[#41493F] mt-1">
                Reenvía registros pendientes a Google Sheets.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncData}
              disabled={syncing || !isConfigured}
              className="mt-2 w-full py-2 bg-[#054316] hover:bg-[#07591e] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>{syncing ? 'Sincronizando...' : 'Sincronizar Todo Ahora'}</span>
            </button>
          </div>

          {/* Import from Google Sheet Card */}
          <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#86c33c]/60 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[#054316] block font-bold uppercase text-[10px]">
                Importar desde Google Sheet
              </span>
              <p className="text-[11px] text-[#41493F] mt-1">
                Trae al panel todos los registros históricos guardados en la hoja (prospectos y PQRS). Úsalo si el
                panel quedó vacío tras una actualización del servidor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleImportFromSheet}
              disabled={importing || !isConfigured}
              className="mt-2 w-full py-2 bg-[#86c33c] hover:bg-[#97d64d] text-[#132A13] font-bold text-xs rounded-xl shadow transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span className={`material-symbols-outlined text-[16px] ${importing ? 'animate-spin' : ''}`}>
                {importing ? 'progress_activity' : 'download'}
              </span>
              <span>{importing ? 'Importando...' : 'Importar Registros de la Hoja'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Webhook Configuration Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider block">
            Paso Clave
          </span>
          <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
            Configurar URL del Webhook de Apps Script
          </h3>
          <p className="text-xs text-[#6B6B54] mt-1">
            Pega aquí la URL de la aplicación web que generaste en Google Apps Script (termina en{' '}
            <code className="bg-[#FAF9F5] px-1.5 py-0.5 rounded font-mono">/exec</code>).
          </p>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-1.5">
              URL del Despliegue de Aplicación Web (Google Apps Script)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#9E9E8E] text-[18px]">
                link
              </span>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#2A2A2A] placeholder:text-[#9E9E8E] focus:border-[#054316] focus:outline-none font-mono"
              />
            </div>
            <span className="text-[11px] text-[#6B6B54] block mt-1">
              Ejemplo: <span className="font-mono text-[#4A4A30]">https://script.google.com/macros/s/AKfycby.../exec</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#054316] hover:bg-[#07591e] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{saving ? 'Guardando...' : 'Guardar URL del Webhook'}</span>
            </button>

            <button
              id="btn-test-google-sheet"
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2.5 bg-[#FAF9F5] hover:bg-[#F0EFEB] text-[#2A2A2A] font-bold text-xs rounded-xl border border-[#E5E5DF] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              title="Envía una fila de prueba a la pestaña Prospectos_Leads de tu hoja de cálculo para verificar la conexión"
            >
              <span className={`material-symbols-outlined text-[16px] ${testing ? 'animate-spin' : ''}`}>
                {testing ? 'sync' : 'send'}
              </span>
              <span>{testing ? 'Enviando fila de prueba...' : 'Enviar Fila de Prueba a Google Sheet'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step-by-Step Guide & Apps Script Code Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Guide (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5DF] shadow-xs space-y-6">
          <div className="border-b border-[#F0EFEB] pb-4">
            <span className="text-xs font-semibold text-[#054316] uppercase tracking-wider block">
              Instrucciones Oficiales
            </span>
            <h3 className="text-lg font-serif font-bold text-[#2A2A2A]">
              Cómo Conectar tu Google Sheet en 6 Pasos
            </h3>
            <p className="text-xs text-[#6B6B54]">
              Garantiza que solo el personal autorizado con la cuenta de Google de la constructora tenga acceso.
            </p>
          </div>

          <div className="space-y-4">
            {GOOGLE_SHEETS_SETUP_STEPS.map((item) => (
              <div key={item.step} className="flex gap-3.5 items-start">
                <div className="w-6 h-6 rounded-full bg-[#054316] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#2A2A2A]">{item.title}</h4>
                  <p className="text-[11px] text-[#6B6B54] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security details box */}
          <div className="p-4 bg-[#F8FAF3] border border-[#D5DDD2] rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#054316] font-bold">
              <span className="material-symbols-outlined text-base">security</span>
              <span>Seguridad &amp; Confidencialidad de la Base de Datos</span>
            </div>
            <p className="text-[#41493F] text-[11px] leading-relaxed">
              La hoja de cálculo permanece alojada en el Google Drive institucional de Marín &amp; Salgado. Ningún
              usuario externo puede acceder a ver los registros a menos que tú expresamente compartas el archivo con
              su correo electrónico de Google.
            </p>
          </div>
        </div>

        {/* Script Code Viewer (6 cols) */}
        <div className="lg:col-span-6 bg-[#1F2421] rounded-3xl p-6 sm:p-8 border border-[#3E453F] shadow-xl text-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#3E453F]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#86c33c] text-xl">code</span>
                <span className="font-mono text-xs font-bold text-white">Code.gs (Apps Script)</span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#86c33c] hover:bg-[#97d64d] text-[#132A13] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedCode ? 'done' : 'content_copy'}
                </span>
                <span>{copiedCode ? '¡Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#9EAAA0] mt-3 mb-2">
              Este script crea automáticamente dos pestañas en tu hoja: <strong>Prospectos_Leads</strong> y{' '}
              <strong>PQRS_Ciudadano</strong>, con cabeceras con el color corporativo verde y marrón.
            </p>

            <div className="relative mt-3">
              <pre className="bg-[#141715] p-4 rounded-2xl text-[11px] font-mono text-[#86c33c] overflow-x-auto max-h-[380px] border border-[#2D332F] leading-relaxed">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-[#3E453F] flex items-center justify-between text-[11px] text-[#9EAAA0]">
            <span>Compatible con Google Sheets &amp; Excel</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-[#86c33c] hover:underline font-bold cursor-pointer"
            >
              Copiar al portapapeles &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
