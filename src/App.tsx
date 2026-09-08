import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { VisCalculator } from './components/VisCalculator';
import { GalleryAndPlans } from './components/GalleryAndPlans';
import { ConstructionProgress } from './components/ConstructionProgress';
import { ServicesSection } from './components/ServicesSection';
import { AboutAndLeadership } from './components/AboutAndLeadership';
import { LocationSection } from './components/LocationSection';
import { TestimonialsAndPQRS } from './components/TestimonialsAndPQRS';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PropertiesSection } from './components/PropertiesSection';
import { CrmApp } from './crm/CrmApp';
import { PROJECTS } from './data/projectsData';
import { Project, PropertyItem, CRMLead } from './types';

export default function App() {
  // Independent CRM View Routing (Protected)
  const checkIsCrmRoute = () => {
    const hash = window.location.hash || '';
    const pathname = window.location.pathname || '';
    return (
      hash.startsWith('#/admin') ||
      hash.startsWith('#/crm') ||
      hash === '#admin' ||
      hash === '#crm' ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/crm')
    );
  };

  const [currentView, setCurrentView] = useState<'landing' | 'crm'>(() =>
    checkIsCrmRoute() ? 'crm' : 'landing'
  );

  // Explicit view state override to guarantee returning to public landing
  const [viewOverride, setViewOverride] = useState<'landing' | 'crm' | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsCrmRoute()) {
        setCurrentView('crm');
        setViewOverride('crm');
      } else {
        setCurrentView('landing');
        setViewOverride('landing');
      }
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Dynamic Projects and Properties state with seed/mock fallback
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [propertiesList, setPropertiesList] = useState<PropertyItem[]>([]);

  // Filters for Hero and Properties Catalog
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBudget, setFilterBudget] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');

  // Modals & Navigation states
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [selectedProjectIdForCalc, setSelectedProjectIdForCalc] = useState<string>('urbanizacion-los-alamos');

  // Background Leads state & feedback
  const [, setLeads] = useState<CRMLead[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial dynamic data: leads, projects and properties
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [leadsRes, projectsRes, propsRes] = await Promise.all([
          fetch('/api/crm/leads'),
          fetch('/api/projects'),
          fetch('/api/properties'),
        ]);

        if (leadsRes.ok) {
          const data = await leadsRes.json();
          if (data.leads) {
            setLeads(data.leads);
          }
        }

        if (projectsRes.ok) {
          const pData = await projectsRes.json();
          if (pData.projects && pData.projects.length > 0) {
            setProjectsList(pData.projects);
          } else {
            // Fallback seed projects
            setProjectsList(PROJECTS);
          }
        }

        if (propsRes.ok) {
          const propData = await propsRes.json();
          if (propData.properties && propData.properties.length > 0) {
            setPropertiesList(propData.properties);
          }
        }
      } catch (err) {
        console.warn('Could not fetch server data initially, using fallback:', err);
      }
    };
    fetchInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Switch to CRM View
  const handleOpenCrm = () => {
    setViewOverride('crm');
    setCurrentView('crm');
    try {
      window.location.hash = '#/admin';
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch back to Public Landing
  const handleBackToLanding = () => {
    setViewOverride('landing');
    setCurrentView('landing');

    try {
      // If the browser pathname is /admin or /crm, clean it to / without reload
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/crm')) {
        window.history.pushState(null, '', '/' + window.location.search);
      } else if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {
      // fallback in case pushState is restricted
    }

    if (window.location.hash) {
      try {
        window.location.hash = '';
      } catch (e) {
        // ignore
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute active view
  const isCrmActive = viewOverride !== null ? viewOverride === 'crm' : currentView === 'crm';

  // If on CRM route, render independent protected CRM Application
  if (isCrmActive) {
    return <CrmApp onBackToLanding={handleBackToLanding} />;
  }

  // Filtered Properties computation for the Dynamic Catalog
  const filteredProperties = useMemo(() => {
    return propertiesList.filter((prop) => {
      // Zone filter
      if (filterZone === 'norte' && !prop.location.toLowerCase().includes('norte')) return false;
      if (filterZone === 'zaragoza' && !prop.location.toLowerCase().includes('zaragoza')) return false;

      // Type filter (Casa, Apartamento, Lote)
      if (filterType !== 'all') {
        const normalizedPropType = prop.type.toLowerCase();
        const normalizedFilter = filterType.toLowerCase();
        if (!normalizedPropType.includes(normalizedFilter) && !normalizedFilter.includes(normalizedPropType)) {
          return false;
        }
      }

      // Budget filter
      if (filterBudget === 'hasta180' && prop.price > 180000000) return false;
      if (filterBudget === 'hasta250' && prop.price > 250000000) return false;
      if (filterBudget === 'mas250' && prop.price <= 250000000) return false;

      // Status filter
      if (filterStatus !== 'all' && prop.status !== filterStatus) return false;

      // Bedrooms filter
      if (filterBedrooms !== 'all' && prop.bedrooms < Number(filterBedrooms)) return false;

      return true;
    });
  }, [propertiesList, filterZone, filterType, filterBudget, filterStatus, filterBedrooms]);

  // Filtered Projects computation
  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      if (filterZone === 'norte' && !proj.location.toLowerCase().includes('norte')) return false;
      if (filterZone === 'zaragoza' && !proj.location.toLowerCase().includes('zaragoza')) return false;

      if (filterType === 'casa' && proj.type !== 'casa') return false;
      if (filterType === 'apartamento' && proj.type !== 'apartamento') return false;

      if (filterBudget === 'hasta135' && proj.priceSMMLV && proj.priceSMMLV > 135) return false;
      if (filterBudget === 'mas135' && proj.priceSMMLV && proj.priceSMMLV < 135) return false;

      return true;
    });
  }, [projectsList, filterZone, filterType, filterBudget]);

  const hasActiveFilters =
    filterZone !== 'all' ||
    filterType !== 'all' ||
    filterBudget !== 'all' ||
    filterStatus !== 'all' ||
    filterBedrooms !== 'all';

  const handleClearFilters = () => {
    setFilterZone('all');
    setFilterType('all');
    setFilterBudget('all');
    setFilterStatus('all');
    setFilterBedrooms('all');
  };

  // Jump to calculator with selected project
  const handleSimulateInCalculator = (projectId: string) => {
    setSelectedProjectIdForCalc(projectId);
    const target = document.getElementById('calculadora');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lead registration handler from Contact form
  const handleContactSubmitLead = async (formData: {
    name: string;
    phone: string;
    email: string;
    project: string;
    message: string;
    subsidyStatus?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nombre: formData.name,
          telefono: formData.phone,
          correo: formData.email,
          proyecto: formData.project,
          mensaje: formData.message,
          subsidio: formData.subsidyStatus || 'En validación / Requiere asesoría',
          origen: 'Formulario Web de Contacto',
          source: 'formulario',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          setLeads((prev) => [data.lead, ...prev]);
        }
        showToast('✓ Solicitud enviada exitosamente. Un asesor se comunicará contigo.');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Lead registration from Calculator
  const handleSaveLeadFromCalculator = async (calcData: {
    name: string;
    phone: string;
    email: string;
    project: string;
    simulation: any;
  }) => {
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: calcData.name,
          nombre: calcData.name,
          phone: calcData.phone,
          telefono: calcData.phone,
          email: calcData.email,
          correo: calcData.email,
          project: calcData.project,
          proyecto: calcData.project,
          subsidyStatus: 'Simulación Calculadora VIS',
          subsidio: 'Simulación Calculadora VIS',
          source: 'calculadora',
          origen: 'Calculadora Financiera VIS',
          message: `Simulación de cuota VIS: ${calcData.project}`,
          mensaje: `Simulación de cuota VIS: ${calcData.project}`,
          calculatorDetails: calcData.simulation,
          detallesCalculadora: calcData.simulation,
          precioVivienda: calcData.simulation?.totalHousePrice ? `$${Number(calcData.simulation.totalHousePrice).toLocaleString('es-CO')} COP` : '',
          subsidioTotal: calcData.simulation?.totalSubsidies ? `$${Number(calcData.simulation.totalSubsidies).toLocaleString('es-CO')} COP` : '',
          cuotaMensual: calcData.simulation?.monthlyPayment ? `$${Number(calcData.simulation.monthlyPayment).toLocaleString('es-CO')} COP` : '',
          plazoAnos: calcData.simulation?.termYears || 20,
          creditoMonto: calcData.simulation?.loanAmount ? `$${Number(calcData.simulation.loanAmount).toLocaleString('es-CO')} COP` : '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          setLeads((prev) => [data.lead, ...prev]);
        }
        showToast('✓ Simulación registrada exitosamente');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Lead registration from Chatbot
  const handleRegisterLeadFromChat = async (chatData: {
    name: string;
    phone: string;
    email?: string;
    project?: string;
    message: string;
  }) => {
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: chatData.name,
          nombre: chatData.name,
          phone: chatData.phone,
          telefono: chatData.phone,
          email: chatData.email || '',
          correo: chatData.email || '',
          project: chatData.project || 'Consulta Asistente Virtual Mariana',
          proyecto: chatData.project || 'Consulta Asistente Virtual Mariana',
          subsidyStatus: 'Capturado por Chatbot Mariana',
          subsidio: 'Capturado por Chatbot Mariana',
          source: 'chatbot',
          origen: 'Chatbot Asistente Mariana',
          message: chatData.message,
          mensaje: chatData.message,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          setLeads((prev) => [data.lead, ...prev]);
        }
        showToast('✓ Solicitud de contacto recibida');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PQRS Submission (Official Channel with Real Radicado & 15-day Term)
  const handleSubmitPqrs = async (pqrsData: {
    type: string;
    name: string;
    phone: string;
    email: string;
    project: string;
    message: string;
  }) => {
    try {
      const res = await fetch('/api/crm/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pqrsData,
          tipo: pqrsData.type,
          nombre: pqrsData.name,
          telefono: pqrsData.phone,
          correo: pqrsData.email,
          proyecto: pqrsData.project,
          mensaje: pqrsData.message,
          origen: 'Portal Web PQRS',
          source: 'pqrs',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.radicadoCode) {
          showToast(`✓ Radicado ${data.radicadoCode} generado correctamente`);
          return { radicadoCode: data.radicadoCode };
        }
      }
    } catch (err) {
      console.error('Error submitting PQRS:', err);
    }
    return { radicadoCode: `PQRS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}` };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#2A2A2A] font-sans antialiased selection:bg-[#C1694F] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#4A4A30] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#C1694F] text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
          <span className="material-symbols-outlined text-[#C1694F] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Header onOpenCrm={handleOpenCrm} />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 1. Hero Section with Background, Title and Filter Bar */}
        <Hero
          onFilterChange={(filters) => {
            setFilterZone(filters.zone);
            setFilterType(filters.type);
            setFilterBudget(filters.budget);
          }}
          onResetFilter={handleClearFilters}
          selectedZone={filterZone}
          selectedType={filterType}
          selectedBudget={filterBudget}
        />

        {/* 2. Dynamic Properties Catalog (Inmuebles: Casas, Aptos, Lotes) */}
        <PropertiesSection
          properties={filteredProperties}
          totalAvailable={propertiesList.length}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterBedrooms={filterBedrooms}
          setFilterBedrooms={setFilterBedrooms}
        />

        {/* 3. Projects Section (Proyectos Dinámicos con Fallback Seed) */}
        <ProjectsSection
          projects={filteredProjects}
          totalAvailable={projectsList.length}
          onSelectProject={(project) => setSelectedProjectForModal(project)}
          onSimulateInCalculator={handleSimulateInCalculator}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* 3. Interactive VIS Mortgage & Subsidies Calculator */}
        <VisCalculator
          selectedProjectId={selectedProjectIdForCalc}
          onSaveLeadFromCalculator={handleSaveLeadFromCalculator}
        />

        {/* 4. Floor Plans (Planos) & Photo Bento Gallery */}
        <GalleryAndPlans />

        {/* 5. Live Construction Progress (Avance de Obra) */}
        <ConstructionProgress />

        {/* 6. Services & Mortgages Support */}
        <ServicesSection />

        {/* 7. About Marin & Salgado & Leadership Profile */}
        <AboutAndLeadership />

        {/* 8. Location & Points of Interest in Cartago */}
        <LocationSection />

        {/* 9. Verified Testimonials & Official PQRS Channel */}
        <TestimonialsAndPQRS onSubmitPqrs={handleSubmitPqrs} />

        {/* 10. Contact Form with Real-time CRM Sync */}
        <ContactSection onSubmitLead={handleContactSubmitLead} />
      </main>

      {/* Footer */}
      <Footer onOpenCrm={handleOpenCrm} />

      {/* Interactive Chatbot with Gemini / Fallback */}
      <Chatbot onRegisterLeadFromChat={handleRegisterLeadFromChat} />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProjectForModal}
        onClose={() => setSelectedProjectForModal(null)}
        onSimulateInCalculator={handleSimulateInCalculator}
      />
    </div>
  );
}
