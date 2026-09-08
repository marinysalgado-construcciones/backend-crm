import React from 'react';
import { Service } from '../types';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/80 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-7 sm:p-8 shadow-2xl border border-[#E5E5DF] relative">
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal de servicio"
          className="absolute top-5 right-5 text-[#9E9E8E] hover:text-[#2A2A2A] p-1 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] border border-[#E5E5DF] flex items-center justify-center text-[#5A5A40] mb-5">
          <span className="material-symbols-outlined text-2xl">{service.icon}</span>
        </div>

        <h3 className="text-2xl font-serif font-medium text-[#4A4A30] mb-2">{service.title}</h3>
        <p className="text-sm text-[#6B6B54] font-light leading-relaxed mb-6">{service.fullDesc || service.detailedDescription}</p>

        <div className="bg-[#FDFCF8] p-5 rounded-2xl border border-[#E5E5DF] mb-6">
          <span className="text-xs font-semibold text-[#4A4A30] uppercase tracking-wider block mb-3">
            Ventajas y Entregables Clave:
          </span>
          <ul className="space-y-2 text-xs text-[#2A2A2A]">
            {(service.deliverables || service.benefits || []).map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5A5A40] text-[16px]">check_circle</span>
                <span className="font-normal">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5DF]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-[#6B6B54] hover:bg-[#F5F5F0] rounded-full transition-colors"
          >
            Cerrar
          </button>
          <a
            href={`https://wa.me/573226374991?text=Hola,%20deseo%20asesor%C3%ADa%20sobre%20el%20servicio%20de%20${encodeURIComponent(
              service.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4A4A30] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            Consultar con Asesor
          </a>
        </div>
      </div>
    </div>
  );
};
