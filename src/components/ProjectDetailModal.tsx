import React, { useState } from 'react';
import { Project } from '../types';
import { formatCOP } from '../utils/calculatorEngine';
import { COMPANY_INFO } from '../data/projectsData';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSimulateInCalculator: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSimulateInCalculator,
}) => {
  if (!project) return null;

  const [activePlanId, setActivePlanId] = useState<string>(project.floorPlans[0]?.id || '');
  const [activeImage, setActiveImage] = useState<string>(project.heroImage);

  const activePlan = project.floorPlans.find((p) => p.id === activePlanId) || project.floorPlans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c1c9bc] relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal de proyecto"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Hero Header with Selected Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#ecefe7]">
          <img
            src={activeImage}
            alt={project.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
            <div>
              <span className="bg-[#86c33c] text-[#054316] text-xs font-mono font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider mb-2 inline-block">
                {project.stage}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{project.name}</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#86c33c]">location_on</span>
                {project.location}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery Strip */}
        <div className="flex gap-2 p-4 bg-[#f8faf3] border-b border-[#c1c9bc]/40 overflow-x-auto">
          <button
            onClick={() => setActiveImage(project.heroImage)}
            className={`w-16 h-12 rounded overflow-hidden border-2 shrink-0 ${
              activeImage === project.heroImage ? 'border-[#054316]' : 'border-transparent opacity-70'
            }`}
          >
            <img src={project.heroImage} alt="Principal" className="w-full h-full object-cover" />
          </button>
          {project.galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-16 h-12 rounded overflow-hidden border-2 shrink-0 ${
                activeImage === img ? 'border-[#054316]' : 'border-transparent opacity-70'
              }`}
            >
              <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Overview & Tech Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-lg font-bold text-[#054316]">Descripción del Proyecto</h3>
              <p className="text-[#41493f] text-sm leading-relaxed">{project.description}</p>

              {/* Features List */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#054316] uppercase tracking-wider mb-2">
                  Atributos Principales:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="p-2.5 bg-[#f2f4ed] rounded border border-[#c1c9bc]/50 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#054316] mb-0.5">
                        <span className="material-symbols-outlined text-[16px] text-[#3f6900]">{feat.icon}</span>
                        {feat.title}
                      </div>
                      <p className="text-[#41493f] text-[11px]">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ficha Técnica Card */}
            <div className="md:col-span-5 bg-[#f8faf3] border border-[#c1c9bc] rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-bold text-[#054316] border-b border-[#c1c9bc]/60 pb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">fact_check</span>
                Ficha Técnica
              </h4>
              <ul className="text-xs space-y-2">
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Tipo de Vivienda</span>
                  <span className="font-bold text-[#191c18]">{project.typeName}</span>
                </li>
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Área Construida</span>
                  <span className="font-bold text-[#191c18]">Desde {project.areaMin} m² hasta {project.areaMax} m²</span>
                </li>
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Habitaciones</span>
                  <span className="font-bold text-[#191c18]">{project.bedrooms}</span>
                </li>
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Baños</span>
                  <span className="font-bold text-[#191c18]">{project.bathrooms}</span>
                </li>
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Parqueadero</span>
                  <span className="font-bold text-[#191c18]">{project.parking}</span>
                </li>
                <li className="flex justify-between border-b border-[#c1c9bc]/30 pb-1">
                  <span className="text-[#41493f]">Precio de Referencia</span>
                  <span className="font-bold text-[#054316]">{formatCOP(project.priceCOP)}</span>
                </li>
                <li className="flex justify-between pt-1">
                  <span className="text-[#41493f]">Subsidios Aplican</span>
                  <span className="font-bold text-[#3f6900]">Mi Casa Ya + Cajas</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Floor Plans Section within Modal */}
          {project.floorPlans.length > 0 && (
            <div className="border-t border-[#c1c9bc]/50 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-base font-bold text-[#054316]">Planos y Distribución Arquitectónica</h3>
                <div className="flex gap-1.5">
                  {project.floorPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setActivePlanId(plan.id)}
                      className={`text-xs px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                        activePlanId === plan.id
                          ? 'bg-[#054316] text-white'
                          : 'bg-[#f2f4ed] text-[#41493f] border border-[#c1c9bc] hover:bg-[#ecefe7]'
                      }`}
                    >
                      {plan.title}
                    </button>
                  ))}
                </div>
              </div>

              {activePlan && (
                <div className="bg-[#f8faf3] border border-[#c1c9bc] rounded-lg p-4">
                  <div className="max-h-[350px] overflow-hidden flex items-center justify-center bg-white rounded border border-[#c1c9bc]/50 p-2">
                    <img
                      src={activePlan.image}
                      alt={activePlan.title}
                      className="max-h-[330px] w-auto object-contain"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap justify-between items-center text-xs text-[#41493f]">
                    <span>
                      <strong>{activePlan.title}</strong> · {activePlan.rooms} · {activePlan.baths}
                    </span>
                    <span className="text-[#054316] font-bold">{activePlan.type} Perspectiva</span>
                  </div>
                  <p className="text-xs text-[#41493f] mt-1 italic">{activePlan.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-[#c1c9bc]/50 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => {
                onClose();
                onSimulateInCalculator(project.id);
              }}
              type="button"
              className="bg-[#054316] hover:bg-[#235b2b] text-white py-2.5 px-5 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#86c33c]">calculate</span>
              Calcular Cuota para este Proyecto
            </button>

            <a
              href={`https://wa.me/573226374991?text=Hola,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20y%20el%20brochure%20de%20${encodeURIComponent(
                project.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#86c33c] hover:bg-[#a4d65e] text-[#054316] py-2.5 px-5 rounded font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Solicitar Brochure en WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
