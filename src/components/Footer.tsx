import React from 'react';
import { COMPANY_INFO } from '../data/projectsData';

interface FooterProps {
  onOpenCrm?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrm }) => {
  return (
    <footer className="bg-[#2A2A2A] text-white border-t border-[#4A4A30] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-auto bg-white/10 p-1.5 rounded-xl border border-white/10 flex items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT0ilHb0kOxGLbphHwgbb4ezxKn9K_2d2ayTw0dAmLwh1WadC5h2v5s1abM1sZIanyn43getUzGxYKq8PnUqUusrfmIoHDSiP6q6Rfm-yUCQvhuvLenJ7iC3PYUnVTttgSbr7u22M9O39XL5GQgqnK7B2rXSPVyc7Jc9m5OOeGcG6hnA2u4emKVEfO8obhqc12ZIk66-HpbcjvPJMW87qNlRQ3Q_EvmoSWyh_ddt0kn4H7wSdcm3lJ_E7gZW5WKmyC"
                  alt="Marin & Salgado Construcciones S.A.S."
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-medium text-lg block text-white leading-tight">Marin &amp; Salgado</span>
                <span className="text-[#C1694F] text-xs font-semibold uppercase tracking-wider">
                  Construcciones S.A.S.
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 font-light leading-relaxed max-w-sm">
              Constructora líder en Viviendas de Interés Social (VIS) estilo premium en Cartago y el Norte del Valle del
              Cauca. Hogares con diseño bioclimático, altos estándares constructivos y respaldo fiduciario.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5 text-xs">
            <span className="text-xs font-semibold text-[#C1694F] uppercase tracking-wider block">
              Navegación Rápida
            </span>
            <ul className="space-y-2.5 font-light">
              <li>
                <a href="#proyectos" className="text-white/70 hover:text-white transition-colors">
                  Proyectos Disponibles (Los Álamos &amp; El Samán)
                </a>
              </li>
              <li>
                <a href="#calculadora" className="text-white/70 hover:text-white transition-colors font-medium text-white">
                  Calculadora Interactiva VIS &amp; Subsidios
                </a>
              </li>
              <li>
                <a href="#planos" className="text-white/70 hover:text-white transition-colors">
                  Planos 2D y 3D de Distribución
                </a>
              </li>
              <li>
                <a href="#avance" className="text-white/70 hover:text-white transition-colors">
                  Avance de Obra en Tiempo Real
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-white/70 hover:text-white transition-colors">
                  Servicios y Gestión de Créditos
                </a>
              </li>
              <li>
                <a href="#nosotros" className="text-white/70 hover:text-white transition-colors">
                  Sobre Marin &amp; Salgado
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5 text-xs">
            <span className="text-xs font-semibold text-[#C1694F] uppercase tracking-wider block">
              Contacto y Sala de Ventas
            </span>

            <ul className="space-y-2.5 text-white/70 font-light">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#C1694F] shrink-0 mt-0.5">location_on</span>
                <span>{COMPANY_INFO.address}, Cartago, Valle del Cauca, Colombia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#C1694F] shrink-0">call</span>
                <span>Línea Telefónica &amp; WhatsApp: {COMPANY_INFO.phoneFormatted}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#C1694F] shrink-0">mail</span>
                <span className="break-all">{COMPANY_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#C1694F] shrink-0 mt-0.5">schedule</span>
                <span>Lunes a Sábado: 8:00 a.m. a 5:30 p.m. · Domingos y festivos con cita previa.</span>
              </li>
            </ul>

            <div className="pt-3 flex items-center gap-3">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                WhatsApp Oficial
              </a>
              <a
                href="#contacto"
                className="text-white/70 hover:text-white underline text-xs font-light"
              >
                Canal Oficial PQRS
              </a>
              {onOpenCrm && (
                <button
                  type="button"
                  onClick={onOpenCrm}
                  className="text-xs text-[#86c33c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Portal CRM Colaboradores</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="pt-8 space-y-4 text-[11px] text-white/50 leading-relaxed font-light">
          <p>
            * Proyectos de Vivienda de Interés Social (VIS) sujetos a disponibilidad de inventario y a la asignación de
            subsidios gubernamentales (Mi Casa Ya) por parte del Ministerio de Vivienda, Ciudad y Territorio, y Cajas de
            Compensación Familiar autorizadas en Colombia. Los cálculos de la calculadora son de carácter informativo y
            estimativo. Los acabados, planos e imágenes renderizadas son representaciones artísticas del proyecto y
            pueden presentar ajustes técnicos aprobados por la Curaduría Urbana de Cartago.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t border-white/10 text-white/40">
            <span>
              &copy; {new Date().getFullYear()} Marin &amp; Salgado Construcciones S.A.S. Todos los derechos reservados.
            </span>
            <span>Cartago, Valle del Cauca, Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
