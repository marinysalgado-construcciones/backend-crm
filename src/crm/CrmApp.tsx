import React, { useState, useEffect } from 'react';
import { CRMLead, PQRSItem, CRMStaffUser, CRMLeadStatus, CRMLeadNote, Project, PropertyItem } from '../types';
import { CrmLogin } from './CrmLogin';
import { CrmDashboard } from './CrmDashboard';
import { CrmLeadsModule } from './CrmLeadsModule';
import { CrmPqrsModule } from './CrmPqrsModule';
import { CrmGoogleSheetsConfig } from './CrmGoogleSheetsConfig';
import { CrmProjectsModule } from './CrmProjectsModule';
import { CrmPropertiesModule } from './CrmPropertiesModule';

interface CrmAppProps {
  onBackToLanding: () => void;
}

export const CrmApp: React.FC<CrmAppProps> = ({ onBackToLanding }) => {
  const [currentUser, setCurrentUser] = useState<CRMStaffUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active module tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'pqrs' | 'projects' | 'properties' | 'sheets'>('dashboard');

  // Data stores
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [pqrsList, setPqrsList] = useState<PQRSItem[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [propertiesList, setPropertiesList] = useState<PropertyItem[]>([]);
  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrl] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check saved session on mount
  useEffect(() => {
    const token = localStorage.getItem('ms_crm_token');
    const userStr = localStorage.getItem('ms_crm_user');

    if (token && userStr) {
      try {
        const parsed = JSON.parse(userStr);
        // Verify token with backend
        fetch('/api/crm/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.authenticated && data.user) {
              setCurrentUser(data.user);
            } else {
              localStorage.removeItem('ms_crm_token');
              localStorage.removeItem('ms_crm_user');
              setCurrentUser(null);
            }
          })
          .catch(() => {
            // Offline fallback with stored session
            setCurrentUser(parsed);
          })
          .finally(() => {
            setAuthChecking(false);
          });
      } catch (e) {
        localStorage.removeItem('ms_crm_token');
        localStorage.removeItem('ms_crm_user');
        setCurrentUser(null);
        setAuthChecking(false);
      }
    } else {
      setAuthChecking(false);
    }
  }, []);

  // Fetch CRM Data when authenticated
  const loadCrmData = async () => {
    const token = localStorage.getItem('ms_crm_token');
    if (!token) return;

    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [leadsRes, pqrsRes, sheetRes, projRes, propRes] = await Promise.all([
        fetch('/api/crm/leads', { headers }),
        fetch('/api/crm/pqrs', { headers }),
        fetch('/api/crm/sheet-config', { headers }),
        fetch('/api/projects'),
        fetch('/api/properties'),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }

      if (pqrsRes.ok) {
        const pqrsData = await pqrsRes.json();
        setPqrsList(pqrsData.pqrs || []);
      }

      if (sheetRes.ok) {
        const sheetData = await sheetRes.json();
        setGoogleSheetWebhookUrl(sheetData.webhookUrl || '');
      }

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjectsList(projData.projects || []);
      }

      if (propRes.ok) {
        const propData = await propRes.json();
        setPropertiesList(propData.properties || []);
      }
    } catch (err) {
      console.error('Error loading CRM data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadCrmData();
    }
  }, [currentUser]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('ms_crm_token');
    localStorage.removeItem('ms_crm_user');
    setCurrentUser(null);
  };

  // Update lead status
  const handleUpdateLeadStatus = async (leadId: string, newStatus: CRMLeadStatus) => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch(`/api/crm/lead/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
        );
        showToast(`Estado del prospecto actualizado a "${newStatus}"`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Add lead note
  const handleAddLeadNote = async (leadId: string, noteText: string): Promise<CRMLeadNote | null> => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch(`/api/crm/lead/${leadId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: noteText }),
      });

      const data = await res.json();
      if (res.ok && data.note) {
        setLeads((prev) =>
          prev.map((lead) => {
            if (lead.id === leadId) {
              return {
                ...lead,
                notes: [data.note, ...(lead.notes || [])],
              };
            }
            return lead;
          })
        );
        showToast('Nota de seguimiento guardada exitosamente');
        return data.note;
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
    return null;
  };

  // Respond PQRS
  const handleRespondPqrs = async (pqrsId: string, officialResponse: string) => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch(`/api/crm/pqrs/${pqrsId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ officialResponse, status: 'Respondida / Cerrada' }),
      });

      if (res.ok) {
        setPqrsList((prev) =>
          prev.map((item) =>
            item.id === pqrsId
              ? {
                  ...item,
                  status: 'Respondida / Cerrada',
                  officialResponse,
                  respondedAt: new Date().toISOString(),
                  respondedBy: `${currentUser?.name} (${currentUser?.role})`,
                }
              : item
          )
        );
        showToast('PQRS respondida y cerrada oficialmente.');
      }
    } catch (error) {
      console.error('Error responding PQRS:', error);
    }
  };

  // Save Webhook URL
  const handleSaveWebhookUrl = async (url: string) => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch('/api/crm/sheet-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ webhookUrl: url }),
      });
      if (res.ok) {
        setGoogleSheetWebhookUrl(url);
        showToast('URL del Webhook de Google Sheets actualizada');
        return true;
      }
    } catch (err) {
      console.error('Error saving webhook URL:', err);
    }
    return false;
  };

  // Test Webhook
  const handleTestWebhook = async (url: string) => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch('/api/crm/sync-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          webhookUrl: url,
          testLead: {
            id: `test-lead-${Date.now()}`,
            name: 'Prueba de Conexión CRM',
            nombre: 'Prueba de Conexión CRM',
            phone: '3226374991',
            telefono: '3226374991',
            email: 'contacto@marinysalgado.com',
            project: 'Urbanización Los Álamos',
            proyecto: 'Urbanización Los Álamos',
            subsidyStatus: 'Prueba Sisbén Mi Casa Ya + Comfamiliar',
            subsidio: 'Prueba Sisbén Mi Casa Ya + Comfamiliar',
            source: 'formulario',
            origen: 'formulario',
            status: 'Nuevo',
            estado: 'Nuevo',
            message: 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.',
            mensaje: 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.',
            precioVivienda: '$195.750.000 COP',
            subsidioTotal: '$72.500.000 COP',
            cuotaMensual: '$980.000 COP',
            plazoAnos: 20,
            creditoMonto: '$123.250.000 COP',
            notas: '[Sistema]: Fila de prueba enviada para verificar compatibilidad en español y escritura forzada.',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGoogleSheetWebhookUrl(url);
        try {
          localStorage.setItem('ms_google_sheet_webhook', url);
        } catch {}
      }

      return {
        success: Boolean(data.success),
        message:
          data.message ||
          data.error ||
          (data.success
            ? '¡Fila de prueba enviada con éxito a Google Sheets!'
            : 'Error al enviar fila de prueba a Google Sheets.'),
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'No se pudo conectar con el servidor para probar la hoja de cálculo.',
      };
    }
  };

  // Sync All
  const handleSyncAll = async () => {
    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch('/api/crm/sync-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ webhookUrl: googleSheetWebhookUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        await loadCrmData();
        return {
          success: true,
          message: data.message || 'Sincronización finalizada.',
        };
      } else {
        return {
          success: false,
          message: data.error || 'Error en la sincronización.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: 'Fallo al sincronizar con el Webhook.',
      };
    }
  };

  // Handlers for Projects CRUD
  const handleProjectCreated = (newProj: Project) => {
    setProjectsList((prev) => [newProj, ...prev]);
  };

  const handleProjectUpdated = (updatedProj: Project) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === updatedProj.id ? updatedProj : p))
    );
    // Update linked properties project name in state
    setPropertiesList((prev) =>
      prev.map((prop) =>
        prop.projectId === updatedProj.id
          ? { ...prop, projectName: updatedProj.name }
          : prop
      )
    );
  };

  const handleProjectDeleted = (projId: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== projId));
    // Unlink properties
    setPropertiesList((prev) =>
      prev.map((prop) =>
        prop.projectId === projId
          ? { ...prop, projectId: null, projectName: 'Independiente / No asociado' }
          : prop
      )
    );
  };

  // Handlers for Properties CRUD
  const handlePropertyCreated = (newProp: PropertyItem) => {
    setPropertiesList((prev) => [newProp, ...prev]);
  };

  const handlePropertyUpdated = (updatedProp: PropertyItem) => {
    setPropertiesList((prev) =>
      prev.map((p) => (p.id === updatedProp.id ? updatedProp : p))
    );
  };

  const handlePropertyDeleted = (propId: string) => {
    setPropertiesList((prev) => prev.filter((p) => p.id !== propId));
  };

  // Loading Splash
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#1F2421] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#86c33c] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#9EAAA0]">
          Verificando credenciales de acceso...
        </p>
      </div>
    );
  }

  // Not authenticated: Render Login
  if (!currentUser) {
    return (
      <CrmLogin
        onLoginSuccess={(user) => setCurrentUser(user)}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  // Compute counts for badges
  const pendingPqrsCount = pqrsList.filter((p) => p.status !== 'Respondida / Cerrada').length;

  return (
    <div className="min-h-screen bg-[#F8FAF3] text-[#2A2A2A] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2421] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#3E453F] text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-[#86c33c] text-lg">check_circle</span>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Application Navbar */}
      <header className="bg-[#1F2421] text-white border-b border-[#363E38] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-xs">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT0ilHb0kOxGLbphHwgbb4ezxKn9K_2d2ayTw0dAmLwh1WadC5h2v5s1abM1sZIanyn43getUzGxYKq8PnUqUusrfmIoHDSiP6q6Rfm-yUCQvhuvLenJ7iC3PYUnVTttgSbr7u22M9O39XL5GQgqnK7B2rXSPVyc7Jc9m5OOeGcG6hnA2u4emKVEfO8obhqc12ZIk66-HpbcjvPJMW87qNlRQ3Q_EvmoSWyh_ddt0kn4H7wSdcm3lJ_E7gZW5WKmyC"
                  alt="Marin & Salgado"
                  className="h-full w-auto object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-serif font-bold text-white tracking-tight">
                    Marín &amp; Salgado Construcciones
                  </h1>
                  <span className="text-[10px] font-bold bg-[#86c33c] text-[#132A13] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    CRM
                  </span>
                </div>
                <p className="text-[11px] text-[#9EAAA0] hidden sm:block">
                  Dashboard Administrativo &amp; Gestión Inmobiliaria VIS
                </p>
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back to public web */}
              <button
                type="button"
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-white bg-[#054316] hover:bg-[#075e1f] px-3 sm:px-4 py-2 rounded-xl border border-[#86c33c]/50 hover:border-[#86c33c] transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                title="Volver a la landing page pública"
              >
                <span className="material-symbols-outlined text-[18px] text-[#86c33c]">arrow_back</span>
                <span>Volver al Sitio Web</span>
              </button>

              {/* Staff badge */}
              <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-[#3E453F]">
                <div className="w-8 h-8 rounded-full bg-[#054316] text-white flex items-center justify-center font-bold text-xs border border-[#86c33c]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-white block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#86c33c] font-medium block">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-900/40 text-[#9EAAA0] hover:text-rose-300 border border-[#3E453F] flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar Sesión Segura"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-[#181C1A] border-t border-[#2D332F] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">insights</span>
                <span>Dashboard &amp; Métricas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Gestión de Prospectos</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'leads'
                      ? 'bg-[#132A13] text-[#86c33c]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {leads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pqrs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'pqrs'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">contact_mail</span>
                <span>Atención al Ciudadano (PQRS)</span>
                {pendingPqrsCount > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'pqrs'
                        ? 'bg-rose-900 text-rose-100'
                        : 'bg-rose-600 text-white animate-pulse'
                    }`}
                  >
                    {pendingPqrsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>Gestión de Proyectos</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'projects'
                      ? 'bg-[#132A13] text-[#86c33c]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {projectsList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'properties'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">real_estate_agent</span>
                <span>Gestión de Propiedades</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'properties'
                      ? 'bg-[#132A13] text-[#86c33c]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {propertiesList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sheets')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'sheets'
                    ? 'bg-[#86c33c] text-[#132A13] shadow-md'
                    : 'text-[#B2BDB5] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">table_chart</span>
                <span>Google Sheets Webhook</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    googleSheetWebhookUrl ? 'bg-[#86c33c]' : 'bg-amber-400'
                  }`}
                />
              </button>
            </div>

            {/* Direct button to public website */}
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs text-[#B2BDB5] hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-xl border border-[#3E453F] transition-colors cursor-pointer shrink-0 whitespace-nowrap ml-auto"
              title="Volver al Sitio Web Público"
            >
              <span className="material-symbols-outlined text-[16px] text-[#86c33c]">home</span>
              <span className="hidden sm:inline">Ir al Sitio Web</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#6B6B54]">
            <div className="w-10 h-10 border-3 border-[#054316] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-semibold">Cargando base de datos del CRM...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <CrmDashboard
                leads={leads}
                pqrsList={pqrsList}
                onNavigateTab={(tab) => setActiveTab(tab)}
                googleSheetConfigured={Boolean(
                  googleSheetWebhookUrl && googleSheetWebhookUrl.startsWith('http')
                )}
              />
            )}

            {activeTab === 'leads' && (
              <CrmLeadsModule
                leads={leads}
                currentUser={currentUser}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onAddLeadNote={handleAddLeadNote}
                onSyncWithGoogleSheet={handleSyncAll}
              />
            )}

            {activeTab === 'pqrs' && (
              <CrmPqrsModule
                pqrsList={pqrsList}
                currentUser={currentUser}
                onRespondPqrs={handleRespondPqrs}
                onSyncWithGoogleSheet={handleSyncAll}
              />
            )}

            {activeTab === 'projects' && (
              <CrmProjectsModule
                projects={projectsList}
                onProjectCreated={handleProjectCreated}
                onProjectUpdated={handleProjectUpdated}
                onProjectDeleted={handleProjectDeleted}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'properties' && (
              <CrmPropertiesModule
                properties={propertiesList}
                projects={projectsList}
                onPropertyCreated={handlePropertyCreated}
                onPropertyUpdated={handlePropertyUpdated}
                onPropertyDeleted={handlePropertyDeleted}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'sheets' && (
              <CrmGoogleSheetsConfig
                currentWebhookUrl={googleSheetWebhookUrl}
                onSaveWebhookUrl={handleSaveWebhookUrl}
                onTestWebhook={handleTestWebhook}
                onSyncAll={handleSyncAll}
                totalLeads={leads.length}
                syncedLeads={leads.filter((l) => l.syncedToGoogleSheet).length}
                totalPqrs={pqrsList.length}
                syncedPqrs={pqrsList.filter((p) => p.syncedToGoogleSheet).length}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5DF] py-4 text-center text-xs text-[#6B6B54]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Marín &amp; Salgado Construcciones S.A.S. · NIT 901.810.082-1 · Cartago, Valle del Cauca
          </span>
          <span className="text-[11px] font-mono text-[#054316]">
            Sistema CRM v2.4 · Google Apps Script Enabled
          </span>
        </div>
      </footer>
    </div>
  );
};
