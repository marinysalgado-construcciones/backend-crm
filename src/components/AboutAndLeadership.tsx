import React from 'react';
import { COMPANY_INFO } from '../data/projectsData';
import engineerPhoto from '../assets/images/female_engineer_portrait_1788561088413.jpg';

export const AboutAndLeadership: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-[#FDFCF8] border-t border-[#E5E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: About Text & Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
                Trayectoria &amp; Compromiso
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
                Marin &amp; Salgado Construcciones S.A.S.
              </h2>
              <p className="text-[#6B6B54] text-sm sm:text-base mt-3.5 leading-relaxed font-light">
                Somos una constructora nacida con el propósito de transformar el concepto de Vivienda de Interés Social
                (VIS) en el Norte del Valle y Eje Cafetero. Diseñamos hogares dignos, modernos y resistentes que
                garantizan un patrimonio seguro para las familias trabajadoras.
              </p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E5DF] shadow-xs">
                <div className="flex items-center gap-2 text-[#4A4A30] font-serif font-medium text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[#5A5A40] text-[20px]">architecture</span>
                  Calidad y Sismorresistencia
                </div>
                <p className="text-xs text-[#6B6B54] leading-relaxed font-light">
                  Construcción bajo la norma NSR-10 con materiales certificados e interventoría estructural permanente.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5DF] shadow-xs">
                <div className="flex items-center gap-2 text-[#4A4A30] font-serif font-medium text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[#5A5A40] text-[20px]">account_balance</span>
                  Seguridad Fiduciaria
                </div>
                <p className="text-xs text-[#6B6B54] leading-relaxed font-light">
                  Tus aportes y cuotas iniciales están resguardados por fiducia mercantil hasta el punto de equilibrio.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5DF] shadow-xs">
                <div className="flex items-center gap-2 text-[#4A4A30] font-serif font-medium text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[#5A5A40] text-[20px]">park</span>
                  Entornos Sostenibles
                </div>
                <p className="text-xs text-[#6B6B54] leading-relaxed font-light">
                  Amplias zonas verdes, senderos peatonales y diseño bioclimático con ventilación natural.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5DF] shadow-xs">
                <div className="flex items-center gap-2 text-[#4A4A30] font-serif font-medium text-sm mb-1.5">
                  <span className="material-symbols-outlined text-[#5A5A40] text-[20px]">handshake</span>
                  Acompañamiento en Subsidios
                </div>
                <p className="text-xs text-[#6B6B54] leading-relaxed font-light">
                  Gestión integral para la asignación oportuna de Mi Casa Ya, Cajas de Compensación y concurrencia.
                </p>
              </div>
            </div>

            {/* Stats Band */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#E5E5DF] text-center">
              <div>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#4A4A30] block">+10</span>
                <span className="text-xs text-[#6B6B54] font-medium">Años de Experiencia</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#4A4A30] block">100%</span>
                <span className="text-xs text-[#6B6B54] font-medium">Acompañamiento VIS</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#4A4A30] block">+400</span>
                <span className="text-xs text-[#6B6B54] font-medium">Familias Beneficiadas</span>
              </div>
            </div>
          </div>

          {/* Right: Leadership Profile Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[32px] border border-[#E5E5DF] p-7 sm:p-8 shadow-xs relative">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#E5E5DF]">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C1694F] shadow-xs shrink-0 bg-[#5A5A40]">
                  <img
                    src={engineerPhoto}
                    alt="Carolina Salgado - Gerente de Proyectos &amp; Fundadora"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-medium text-[#4A4A30]">{COMPANY_INFO.leadership.name}</h3>
                  <p className="text-xs font-semibold text-[#C1694F]">{COMPANY_INFO.leadership.role}</p>
                  <span className="text-[11px] text-[#9E9E8E]">Marin &amp; Salgado Construcciones S.A.S.</span>
                </div>
              </div>

              <p className="text-xs text-[#6B6B54] leading-relaxed mb-5 font-light italic">
                &ldquo;{COMPANY_INFO.leadership.bio}&rdquo;
              </p>

              <div className="bg-[#FDFCF8] p-4 rounded-2xl border border-[#E5E5DF] text-xs text-[#2A2A2A] space-y-2">
                <div className="flex items-center gap-2 text-[#4A4A30] font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#5A5A40]">badge</span>
                  Atención y Asesoría Personalizada
                </div>
                <div className="flex items-center gap-2 text-[#6B6B54]">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  Cra 6 # 14-55, Cartago, Valle del Cauca
                </div>
                <div className="flex items-center gap-2 text-[#6B6B54]">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {COMPANY_INFO.phoneFormatted}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E5DF]">
                <a
                  href={`https://wa.me/573226374991?text=Hola,%20deseo%20agendar%20una%20cita%20con%20el%20equipo%20de%20proyectos%20de%20Marin%20%26%20Salgado`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-3 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#C1694F]">event</span>
                  Agendar Cita en Sala de Ventas
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
