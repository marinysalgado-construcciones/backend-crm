import React from 'react';
import { Project } from '../types';
import { formatCOP } from '../utils/calculatorEngine';

interface ProjectsSectionProps {
  projects: Project[];
  totalAvailable: number;
  onSelectProject: (project: Project) => void;
  onSimulateInCalculator: (projectId: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  totalAvailable,
  onSelectProject,
  onSimulateInCalculator,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
            Nuestros Proyectos en Cartago
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
            Viviendas de Interés Social (VIS) Estilo Premium
          </h2>
          <p className="text-[#6B6B54] text-sm sm:text-base mt-2.5 max-w-2xl font-light">
            Descubre nuestras opciones habitacionales diseñadas para brindar durabilidad, confort bioclimático y la mejor
            proyección de valorización en el Valle del Cauca.
          </p>
        </div>

        {/* Status Count & Clear */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F5F5F0] border border-[#E5E5DF] px-4 py-2 rounded-full text-xs font-semibold text-[#4A4A30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">check_circle</span>
            <span>
              {projects.length} de {totalAvailable} proyectos disponibles
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-[#C1694F] hover:text-[#A1553F] underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-[32px] overflow-hidden border border-[#E5E5DF] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image with Stage Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F0]">
                <img
                  src={
                    project.heroImage ||
                    (project.photos && project.photos[0]) ||
                    (project.galleryImages && project.galleryImages[0]) ||
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#4A4A30]/90 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wider uppercase px-3.5 py-1 rounded-full shadow-xs">
                  {project.stage || project.constructionStage || project.status || 'En Obra'}
                </div>
                <div className="absolute bottom-4 right-4 bg-[#C1694F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {project.deliveryYear ? `Entrega ${project.deliveryYear}` : (project.projectType || 'VIS')}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-2xl font-serif text-[#4A4A30] group-hover:text-[#5A5A40] transition-colors">
                    {project.name}
                  </h3>
                  <span className="bg-[#F5F5F0] text-[#6B6B54] border border-[#E5E5DF] text-xs font-semibold px-3 py-1 rounded-full">
                    {project.typeName || project.projectType || 'Proyecto VIS'}
                  </span>
                </div>

                <p className="text-[#C1694F] text-xs sm:text-sm font-medium flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {project.location}
                </p>

                <p className="text-[#6B6B54] text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                  {project.shortDescription || project.description}
                </p>

                {/* Specs Row */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-[#FDFCF8] rounded-2xl border border-[#E5E5DF] mb-6">
                  <div className="text-center">
                    <span className="text-[10px] text-[#9E9E8E] uppercase tracking-wider block font-bold">Habitaciones</span>
                    <span className="text-sm font-semibold text-[#4A4A30] flex items-center justify-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">bed</span>
                      {typeof project.bedrooms === 'string' ? project.bedrooms.split(' ')[0] : (project.bedrooms || '2-3')}
                    </span>
                  </div>
                  <div className="text-center border-x border-[#E5E5DF]">
                    <span className="text-[10px] text-[#9E9E8E] uppercase tracking-wider block font-bold">Baños</span>
                    <span className="text-sm font-semibold text-[#4A4A30] flex items-center justify-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">bathtub</span>
                      {typeof project.bathrooms === 'string' ? project.bathrooms.split(' ')[0] : (project.bathrooms || '1-2')}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-[#9E9E8E] uppercase tracking-wider block font-bold">Área</span>
                    <span className="text-sm font-semibold text-[#4A4A30] flex items-center justify-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">square_foot</span>
                      {project.areaMin || '52'} m²
                    </span>
                  </div>
                </div>

                {/* Price Bar */}
                <div className="flex items-baseline justify-between mb-6">
                  <div>
                    <span className="text-[11px] font-medium text-[#9E9E8E] uppercase tracking-wider block">Rango de precio:</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A30]">
                      {project.priceRange || (project.priceSMMLV ? `Desde ${project.priceSMMLV} SMMLV` : `$${(project.priceCOP || 159500000).toLocaleString('es-CO')} COP`)}
                    </span>
                  </div>
                  {project.priceCOP && (
                    <span className="text-xs sm:text-sm font-semibold text-[#C1694F]">
                      (~{formatCOP(project.priceCOP)})
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-[#E5E5DF]">
                  <button
                    onClick={() => onSelectProject(project)}
                    type="button"
                    className="w-full bg-[#F5F5F0] hover:bg-[#E5E5DF] text-[#4A4A30] border border-[#E5E5DF] py-2.5 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Ver Ficha Completa
                  </button>

                  <button
                    onClick={() => onSimulateInCalculator(project.id)}
                    type="button"
                    className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-2.5 px-4 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#C1694F]">calculate</span>
                    Simular Cuota VIS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E5E5DF] rounded-[32px] p-10 text-center max-w-lg mx-auto shadow-xs">
          <span className="material-symbols-outlined text-[#9E9E8E] text-5xl mb-3">search_off</span>
          <h3 className="text-xl font-serif text-[#4A4A30] mb-1">No encontramos proyectos con estos filtros</h3>
          <p className="text-sm text-[#6B6B54] mb-6 font-light">
            Prueba seleccionando otra ubicación o tipo de inmueble para visualizar nuestras viviendas disponibles.
          </p>
          <button
            onClick={onClearFilters}
            className="bg-[#5A5A40] text-white px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#4A4A30] transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Ver todos los proyectos
          </button>
        </div>
      )}
    </section>
  );
};
