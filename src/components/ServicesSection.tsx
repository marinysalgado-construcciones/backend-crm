import React, { useState } from 'react';
import { SERVICES } from '../data/projectsData';
import { Service } from '../types';
import { ServiceDetailModal } from './ServiceDetailModal';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
          Acompañamiento Integral
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
          Servicios y Asesoría Especializada
        </h2>
        <p className="text-[#6B6B54] text-sm sm:text-base mt-2.5 font-light">
          Te acompañamos desde el diagnóstico financiero inicial y la postulación a subsidios gubernamentales
          hasta la entrega de llaves y escrituración de tu vivienda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-[28px] p-7 border border-[#E5E5DF] hover:border-[#5A5A40] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] group-hover:bg-[#5A5A40] group-hover:text-white border border-[#E5E5DF] flex items-center justify-center text-[#4A4A30] mb-5 transition-all">
                <span className="material-symbols-outlined text-2xl">{service.icon}</span>
              </div>

              <h3 className="text-lg font-serif font-medium text-[#4A4A30] mb-2">{service.title}</h3>
              <p className="text-xs text-[#6B6B54] leading-relaxed mb-5 font-light">{service.shortDesc || service.shortDescription}</p>
            </div>

            <div className="pt-4 border-t border-[#E5E5DF]">
              <button
                type="button"
                onClick={() => setSelectedService(service)}
                className="w-full text-xs font-semibold text-[#C1694F] hover:text-[#A1553F] flex items-center justify-between group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>Conocer detalles y requisitos</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
};
