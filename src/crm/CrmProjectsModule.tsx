import React, { useState } from 'react';
import { Project, ProjectStatus, ProjectStage } from '../types';
import { apiUrl } from '../api';
import { uploadImage } from '../cloudinary';

interface CrmProjectsModuleProps {
  projects: Project[];
  onProjectCreated: (project: Project) => void;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: (projectId: string) => void;
  onShowToast: (msg: string) => void;
}

export const CrmProjectsModule: React.FC<CrmProjectsModuleProps> = ({
  projects,
  onProjectCreated,
  onProjectUpdated,
  onProjectDeleted,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('VIS');
  const [formLocation, setFormLocation] = useState('Cartago, Valle del Cauca');
  const [formZone, setFormZone] = useState('norte');
  const [formStatus, setFormStatus] = useState<ProjectStatus>('Preventa');
  const [formPriceRange, setFormPriceRange] = useState('Desde $195.750.000 COP');
  const [formPriceCOP, setFormPriceCOP] = useState<number>(195750000);
  const [formPriceSMMLV, setFormPriceSMMLV] = useState<number>(135);
  const [formStage, setFormStage] = useState<ProjectStage>('En Obra');
  const [formDescription, setFormDescription] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [formDeliveryYear, setFormDeliveryYear] = useState('2025 - 2026');
  const [formAreaMin, setFormAreaMin] = useState<number>(65);
  const [formAreaMax, setFormAreaMax] = useState<number>(78);
  const [formBedrooms, setFormBedrooms] = useState('3 Habitaciones');
  const [formBathrooms, setFormBathrooms] = useState('2 Baños');
  const [formParking, setFormParking] = useState('Privado');

  const openCreateModal = () => {
    setEditingProject(null);
    setFormName('');
    setFormType('VIS');
    setFormLocation('Cartago, Sector Norte - Valle del Cauca');
    setFormZone('norte');
    setFormStatus('Preventa');
    setFormPriceRange('Desde $195.750.000 COP (135 SMMLV)');
    setFormPriceCOP(195750000);
    setFormPriceSMMLV(135);
    setFormStage('En Obra');
    setFormDescription('');
    setFormShortDescription('');
    setFormPhotos([]);
    setNewPhotoUrl('');
    setFormDeliveryYear('2025 - 2026');
    setFormAreaMin(65);
    setFormAreaMax(78);
    setFormBedrooms('3 Habitaciones');
    setFormBathrooms('2 Baños');
    setFormParking('Privado');
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormName(project.name);
    setFormType(project.projectType || 'VIS');
    setFormLocation(project.location);
    setFormZone(project.zone || 'norte');
    setFormStatus(project.status || 'Preventa');
    setFormPriceRange(project.priceRange || `Desde $${(project.priceCOP || 0).toLocaleString('es-CO')} COP`);
    setFormPriceCOP(project.priceCOP || 195750000);
    setFormPriceSMMLV(project.priceSMMLV || 135);
    setFormStage(project.constructionStage || 'En Obra');
    setFormDescription(project.description || '');
    setFormShortDescription(project.shortDescription || '');
    setFormPhotos(
      project.photos && project.photos.length > 0
        ? [...project.photos]
        : project.galleryImages && project.galleryImages.length > 0
        ? [...project.galleryImages]
        : project.heroImage
        ? [project.heroImage]
        : []
    );
    setNewPhotoUrl('');
    setFormDeliveryYear(project.deliveryYear || '2025');
    setFormAreaMin(project.areaMin || 65);
    setFormAreaMax(project.areaMax || 78);
    setFormBedrooms(project.bedrooms || '3 Habitaciones');
    setFormBathrooms(project.bathrooms || '2 Baños');
    setFormParking(project.parking || 'Privado');
    setIsModalOpen(true);
  };

  const handleAddPhoto = () => {
  if (!newPhotoUrl.trim()) return;

  if (formPhotos.length >= 4) {
    alert('Este proyecto puede tener máximo 4 fotos.');
    return;
  }

  setFormPhotos([...formPhotos, newPhotoUrl.trim()]);
  setNewPhotoUrl('');
  };

  const handleUploadPhotos = async (files: FileList | null) => {
  if (!files || files.length === 0) return;

  const selectedFiles = Array.from(files);
  const availableSlots = 4 - formPhotos.length;

  if (availableSlots <= 0) {
    alert('Este proyecto puede tener máximo 4 fotos.');
    return;
  }

  if (selectedFiles.length > availableSlots) {
    alert(`Solo puedes agregar ${availableSlots} foto(s) más.`);
    return;
  }

  const validFiles = selectedFiles.filter((file) => {
    const validType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const validSize = file.size <= 5 * 1024 * 1024;

    if (!validType || !validSize) {
      alert(`${file.name}: usa JPG, PNG o WEBP de máximo 5 MB.`);
      return false;
    }

    return true;
  });

  try {
    setUploadingPhotos(true);

    const uploadedUrls = await Promise.all(
      validFiles.map((file) =>
        uploadImage(file, 'mys-construcciones/projects')
      )
    );

    setFormPhotos((current) => [...current, ...uploadedUrls]);
  } catch (error) {
    console.error('Error uploading project photos:', error);
    alert('No se pudieron subir una o más fotos.');
  } finally {
    setUploadingPhotos(false);
  }
  };

  const handleRemovePhoto = (idx: number) => {
    setFormPhotos(formPhotos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim()) {
      alert('Por favor completa el nombre y la ubicación del proyecto.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('ms_crm_token');

    const payload = {
      name: formName.trim(),
      projectType: formType,
      location: formLocation.trim(),
      zone: formZone,
      status: formStatus,
      priceRange: formPriceRange.trim(),
      priceCOP: formPriceCOP,
      priceSMMLV: formPriceSMMLV,
      areaMin: formAreaMin,
      areaMax: formAreaMax,
      bedrooms: formBedrooms.trim(),
      bathrooms: formBathrooms.trim(),
      parking: formParking.trim(),
      constructionStage: formStage,
      description: formDescription.trim(),
      shortDescription: formShortDescription.trim(),
      photos: formPhotos.length > 0 ? formPhotos : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      heroImage: formPhotos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      deliveryYear: formDeliveryYear.trim(),
    };

    try {
      if (editingProject) {
        // UPDATE
        const res = await fetch(apiUrl(`/api/crm/projects/${editingProject.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.project) {
          onProjectUpdated(data.project);
          onShowToast(`✓ Proyecto "${data.project.name}" actualizado correctamente`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Error al actualizar el proyecto');
        }
      } else {
        // CREATE
        const res = await fetch(apiUrl('/api/crm/projects'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.project) {
          onProjectCreated(data.project);
          onShowToast(`✓ Proyecto "${data.project.name}" creado exitosamente`);
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Error al crear el proyecto');
        }
      }
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Error de conexión con el servidor al guardar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proyecto "${project.name}"? Esta acción desvinculará sus propiedades asociadas.`)) {
      return;
    }

    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch(apiUrl(`/api/crm/projects/${project.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onProjectDeleted(project.id);
        onShowToast(`Proyecto "${project.name}" eliminado`);
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar el proyecto');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error de red al eliminar el proyecto.');
    }
  };

  // Filtered Projects List
  const filteredProjects = projects.filter((p) => {
    if (filterStatus !== 'all' && (p.status || 'Preventa') !== filterStatus) return false;
    if (filterStage !== 'all' && (p.constructionStage || 'En Obra') !== filterStage) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.projectType && p.projectType.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header with Stats and Action */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E9E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1F2421]">
              Catálogo de Proyectos
            </h2>
            <span className="text-xs bg-[#054316]/10 text-[#054316] font-bold px-2.5 py-0.5 rounded-full">
              {projects.length} Total
            </span>
          </div>
          <p className="text-xs text-[#525B54] mt-0.5 font-light">
            Crea, edita, actualiza avances de obra y gestiona las galerías de los macroproyectos.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#054316] hover:bg-[#075e1f] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E9E2] shadow-xs grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-6 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#859288] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden transition-all"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] font-medium cursor-pointer focus:bg-white focus:border-[#054316] outline-hidden"
          >
            <option value="all">Todos los Estados Comerciales</option>
            <option value="Lanzamiento">Lanzamiento</option>
            <option value="Preventa">Preventa</option>
            <option value="En Obra">En Obra</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] font-medium cursor-pointer focus:bg-white focus:border-[#054316] outline-hidden"
          >
            <option value="all">Todas las Etapas de Obra</option>
            <option value="En Preventa">En Preventa</option>
            <option value="En Obra">En Obra</option>
            <option value="En Acabados">En Acabados</option>
            <option value="Para Entregar">Para Entregar</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E9E2]">
          <span className="material-symbols-outlined text-4xl text-[#A0ACA2] mb-2">
            domain_disabled
          </span>
          <p className="text-sm font-semibold text-[#1F2421]">No se encontraron proyectos</p>
          <p className="text-xs text-[#6B786E] mt-1">Prueba ajustando los filtros o crea un nuevo proyecto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((proj) => {
            const displayPhoto =
              (proj.photos && proj.photos[0]) ||
              proj.heroImage ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E9E2] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative h-48 w-full bg-[#EAEFE8] overflow-hidden">
                    <img
                      src={displayPhoto}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-[#054316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {proj.projectType || 'VIS'}
                      </span>
                      <span className="bg-white/90 backdrop-blur-sm text-[#1F2421] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {proj.status || 'Preventa'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">
                        Etapa de Obra: {proj.constructionStage || 'En Obra'}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-sm leading-tight">
                        {proj.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start gap-2 text-xs text-[#525B54]">
                      <span className="material-symbols-outlined text-[16px] text-[#054316] shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span>{proj.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 px-3 bg-[#F8FAF3] rounded-xl border border-[#E5E9E2]">
                      <span className="text-[#6B786E] font-medium">Rango de Precios:</span>
                      <span className="font-bold text-[#054316]">{proj.priceRange || 'A convenir'}</span>
                    </div>

                    <p className="text-xs text-[#525B54] line-clamp-2 leading-relaxed">
                      {proj.shortDescription || proj.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#859288] pt-1">
                      <span>Entrega: <strong className="text-[#1F2421]">{proj.deliveryYear || '2025'}</strong></span>
                      <span>Fotos: <strong className="text-[#1F2421]">{proj.photos?.length || 1}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-[#F8FAF3] border-t border-[#E5E9E2] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#054316] hover:text-[#075e1f] bg-white hover:bg-[#EAEFE8] border border-[#D5DCD2] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(proj)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#D5DCD2] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E9E2] mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#054316] text-2xl">
                  {editingProject ? 'edit_note' : 'add_business'}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1F2421]">
                  {editingProject ? `Editar Proyecto: ${editingProject.name}` : 'Crear Nuevo Proyecto'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F0F4EC] text-[#525B54] hover:bg-[#E1E8DC] flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Urbanización Los Álamos"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Tipo de Proyecto */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Tipo de Proyecto
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="VIS">VIS (Vivienda de Interés Social)</option>
                    <option value="No VIS">No VIS</option>
                    <option value="Campestre">Campestre</option>
                    <option value="Comercial">Comercial / Mixto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Ubicación */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Ubicación en Cartago *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cartago, Sector Norte - Vía Zaragoza"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Zona */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Zona / Sector
                  </label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="norte">Sector Norte</option>
                    <option value="zaragoza">Vía Zaragoza</option>
                    <option value="centro">Centro</option>
                    <option value="sur">Sector Sur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Estado Comercial */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Estado Comercial
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="Lanzamiento">Lanzamiento</option>
                    <option value="Preventa">Preventa</option>
                    <option value="En Obra">En Obra</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>

                {/* Avance de Obra / Etapa */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Avance de Obra (4 Etapas)
                  </label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as ProjectStage)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="En Preventa">1. En Preventa</option>
                    <option value="En Obra">2. En Obra (Activa)</option>
                    <option value="En Acabados">3. En Acabados</option>
                    <option value="Para Entregar">4. Para Entregar</option>
                  </select>
                </div>

                {/* Año estimado de entrega */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Año de Entrega
                  </label>
                  <input
                    type="text"
                    placeholder="2025 - 2026"
                    value={formDeliveryYear}
                    onChange={(e) => setFormDeliveryYear(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>
              </div>

              {/* Precios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Texto Rango de Precios
                  </label>
                  <input
                    type="text"
                    placeholder="Desde $195.750.000 COP (135 SMMLV)"
                    value={formPriceRange}
                    onChange={(e) => setFormPriceRange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Precio Base en COP
                  </label>
                  <input
                    type="number"
                    value={formPriceCOP}
                    onChange={(e) => setFormPriceCOP(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>
              </div>

              {/* Ficha Técnica: Áreas y Composición */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Área Mínima (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="65"
                    value={formAreaMin}
                    onChange={(e) => setFormAreaMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Área Máxima (m²)
                  </label>
                  <input
                    type="number"
                    placeholder="78"
                    value={formAreaMax}
                    onChange={(e) => setFormAreaMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Parqueadero
                  </label>
                  <input
                    type="text"
                    placeholder="Privado y Comunal"
                    value={formParking}
                    onChange={(e) => setFormParking(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Habitaciones
                  </label>
                  <input
                    type="text"
                    placeholder="3 Habitaciones"
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Baños
                  </label>
                  <input
                    type="text"
                    placeholder="2 Baños"
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-[#1F2421] mb-1">
                  Descripción Detallada (aparece en la Ficha Completa del sitio web)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles de arquitectura, amenidades, subsidios aplicables..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden resize-none"
                />
              </div>

              {/* Descripción Corta */}
              <div>
                <label className="block text-xs font-bold text-[#1F2421] mb-1">
                  Descripción Corta (aparece en la tarjeta del sitio web)
                </label>
                <textarea
                  rows={2}
                  placeholder="Resumen breve para la tarjeta. Si la dejas VACÍA, se mostrará tu Descripción Detallada."
                  value={formShortDescription}
                  onChange={(e) => setFormShortDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden resize-none"
                />
              </div>

              {/* Galería de Fotos */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1F2421]">
                  Galería de Fotos del Proyecto (URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/foto-proyecto.jpg"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-[#054316] hover:bg-[#075e1f] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                  >
                    Añadir Foto
                  </button>
                </div>

                <div className="flex items-center gap-2">
                 <label className="bg-[#EAF2E6] hover:bg-[#DCEBD5] text-[#054316] px-3 py-2 rounded-xl text-xs font-bold cursor-pointer">
                   {uploadingPhotos ? 'Subiendo...' : 'Subir imágenes'}
                   <input
                     type="file"
                     accept="image/jpeg,image/png,image/webp"
                     multiple
                     disabled={uploadingPhotos || formPhotos.length >= 4}
                     onChange={(e) => {
                       handleUploadPhotos(e.target.files);
                       e.currentTarget.value = '';
                     }}
                     className="hidden"
                   />
                 </label>

                 <span className="text-[11px] text-[#6B786E]">
                   {formPhotos.length}/4 fotos
                 </span>
                </div>

                {/* Previews */}
                {formPhotos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {formPhotos.map((url, i) => (
                      <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-[#D5DCD2] shrink-0 group">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción del modal */}
              <div className="pt-4 border-t border-[#E5E9E2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#525B54] hover:bg-[#F0F4EC] rounded-xl cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#054316] hover:bg-[#075e1f] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
