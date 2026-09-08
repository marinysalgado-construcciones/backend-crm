import React, { useState } from 'react';
import { PropertyItem, PropertyType, PropertyStatus } from '../types';

interface PropertiesSectionProps {
  properties: PropertyItem[];
  totalAvailable: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  filterType: string;
  setFilterType: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterBedrooms: string;
  setFilterBedrooms: (val: string) => void;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  properties,
  totalAvailable,
  onClearFilters,
  hasActiveFilters,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterBedrooms,
  setFilterBedrooms,
}) => {
  // Modal state for viewing a property in detail
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const openPropertyModal = (prop: PropertyItem) => {
    setSelectedProperty(prop);
    setActivePhotoIdx(0);
  };

  const closePropertyModal = () => {
    setSelectedProperty(null);
    setActivePhotoIdx(0);
  };

  const handleWhatsAppContact = (prop: PropertyItem) => {
    const text = `Hola Marín & Salgado, me interesa recibir información sobre la propiedad: "${prop.name}" (${prop.type}) ubicada en ${prop.location}, con precio de $${prop.price.toLocaleString('es-CO')} COP.`;
    const url = `https://wa.me/573226374991?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const statusBadgeClasses: Record<PropertyStatus, string> = {
    Disponible: 'bg-emerald-600 text-white',
    Reservado: 'bg-amber-600 text-white',
    Vendido: 'bg-rose-700 text-white',
  };

  return (
    <section id="propiedades" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
            Inventario Inmobiliario Dinámico
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
            Catálogo de Propiedades Disponibles
          </h2>
          <p className="text-[#6B6B54] text-sm sm:text-base mt-2 max-w-2xl font-light">
            Encuentra casas, apartamentos y lotes con acabados de primera calidad, diseñados para
            brindar durabilidad y confort bioclimático en Cartago.
          </p>
        </div>

        {/* Counter and Clear Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#F5F5F0] border border-[#E5E5DF] px-4 py-2 rounded-full text-xs font-semibold text-[#4A4A30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">home_work</span>
            <span>
              {properties.length} de {totalAvailable} inmuebles encontrados
            </span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-semibold text-[#C1694F] hover:text-[#A1553F] underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-[#F8FAF3] border border-[#E5E9E2] rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-3">
        {/* Type selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#4A4A30] mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#054316]">filter_alt</span>
            Tipo:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'Casa', label: 'Casas' },
            { id: 'Apartamento', label: 'Apartamentos' },
            { id: 'Lote', label: 'Lotes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#054316] text-white shadow-xs'
                  : 'bg-white text-[#525B54] hover:bg-[#EAEFE8] border border-[#D5DCD2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#D5DCD2] rounded-xl text-xs text-[#4A4A30] font-medium cursor-pointer outline-hidden focus:border-[#054316]"
          >
            <option value="all">Cualquier Estado</option>
            <option value="Disponible">Solo Disponibles</option>
            <option value="Reservado">Reservados</option>
            <option value="Vendido">Vendidos</option>
          </select>

          {/* Bedrooms filter */}
          <select
            value={filterBedrooms}
            onChange={(e) => setFilterBedrooms(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#D5DCD2] rounded-xl text-xs text-[#4A4A30] font-medium cursor-pointer outline-hidden focus:border-[#054316]"
          >
            <option value="all">Habitaciones: Todas</option>
            <option value="1">1+ Habitaciones</option>
            <option value="2">2+ Habitaciones</option>
            <option value="3">3+ Habitaciones</option>
          </select>
        </div>
      </div>

      {/* Properties Cards Grid */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E5DF] shadow-xs">
          <span className="material-symbols-outlined text-5xl text-[#A0ACA2] mb-3">
            holiday_village
          </span>
          <h3 className="text-lg font-serif font-bold text-[#4A4A30]">
            No encontramos inmuebles con estos criterios
          </h3>
          <p className="text-xs text-[#6B6B54] mt-1 mb-5 max-w-md mx-auto">
            Prueba restableciendo los filtros o contáctanos por WhatsApp para consultar propiedades exclusivas en proceso de lanzamiento.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="bg-[#054316] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#075e1f] transition-colors cursor-pointer"
          >
            Ver todos los inmuebles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {properties.map((prop) => {
            const displayPhoto =
              (prop.photos && prop.photos[0]) ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={prop.id}
                className="bg-white rounded-[28px] overflow-hidden border border-[#E5E5DF] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image with Badges */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#F5F5F0]">
                    <img
                      src={displayPhoto}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-[#054316] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {prop.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${statusBadgeClasses[prop.status] || 'bg-gray-700 text-white'}`}>
                        {prop.status}
                      </span>
                    </div>

                    {/* Project Associated tag */}
                    {prop.projectName && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#2A2A2A] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#054316]">domain</span>
                        <span className="max-w-[130px] truncate">{prop.projectName}</span>
                      </div>
                    )}

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium mb-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="truncate">{prop.location}</span>
                      </p>
                      <h3 className="text-base font-serif font-bold text-white leading-snug drop-shadow-sm line-clamp-1">
                        {prop.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Specs & Price */}
                  <div className="p-5 space-y-3.5">
                    {/* Price Tag */}
                    <div className="flex items-baseline justify-between border-b border-[#F0F2ED] pb-3">
                      <div>
                        <span className="text-[10px] text-[#859288] uppercase tracking-wider block">
                          Precio de Venta
                        </span>
                        <span className="text-xl font-bold text-[#054316] tracking-tight">
                          ${prop.price.toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#4A4A30] bg-[#F8FAF3] px-2.5 py-1 rounded-lg border border-[#E5E9E2]">
                        {prop.area} m²
                      </span>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-[#F8FAF3] rounded-xl border border-[#E5E9E2] text-center">
                      <div>
                        <span className="text-xs font-bold text-[#1F2421] block">{prop.bedrooms}</span>
                        <span className="text-[10px] text-[#707D73]">Habitaciones</span>
                      </div>
                      <div className="border-x border-[#E5E9E2]">
                        <span className="text-xs font-bold text-[#1F2421] block">{prop.bathrooms}</span>
                        <span className="text-[10px] text-[#707D73]">Baños</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1F2421] block">{prop.area} m²</span>
                        <span className="text-[10px] text-[#707D73]">Área Total</span>
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-[#525B54] line-clamp-2 leading-relaxed font-light">
                      {prop.description}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-[#F8FAF3] border-t border-[#E5E5DF] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openPropertyModal(prop)}
                    className="flex-1 bg-white hover:bg-[#EAEFE8] text-[#054316] border border-[#D5DCD2] text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Ver Detalles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppContact(prop)}
                    className="bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 shrink-0"
                    title="Consultar por WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D5DCD2] my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative bg-[#1F2421] text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#86c33c] text-[#132A13] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedProperty.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadgeClasses[selectedProperty.status] || 'bg-gray-600'}`}>
                    {selectedProperty.status}
                  </span>
                  {selectedProperty.projectName && (
                    <span className="text-xs text-[#9EAAA0]">
                      en {selectedProperty.projectName}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  {selectedProperty.name}
                </h3>
                <p className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  {selectedProperty.location}
                </p>
              </div>

              <button
                type="button"
                onClick={closePropertyModal}
                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Gallery Carrousel */}
            <div className="bg-black/90 relative aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
              <img
                src={
                  (selectedProperty.photos && selectedProperty.photos[activePhotoIdx]) ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                }
                alt={selectedProperty.name}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next controls if multiple photos */}
              {selectedProperty.photos && selectedProperty.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === 0 ? selectedProperty.photos.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === selectedProperty.photos.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>

                  <div className="absolute bottom-3 bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-mono">
                    Foto {activePhotoIdx + 1} de {selectedProperty.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails strip */}
            {selectedProperty.photos && selectedProperty.photos.length > 1 && (
              <div className="p-3 bg-[#181C1A] flex gap-2 overflow-x-auto">
                {selectedProperty.photos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === i ? 'border-[#86c33c] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Modal Body Info */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E9E2]">
                <div>
                  <span className="text-xs text-[#859288] uppercase tracking-wider block font-semibold">
                    Valor Comercial
                  </span>
                  <span className="text-2xl font-bold text-[#054316]">
                    ${selectedProperty.price.toLocaleString('es-CO')} COP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppContact(selectedProperty)}
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Contactar Asesor</span>
                  </button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F8FAF3] rounded-2xl border border-[#E5E9E2] text-center">
                <div>
                  <span className="text-sm font-bold text-[#1F2421] block">{selectedProperty.area} m²</span>
                  <span className="text-xs text-[#707D73]">Área Construida</span>
                </div>
                <div className="border-x border-[#E5E9E2]">
                  <span className="text-sm font-bold text-[#1F2421] block">{selectedProperty.bedrooms}</span>
                  <span className="text-xs text-[#707D73]">Habitaciones</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-[#1F2421] block">{selectedProperty.bathrooms}</span>
                  <span className="text-xs text-[#707D73]">Baños</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-[#1F2421] uppercase tracking-wider mb-1.5">
                  Descripción del Inmueble
                </h4>
                <p className="text-xs text-[#525B54] leading-relaxed font-light whitespace-pre-line">
                  {selectedProperty.description || 'Sin descripción adicional disponible.'}
                </p>
              </div>

              {/* Subsidies & Benefits callout */}
              <div className="p-4 bg-[#EAEFE8] rounded-2xl border border-[#D5DCD2] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#054316] text-xl shrink-0 mt-0.5">
                  verified
                </span>
                <div className="text-xs text-[#2F3E32]">
                  <strong className="block text-[#054316] font-bold mb-0.5">
                    Asesoría de Subsidios y Financiación Disponible
                  </strong>
                  Te acompañamos en la postulación a subsidios de vivienda (Mi Casa Ya, Cajas de Compensación Familiar) y crédito hipotecario con entidades bancarias aliadas.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
