import React, { useState, useEffect, useRef } from 'react';

interface Milestone {
  name: string;
  status: 'Completado' | 'En ejecución' | 'Programado';
  description?: string;
}

export interface PhotoItem {
  id: string;
  src: string;
  caption: string;
  stage: string;
  uploadedAt?: string;
  isUserUploaded?: boolean;
}

interface ProjectProgress {
  id: string;
  name: string;
  typeName: string;
  location: string;
  lastUpdate: string;
  currentStage: string;
  currentDetail: string;
  timeline: Milestone[];
  defaultPhotos: PhotoItem[];
}

const DEFAULT_PROJECTS_PROGRESS: ProjectProgress[] = [
  {
    id: 'el-saman',
    name: 'Residencial El Samán',
    typeName: 'Apartamentos VIS en Conjunto Cerrado',
    location: 'Cartago, Vía Zaragoza',
    lastUpdate: 'Febrero 2025',
    currentStage: 'En Obra',
    currentDetail: 'Estructura Torres 1 & 2 y Redes Matrices',
    timeline: [
      { name: 'En Preventa', status: 'Completado', description: 'Punto de equilibrio y licencias' },
      { name: 'En Obra', status: 'En ejecución', description: 'Estructura y redes matrices' },
      { name: 'En Acabados', status: 'Programado', description: 'Interiores y zonas comunes' },
      { name: 'Para Entregar', status: 'Programado', description: 'Inspección y entrega de llaves' },
    ],
    defaultPhotos: [
      {
        id: 'es-1',
        src: 'https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg',
        caption: 'Vaciado de losa y cimentación estructural profunda',
        stage: 'Cimentación',
      },
      {
        id: 'es-2',
        src: 'https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw',
        caption: 'Avance estructural en torres y mampostería sismorresistente',
        stage: 'Estructura',
      },
      {
        id: 'es-3',
        src: 'https://lh3.googleusercontent.com/aida/AEtjO1WJNa-Rr2H-VlTOHeDwCj3Xac21-qfxghonBmcbEUoY-pfvJO2TXLosNYooOweNzxbJITIzr73I7_VAhz-1ecSAYsPHgJ8pPBs1C64mT-IXucQA6DaONTF_ajQAmZCBzfd8hEtbl67-hqzO6ov7WIHj83Mp6P22hmWpurkg-gfrZsIOB0OUDipaYS1RfKVZz4PQ9c_jkQOFlFjq0KT83gVt86UbfYOQmj18vKUhouJKQMSQr8lyrvzSKQ',
        caption: 'Instalación de ventanería técnica y muros de fachada',
        stage: 'Muros y Fachadas',
      },
    ],
  },
  {
    id: 'los-alamos',
    name: 'Urbanización Los Álamos',
    typeName: 'Casas VIS Unifamiliares con Ampliación',
    location: 'Cartago, Sector Norte',
    lastUpdate: 'Febrero 2025',
    currentStage: 'En Obra',
    currentDetail: 'Urbanismo, Vías y Cimentación Manzanas 1 & 2',
    timeline: [
      { name: 'En Preventa', status: 'Completado', description: 'Ventas y urbanismo base' },
      { name: 'En Obra', status: 'En ejecución', description: 'Vías, cimentación y viviendas' },
      { name: 'En Acabados', status: 'Programado', description: 'Drywall, pintura y redes' },
      { name: 'Para Entregar', status: 'Programado', description: 'Entrega de llaves y escrituración' },
    ],
    defaultPhotos: [
      {
        id: 'la-1',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQcUZzoQjjzLxax2K-5563dJWmdWet2zwLLENXiZJAWrwQJP79z3-RgBGex3RRdk9pR3Pzh6ke7BrvuJSkwt9ZUMtwWbac0waVkTFPjJZgmVAA91979IaL5gHFeoI2zcZiCnvncELe_lS0nUvhWUw8g3gWToD3lNDtqbK_OdTZB-1rSIrGKW_529TfXyp4s1rTlqxHfBZGvXcWJ2qK0i2X1tlm4BwSwOVrgw_BCNZlD6KfPJBV6BusKr8RF012px31',
        caption: 'Pavimentación de vías matrices y sardineles vehiculares',
        stage: 'Vías y Servicios',
      },
      {
        id: 'la-2',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHqJ_ir118AcH2J-Cod5Xvu0dujaPr8RzDy1_XflOrw2CfA3y5L3TOpGamsWbxxafJiZwxMJDB_826lP-V1vRbSXorqzmOYlEnkE9qwKw5eOZNg0n-fFca5irr6ufQFj_S8pUSsCP9LCTCSp25J-wBTyaXJtDFKvmS2jR9NJazm6LaGgB6YmvF7FVMfCIOdL1AsaPH1S7t3I97-9LH96thKb98upLb8BUtQqQustYZIYuDqr8CNs8',
        caption: 'Levantamiento estructural de viviendas en Manzana 1',
        stage: 'Estructura Casas',
      },
      {
        id: 'la-3',
        src: 'https://lh3.googleusercontent.com/aida/AEtjO1VFrhV5j_MgbF9jtQowlBY98hd68y9L8YQyV0lSbPoR14J6ff6ojnEBlirBSxbreQmoinTjJfwqRIRP7SkQDTZ13KweGSe1aW9AqCAWqK3sMNQK36iq97BOS1rJLn_ksYdZm6kmDU7H3e5G8l0r6Lt9EB-fE_n2GxYS5i0VGKssGI5tbz6y9uFJ5CkFznubskU0h44YPPP8Icrq-PiJVnUzOK0hwJqjxWmQujvHcR992AtYB6uB-qwVfA',
        caption: 'Instalaciones interiores de drywall y acabados',
        stage: 'Interiores',
      },
    ],
  },
];

// Helper to resize/compress images in client-side to prevent localStorage quota issues
function compressImageFile(file: File, maxWidth = 1200, maxHeight = 900, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ConstructionProgress: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'el-saman' | 'los-alamos'>('all');

  // Photo management state per project (loads from localStorage if available, otherwise defaults)
  const [projectPhotos, setProjectPhotos] = useState<Record<string, PhotoItem[]>>(() => {
    const initial: Record<string, PhotoItem[]> = {};
    DEFAULT_PROJECTS_PROGRESS.forEach((proj) => {
      const saved = localStorage.getItem(`ms_vis_photos_${proj.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initial[proj.id] = parsed.slice(0, 3);
            return;
          }
        } catch {
          // fallback to default
        }
      }
      initial[proj.id] = proj.defaultPhotos.slice(0, 3);
    });
    return initial;
  });

  // Drag and drop states per project
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});
  const [uploadFeedback, setUploadFeedback] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Lightbox Modal for enlarged photo view
  const [activeModalPhoto, setActiveModalPhoto] = useState<{
    photo: PhotoItem;
    projectName: string;
  } | null>(null);

  // Sync to localStorage
  const savePhotosToStorage = (projectId: string, photos: PhotoItem[]) => {
    try {
      localStorage.setItem(`ms_vis_photos_${projectId}`, JSON.stringify(photos));
    } catch (e) {
      console.warn('LocalStorage limit exceeded for photos:', e);
    }
  };

  // Upload handler for 1, 2, or 3 photos
  const handleUploadFiles = async (projectId: string, files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setUploadFeedback((prev) => ({ ...prev, [projectId]: 'Por favor selecciona archivos de imagen válidos.' }));
      setTimeout(() => setUploadFeedback((prev) => ({ ...prev, [projectId]: '' })), 3500);
      return;
    }

    const current = projectPhotos[projectId] || [];
    const availableSlots = 3 - current.length;

    // If already has 3, allow replacing or inform user
    let filesToProcess: File[] = [];
    let baseList = [...current];

    if (availableSlots <= 0) {
      // If user uploads while at max 3, replace with up to 3 new files
      filesToProcess = fileArray.slice(0, 3);
      baseList = [];
    } else {
      filesToProcess = fileArray.slice(0, availableSlots);
    }

    const newPhotoItems: PhotoItem[] = [];
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      try {
        const compressedBase64 = await compressImageFile(file);
        const dateStr = new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        newPhotoItems.push({
          id: `custom-${Date.now()}-${i}`,
          src: compressedBase64,
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Registro fotográfico de obra',
          stage: 'Avance reciente',
          uploadedAt: dateStr,
          isUserUploaded: true,
        });
      } catch (err) {
        console.error('Error al procesar imagen:', err);
      }
    }

    const updated = [...baseList, ...newPhotoItems].slice(0, 3);
    setProjectPhotos((prev) => ({ ...prev, [projectId]: updated }));
    savePhotosToStorage(projectId, updated);

    setUploadFeedback((prev) => ({
      ...prev,
      [projectId]: `¡${newPhotoItems.length} foto(s) añadida(s) con éxito! (${updated.length} de 3 fotos).`,
    }));
    setTimeout(() => setUploadFeedback((prev) => ({ ...prev, [projectId]: '' })), 4000);
  };

  // Remove individual photo
  const handleRemovePhoto = (projectId: string, photoIndex: number) => {
    const current = projectPhotos[projectId] || [];
    const updated = current.filter((_, idx) => idx !== photoIndex);
    setProjectPhotos((prev) => ({ ...prev, [projectId]: updated }));
    savePhotosToStorage(projectId, updated);
  };

  // Reset to default photos
  const handleResetPhotos = (projectId: string) => {
    const project = DEFAULT_PROJECTS_PROGRESS.find((p) => p.id === projectId);
    if (project) {
      const restored = project.defaultPhotos.slice(0, 3);
      setProjectPhotos((prev) => ({ ...prev, [projectId]: restored }));
      localStorage.removeItem(`ms_vis_photos_${projectId}`);
      setUploadFeedback((prev) => ({ ...prev, [projectId]: 'Fotos predeterminadas restablecidas.' }));
      setTimeout(() => setUploadFeedback((prev) => ({ ...prev, [projectId]: '' })), 3000);
    }
  };

  const visibleProjects =
    selectedFilter === 'all'
      ? DEFAULT_PROJECTS_PROGRESS
      : DEFAULT_PROJECTS_PROGRESS.filter((p) => p.id === selectedFilter);

  return (
    <section id="avance" className="py-16 sm:py-20 bg-[#FDFCF8] border-b border-[#E5E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
              Transparencia y Control de Calidad
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#4A4A30]">
              Avance de Obra en Tiempo Real
            </h2>
            <p className="text-[#6B6B54] text-xs sm:text-sm mt-1.5 font-light">
              Línea de tiempo general y registro fotográfico por cada proyecto en ejecución en Cartago.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#F5F5F0]'
              }`}
            >
              Todas las Obras
            </button>
            <button
              onClick={() => setSelectedFilter('el-saman')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'el-saman'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#F5F5F0]'
              }`}
            >
              Residencial El Samán
            </button>
            <button
              onClick={() => setSelectedFilter('los-alamos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'los-alamos'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#F5F5F0]'
              }`}
            >
              Urbanización Los Álamos
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-12 sm:space-y-16">
          {visibleProjects.map((project) => {
            const currentPhotos = projectPhotos[project.id] || project.defaultPhotos.slice(0, 3);
            const isDropActive = isDragging[project.id];
            const feedbackMsg = uploadFeedback[project.id];

            return (
              <div
                key={project.id}
                className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 border border-[#E5E5DF] shadow-xs"
              >
                {/* Project Header Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#E5E5DF] gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C1694F] bg-[#F9EBE7] px-2.5 py-0.5 rounded-full">
                        {project.typeName}
                      </span>
                      <span className="text-[11px] text-[#6B6B54] flex items-center gap-1 font-light">
                        <span className="material-symbols-outlined text-[13px] text-[#5A5A40]">location_on</span>
                        {project.location}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-[#4A4A30]">
                      {project.name}
                    </h3>
                    <span className="text-xs text-[#6B6B54] font-light mt-0.5 block">
                      Etapa actual: <strong className="font-medium text-[#2A2A2A]">{project.currentStage}</strong> — {project.currentDetail}
                    </span>
                  </div>

                  {/* Project Stage Indicator */}
                  <div className="lg:text-right flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-serif font-bold text-[#C1694F] bg-[#F9EBE7] px-4 py-1.5 rounded-full border border-[#C1694F]/20">
                        {project.currentStage}
                      </span>
                    </div>
                    <span className="text-xs text-[#6B6B54] font-medium">Etapa del Proyecto</span>
                    <span className="text-[10px] text-[#9E9E8E] uppercase tracking-wider block">
                      Corte a {project.lastUpdate}
                    </span>
                  </div>
                </div>

                {/* LÍNEA DE TIEMPO DE AVANCE DE OBRA (4 ETAPAS) */}
                <div className="mt-8 mb-10 p-5 sm:p-7 bg-[#FDFCF8] rounded-2xl sm:rounded-3xl border border-[#E5E5DF]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#C1694F]">timeline</span>
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4A4A30]">
                        Línea de Tiempo de Avance de Obra
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#6B6B54]">Etapa activa:</span>
                      <span className="bg-[#4A4A30] text-white px-3 py-0.5 rounded-full text-[11px] font-medium">
                        {project.currentStage}
                      </span>
                    </div>
                  </div>

                  {/* Desktop / Tablet Timeline Track (4 Stages) */}
                  <div className="hidden md:block relative pt-6 pb-2">
                    {/* Continuous Progress Track to active stage */}
                    <div className="relative w-full h-3 bg-[#EAEAE4] rounded-full overflow-hidden border border-[#DCDCD5]">
                      <div
                        style={{ width: '40%' }}
                        className="h-full bg-gradient-to-r from-[#054316] via-[#5A5A40] to-[#C1694F] transition-all duration-1000"
                      />
                    </div>

                    {/* 4 Milestones along the timeline */}
                    <div className="grid grid-cols-4 gap-4 mt-4 relative">
                      {project.timeline.map((item, idx) => {
                        const isCompleted = item.status === 'Completado';
                        const isInProgress = item.status === 'En ejecución';

                        return (
                          <div key={idx} className="flex flex-col items-center text-center relative group">
                            {/* Marker Node directly linking to the timeline */}
                            <div className="relative -mt-9 mb-3">
                              {isCompleted ? (
                                <div className="w-7 h-7 rounded-full bg-[#054316] text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                                  <span className="material-symbols-outlined text-[15px]">check</span>
                                </div>
                              ) : isInProgress ? (
                                <div className="w-7 h-7 rounded-full bg-[#C1694F] text-white flex items-center justify-center shadow-xs ring-4 ring-white animate-pulse">
                                  <span className="material-symbols-outlined text-[15px]">construction</span>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-white border-2 border-[#D5D5CF] text-[#9E9E8E] flex items-center justify-center text-[11px] font-semibold ring-4 ring-white">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            {/* Stage Name */}
                            <h5 className="text-sm font-bold text-[#2A2A2A] leading-snug">
                              {item.name}
                            </h5>

                            {item.description && (
                              <p className="text-[11px] text-[#6B6B54] font-light mt-0.5 line-clamp-2 min-h-[30px]">
                                {item.description}
                              </p>
                            )}

                            <div className="mt-2 flex flex-col items-center">
                              <span
                                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                  isCompleted
                                    ? 'bg-[#054316]/10 text-[#054316]'
                                    : isInProgress
                                    ? 'bg-[#C1694F]/10 text-[#C1694F]'
                                    : 'bg-[#F0F0EB] text-[#8C8C7E]'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Timeline Flow */}
                  <div className="md:hidden space-y-3 pt-2">
                    {/* Project Stage Indicator */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-[#4A4A30]">Etapa del Proyecto</span>
                        <span className="font-bold text-[#C1694F] bg-[#F9EBE7] px-2.5 py-0.5 rounded-full text-[11px]">
                          {project.currentStage}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#EAEAE4] rounded-full overflow-hidden border border-[#DCDCD5]">
                        <div
                          style={{ width: '40%' }}
                          className="h-full bg-gradient-to-r from-[#054316] to-[#C1694F]"
                        />
                      </div>
                    </div>

                    {/* Connected Milestone List */}
                    <div className="relative pl-6 space-y-3.5 border-l-2 border-[#E5E5DF] ml-2">
                      {project.timeline.map((item, idx) => {
                        const isCompleted = item.status === 'Completado';
                        const isInProgress = item.status === 'En ejecución';

                        return (
                          <div key={idx} className="relative flex items-center justify-between text-xs py-0.5">
                            {/* Timeline dot */}
                            <span
                              className={`absolute -left-[31px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                                isCompleted
                                  ? 'bg-[#054316] text-white'
                                  : isInProgress
                                  ? 'bg-[#C1694F] text-white animate-pulse'
                                  : 'bg-[#E5E5DF] text-[#6B6B54]'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </span>
                            <div className="pr-2">
                              <span className="font-bold text-[#2A2A2A] text-xs block">{item.name}</span>
                              {item.description && (
                                <span className="text-[10px] text-[#6B6B54] block mt-0.5">{item.description}</span>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  isCompleted
                                    ? 'bg-[#054316]/10 text-[#054316]'
                                    : isInProgress
                                    ? 'bg-[#C1694F]/10 text-[#C1694F]'
                                    : 'bg-[#F0F0EB] text-[#8C8C7E]'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* REGISTRO FOTOGRÁFICO DE OBRA (HASTA 3 FOTOS POR PROYECTO CON CARGA) */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#4A4A30] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[17px] text-[#5A5A40]">photo_camera</span>
                        Registro Fotográfico de Obra · {project.name}
                      </h4>
                      <p className="text-[11px] text-[#6B6B54] font-light mt-0.5">
                        Puedes subir 1, 2 o hasta 3 fotos de inspección o avance físico para este proyecto.
                      </p>
                    </div>

                    {/* Counter & Reset Action */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[11px] font-semibold text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-[#E5E5DF]">
                        {currentPhotos.length} de 3 fotos
                      </span>
                      {currentPhotos.some((p) => p.isUserUploaded) && (
                        <button
                          type="button"
                          onClick={() => handleResetPhotos(project.id)}
                          className="text-[11px] text-[#C1694F] hover:underline cursor-pointer flex items-center gap-1"
                          title="Volver a las fotos originales del proyecto"
                        >
                          <span className="material-symbols-outlined text-xs">restart_alt</span>
                          Restablecer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {feedbackMsg && (
                    <div className="mb-4 p-2.5 bg-[#F9EBE7] border border-[#C1694F]/30 text-[#C1694F] rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>{feedbackMsg}</span>
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={(el) => {
                      fileInputRefs.current[project.id] = el;
                    }}
                    onChange={(e) => {
                      if (e.target.files) {
                        handleUploadFiles(project.id, e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />

                  {/* Photo Cards Grid: 1, 2, or 3 Photos */}
                  <div
                    className={`grid gap-4 ${
                      currentPhotos.length === 1
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : currentPhotos.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {currentPhotos.map((photo, pIdx) => (
                      <div
                        key={photo.id || pIdx}
                        className="group bg-[#FDFCF8] rounded-2xl overflow-hidden border border-[#E5E5DF] shadow-xs flex flex-col relative"
                      >
                        <div
                          className="aspect-[4/3] overflow-hidden relative bg-[#F5F5F0] cursor-pointer"
                          onClick={() => setActiveModalPhoto({ photo, projectName: project.name })}
                          title="Clic para ampliar fotografía"
                        >
                          <img
                            src={photo.src}
                            alt={`${photo.caption} - ${project.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2.5 right-2.5 bg-[#2A2A2A]/85 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                            {photo.stage}
                          </span>

                          {photo.isUserUploaded && (
                            <span className="absolute top-2.5 left-2.5 bg-[#C1694F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                              Foto Subida
                            </span>
                          )}

                          {/* Hover Zoom Overlay */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-[#2A2A2A] rounded-full p-2 shadow-md flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">zoom_in</span>
                            </span>
                          </div>
                        </div>

                        {/* Caption & Actions */}
                        <div className="p-3 bg-white flex-1 flex items-center justify-between gap-2 border-t border-[#F0F0EB]">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-[#4A4A30] font-medium leading-snug truncate" title={photo.caption}>
                              {photo.caption}
                            </p>
                            {photo.uploadedAt && (
                              <span className="text-[9px] text-[#9E9E8E] block mt-0.5">
                                Subida: {photo.uploadedAt}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveModalPhoto({ photo, projectName: project.name })}
                              className="w-7 h-7 rounded-lg text-[#6B6B54] hover:text-[#2A2A2A] hover:bg-[#F5F5F0] flex items-center justify-center transition-colors cursor-pointer"
                              title="Ver en pantalla completa"
                            >
                              <span className="material-symbols-outlined text-sm">fullscreen</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(project.id, pIdx)}
                              className="w-7 h-7 rounded-lg text-[#9E9E8E] hover:text-[#C1694F] hover:bg-[#F9EBE7] flex items-center justify-center transition-colors cursor-pointer"
                              title="Eliminar esta foto"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Upload Dropzone Slot (if fewer than 3 photos) */}
                    {currentPhotos.length < 3 && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging((prev) => ({ ...prev, [project.id]: true }));
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging((prev) => ({ ...prev, [project.id]: false }));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging((prev) => ({ ...prev, [project.id]: false }));
                          if (e.dataTransfer.files) {
                            handleUploadFiles(project.id, e.dataTransfer.files);
                          }
                        }}
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        className={`rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-[4/3] ${
                          isDropActive
                            ? 'border-[#C1694F] bg-[#F9EBE7]/50 scale-[1.01]'
                            : 'border-[#D5D5CF] hover:border-[#5A5A40] bg-[#FDFCF8] hover:bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F0] flex items-center justify-center mb-2.5 text-[#5A5A40]">
                          <span className="material-symbols-outlined text-xl">add_a_photo</span>
                        </div>
                        <span className="text-xs font-semibold text-[#4A4A30] mb-1">
                          + Subir Foto {currentPhotos.length + 1} de 3
                        </span>
                        <p className="text-[10px] text-[#6B6B54] font-light max-w-[200px] leading-tight">
                          Arrastra y suelta aquí o haz clic para examinar (JPG, PNG, WEBP)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Drag-and-drop info strip below if full 3 photos */}
                  {currentPhotos.length === 3 && (
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#6B6B54] bg-[#FDFCF8] p-2.5 rounded-xl border border-[#E5E5DF]">
                      <span>Registro completo (3 de 3 fotos cargadas).</span>
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        className="text-[#C1694F] font-medium hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">upload</span>
                        Subir fotos para reemplazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Photo Inspection */}
      {activeModalPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setActiveModalPhoto(null)}
        >
          <div
            className="bg-[#FDFCF8] rounded-3xl max-w-3xl w-full overflow-hidden border border-[#E5E5DF] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5DF]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C1694F] tracking-wider block">
                  {activeModalPhoto.projectName} · Registro de Obra
                </span>
                <h4 className="text-base font-serif font-bold text-[#4A4A30]">
                  {activeModalPhoto.photo.caption}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalPhoto(null)}
                className="w-8 h-8 rounded-full bg-[#F5F5F0] hover:bg-[#E5E5DF] text-[#4A4A30] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Image */}
            <div className="bg-black/90 max-h-[70vh] flex items-center justify-center overflow-hidden">
              <img
                src={activeModalPhoto.photo.src}
                alt={activeModalPhoto.photo.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white flex items-center justify-between text-xs text-[#6B6B54]">
              <span className="font-medium text-[#4A4A30]">
                Etapa: {activeModalPhoto.photo.stage}
              </span>
              {activeModalPhoto.photo.uploadedAt && (
                <span>Fecha de registro: {activeModalPhoto.photo.uploadedAt}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};



