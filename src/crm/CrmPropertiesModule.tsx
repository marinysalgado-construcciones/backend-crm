import React, { useState } from 'react';
import { PropertyItem, PropertyType, PropertyStatus, Project } from '../types';
import { apiUrl } from '../api';
import { uploadImage } from '../cloudinary';

interface CrmPropertiesModuleProps {
  properties: PropertyItem[];
  projects: Project[];
  onPropertyCreated: (prop: PropertyItem) => void;
  onPropertyUpdated: (prop: PropertyItem) => void;
  onPropertyDeleted: (propId: string) => void;
  onShowToast: (msg: string) => void;
}

export const CrmPropertiesModule: React.FC<CrmPropertiesModuleProps> = ({
  properties,
  projects,
  onPropertyCreated,
  onPropertyUpdated,
  onPropertyDeleted,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formProjectId, setFormProjectId] = useState<string>('');
  const [formType, setFormType] = useState<PropertyType>('Casa');
  const [formLocation, setFormLocation] = useState('Cartago, Valle del Cauca');
  const [formPrice, setFormPrice] = useState<number>(195750000);
  const [formStatus, setFormStatus] = useState<PropertyStatus>('Disponible');
  const [formArea, setFormArea] = useState<number>(65);
  const [formBedrooms, setFormBedrooms] = useState<number>(3);
  const [formBathrooms, setFormBathrooms] = useState<number>(2);
  const [formDescription, setFormDescription] = useState('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [formFeatured, setFormFeatured] = useState<boolean>(true);

  const openCreateModal = () => {
    setEditingProperty(null);
    setFormName('');
    setFormProjectId(projects.length > 0 ? projects[0].id : '');
    setFormType('Casa');
    setFormLocation('Cartago, Sector Norte');
    setFormPrice(195750000);
    setFormStatus('Disponible');
    setFormArea(65);
    setFormBedrooms(3);
    setFormBathrooms(2);
    setFormDescription('Excelente inmueble con acabados de primera, iluminación natural y ventilación cruzada.');
    setFormPhotos([
      'https://lh3.googleusercontent.com/aida/AEtjO1WzmJjPEXcy05boPwamPvH-RWmZKkSpQIrpjrSpv6Q4LxVKYDdbK8PsmSECyKZdMmdzlPQh6V9yLAfEc2xGQHGsSe8I0m0UWUmXzxGu3Xl8JvkywVC4T_dAfB5eIjOkLwsyrNM0anNa6fgF3Lrwpyp5jahAzYzgrbqGfbPEn-NQxpWqM12_2hieP00HAIlF70_a7FnayH5LTZQvSg0tK8myZNUm6bQeR2Wz3mLFm2f6FToCFuYZUwCS4w',
    ]);
    setNewPhotoUrl('');
    setFormFeatured(true);
    setIsModalOpen(true);
  };

  const openEditModal = (prop: PropertyItem) => {
    setEditingProperty(prop);
    setFormName(prop.name);
    setFormProjectId(prop.projectId || '');
    setFormType(prop.type);
    setFormLocation(prop.location);
    setFormPrice(prop.price);
    setFormStatus(prop.status);
    setFormArea(prop.area);
    setFormBedrooms(prop.bedrooms);
    setFormBathrooms(prop.bathrooms);
    setFormDescription(prop.description || '');
    setFormPhotos(prop.photos && prop.photos.length > 0 ? [...prop.photos] : []);
    setNewPhotoUrl('');
    setFormFeatured(Boolean(prop.featured));
    setIsModalOpen(true);
  };

  const handleAddPhoto = () => {
  if (!newPhotoUrl.trim()) return;

  if (formPhotos.length >= 4) {
    alert('Esta propiedad puede tener máximo 4 fotos.');
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
    alert('Esta propiedad puede tener máximo 4 fotos.');
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
        uploadImage(file, 'mys-construcciones/properties')
      )
    );

    setFormPhotos((current) => [...current, ...uploadedUrls]);
  } catch (error) {
    console.error('Error uploading property photos:', error);
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
    if (!formName.trim() || !formPrice) {
      alert('Por favor completa el nombre y precio del inmueble.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('ms_crm_token');

    const payload = {
      name: formName.trim(),
      projectId: formProjectId ? formProjectId : null,
      type: formType,
      location: formLocation.trim(),
      price: Number(formPrice),
      status: formStatus,
      area: Number(formArea),
      bedrooms: Number(formBedrooms),
      bathrooms: Number(formBathrooms),
      description: formDescription.trim(),
      photos: formPhotos.length > 0 ? formPhotos : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      featured: formFeatured,
    };

    try {
      if (editingProperty) {
        // UPDATE
        const res = await fetch(apiUrl(`/api/crm/properties/${editingProperty.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.property) {
          onPropertyUpdated(data.property);
          onShowToast(`✓ Inmueble "${data.property.name}" actualizado`);
          setIsModalOpen(false);
          // Re-consulta del catálogo para actualizar el frontend público
          window.dispatchEvent(new Event('mys:catalog-updated'));
        } else {
          alert(data.error || 'Error al actualizar propiedad');
        }
      } else {
        // CREATE
        const res = await fetch(apiUrl('/api/crm/properties'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.property) {
          onPropertyCreated(data.property);
          onShowToast(`✓ Inmueble "${data.property.name}" creado exitosamente`);
          setIsModalOpen(false);
          // Re-consulta del catálogo para actualizar el frontend público
          window.dispatchEvent(new Event('mys:catalog-updated'));
        } else {
          alert(data.error || 'Error al crear propiedad');
        }
      }
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Error al conectar con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (prop: PropertyItem) => {
    if (!window.confirm(`¿Estás seguro de eliminar el inmueble "${prop.name}"?`)) {
      return;
    }

    const token = localStorage.getItem('ms_crm_token');
    try {
      const res = await fetch(apiUrl(`/api/crm/properties/${prop.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onPropertyDeleted(prop.id);
        onShowToast(`Inmueble "${prop.name}" eliminado`);
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar el inmueble');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Error de red al eliminar el inmueble.');
    }
  };

  // Filtered Properties
  const filteredProperties = properties.filter((p) => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterProject !== 'all') {
      if (filterProject === 'none' && p.projectId) return false;
      if (filterProject !== 'none' && p.projectId !== filterProject) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.projectName && p.projectName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E9E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1F2421]">
              Gestión de Propiedades &amp; Inmuebles
            </h2>
            <span className="text-xs bg-[#054316]/10 text-[#054316] font-bold px-2.5 py-0.5 rounded-full">
              {properties.length} Inmuebles
            </span>
          </div>
          <p className="text-xs text-[#525B54] mt-0.5 font-light">
            Administra las unidades individuales (casas, apartamentos o lotes) y asígnalas a tus macroproyectos.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#054316] hover:bg-[#075e1f] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_home</span>
          <span>Nueva Propiedad</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E9E2] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-5 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#859288] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden transition-all"
          />
        </div>

        <div className="lg:col-span-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] font-medium cursor-pointer focus:bg-white focus:border-[#054316] outline-hidden"
          >
            <option value="all">Todos los Tipos</option>
            <option value="Casa">Casas</option>
            <option value="Apartamento">Apartamentos</option>
            <option value="Lote">Lotes</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] font-medium cursor-pointer focus:bg-white focus:border-[#054316] outline-hidden"
          >
            <option value="all">Todos los Estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Reservado">Reservado</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] font-medium cursor-pointer focus:bg-white focus:border-[#054316] outline-hidden"
          >
            <option value="all">Todos los Proyectos</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
            <option value="none">Sin Proyecto Asociado</option>
          </select>
        </div>
      </div>

      {/* Properties Table / Cards View */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E9E2]">
          <span className="material-symbols-outlined text-4xl text-[#A0ACA2] mb-2">
            holiday_village
          </span>
          <p className="text-sm font-semibold text-[#1F2421]">No se encontraron propiedades</p>
          <p className="text-xs text-[#6B786E] mt-1">Crea un inmueble o modifica tus criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const displayPhoto =
              (prop.photos && prop.photos[0]) ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

            const statusColors: Record<PropertyStatus, string> = {
              Disponible: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              Reservado: 'bg-amber-100 text-amber-800 border-amber-300',
              Vendido: 'bg-rose-100 text-rose-800 border-rose-300',
            };

            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E9E2] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with status badge */}
                  <div className="relative h-44 w-full bg-[#EAEFE8] overflow-hidden">
                    <img
                      src={displayPhoto}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-[#054316] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {prop.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${statusColors[prop.status] || 'bg-gray-100 text-gray-800'}`}>
                        {prop.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <span className="text-[10px] text-emerald-200 block truncate font-medium">
                        {prop.projectName || 'Independiente'}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-snug drop-shadow-sm truncate">
                        {prop.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#054316]">
                        ${prop.price.toLocaleString('es-CO')} COP
                      </span>
                      <span className="text-xs text-[#525B54] font-medium">
                        {prop.area} m²
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-[#F8FAF3] rounded-xl border border-[#E5E9E2] text-[11px] text-[#525B54] text-center">
                      <div>
                        <span className="font-bold text-[#1F2421] block">{prop.bedrooms}</span>
                        <span className="text-[10px] text-[#859288]">Hab.</span>
                      </div>
                      <div className="border-x border-[#E5E9E2]">
                        <span className="font-bold text-[#1F2421] block">{prop.bathrooms}</span>
                        <span className="text-[10px] text-[#859288]">Baños</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#1F2421] block">{prop.area} m²</span>
                        <span className="text-[10px] text-[#859288]">Área</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-[#6B786E]">
                      <span className="material-symbols-outlined text-[15px] text-[#054316] shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span className="truncate">{prop.location}</span>
                    </div>

                    <p className="text-xs text-[#525B54] line-clamp-2 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3 bg-[#F8FAF3] border-t border-[#E5E9E2] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(prop)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#054316] hover:text-[#075e1f] bg-white border border-[#D5DCD2] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(prop)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 bg-white border border-rose-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Propiedad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#D5DCD2] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E9E2] mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#054316] text-2xl">
                  {editingProperty ? 'edit_location_alt' : 'add_home_work'}
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1F2421]">
                  {editingProperty ? `Editar Propiedad: ${editingProperty.name}` : 'Crear Nueva Propiedad'}
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
                {/* Nombre de la unidad */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Nombre / Identificador de la Unidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Casa Tipo A · Manzana 3 Lote 12"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Proyecto Asociado */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Proyecto Asociado (Opcional)
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="">Independiente</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name} ({proj.projectType || 'VIS'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Tipo de Inmueble */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Tipo de Inmueble *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Lote">Lote</option>
                    <option value="Local">Local</option>
                    <option value="Finca">Finca</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Bodega">Bodega</option>
                  </select>
                </div>

                {/* Estado de Disponibilidad */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Estado *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden cursor-pointer"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Vendido">Vendido</option>
                  </select>
                </div>

                {/* Precio en COP */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Precio (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Ubicación */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Ubicación Específica *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cartago, Sector Norte"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Área m² */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    value={formArea}
                    onChange={(e) => setFormArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Habitaciones */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Baños */}
                <div>
                  <label className="block text-xs font-bold text-[#1F2421] mb-1">
                    Baños
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden"
                  />
                </div>

                {/* Destacado */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="chk-featured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#054316] rounded border-[#D5DCD2] focus:ring-[#054316] cursor-pointer"
                  />
                  <label htmlFor="chk-featured" className="text-xs font-bold text-[#1F2421] cursor-pointer">
                    Destacar en el Catálogo Principal
                  </label>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-[#1F2421] mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre distribución, acabados, parqueadero..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAF3] border border-[#D5DCD2] rounded-xl text-xs text-[#1F2421] focus:bg-white focus:border-[#054316] outline-hidden resize-none"
                />
              </div>

              {/* Galería de Fotos */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1F2421]">
                  Galería de Fotos del Inmueble (URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/foto-inmueble.jpg"
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
                  {submitting ? 'Guardando...' : editingProperty ? 'Guardar Cambios' : 'Crear Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
