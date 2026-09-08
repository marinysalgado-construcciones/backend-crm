import React from 'react';
import { COMPANY_INFO } from '../data/projectsData';

export const LocationSection: React.FC = () => {
  const points = [
    { name: 'Centro Comercial Nuestro Cartago', time: '8 minutos', icon: 'shopping_bag' },
    { name: 'Hospital San Juan de Dios', time: '10 minutos', icon: 'local_hospital' },
    { name: 'Ruta Rápida Cartago - Pereira', time: '25 minutos', icon: 'directions_car' },
    { name: 'Parque de Bolívar & Centro Histórico', time: '6 minutos', icon: 'account_balance' },
    { name: 'Instituciones Educativas y Colegios', time: '5 minutos', icon: 'school' },
    { name: 'Rutas de Transporte Público Urbano', time: 'Inmediato (frente)', icon: 'directions_bus' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
          Ubicación Estratégica
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
          Cartago, Valle: Conectividad y Alta Valorización
        </h2>
        <p className="text-[#6B6B54] text-sm sm:text-base mt-2.5 font-light">
          Nuestros proyectos cuentan con accesos viales directos, cercanía a centros comerciales, servicios de salud y
          transporte público garantizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* POI List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] border border-[#E5E5DF] p-7 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-medium text-[#4A4A30] mb-1.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C1694F]">pin_drop</span>
              Puntos de Interés Cercanos
            </h3>
            <p className="text-xs text-[#6B6B54] mb-5 font-light">
              Tiempos aproximados desde Residencial El Samán y Urbanización Los Álamos:
            </p>

            <div className="space-y-2.5">
              {points.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#FDFCF8] rounded-xl border border-[#E5E5DF] text-xs"
                >
                  <div className="flex items-center gap-2.5 text-[#2A2A2A] font-medium">
                    <span className="material-symbols-outlined text-[#5A5A40] text-[18px]">{p.icon}</span>
                    <span>{p.name}</span>
                  </div>
                  <span className="font-semibold text-[#4A4A30] bg-[#F5F5F0] border border-[#E5E5DF] px-3 py-1 rounded-full text-[11px] shrink-0">
                    {p.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#E5E5DF]">
            <div className="text-xs text-[#6B6B54] space-y-1.5 font-light">
              <p>
                <strong className="font-medium text-[#4A4A30]">Oficina Principal y Sala de Ventas:</strong> {COMPANY_INFO.address}, Cartago, Valle del Cauca.
              </p>
              <p>
                <strong className="font-medium text-[#4A4A30]">Horario de atención:</strong> Lunes a Sábado de 8:00 a.m. a 5:30 p.m. Domingos con cita previa.
              </p>
            </div>
          </div>
        </div>

        {/* Map Container (7 cols) */}
        <div className="lg:col-span-7 rounded-[32px] overflow-hidden border border-[#E5E5DF] shadow-xs relative min-h-[350px]">
          <iframe
            title="Mapa Cartago Valle del Cauca - Marin & Salgado Construcciones"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.2483827618485!2d-75.91893262413158!3d4.744314441434311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e387192f15951cb%3A0x6b29f045ceaa11b8!2sCra.%206%20%2314-55%2C%20Cartago%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '380px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          <div className="absolute top-4 left-4 bg-[#4A4A30]/90 backdrop-blur-xs text-white text-xs px-4 py-2 rounded-full shadow-xs flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#C1694F]">apartment</span>
            Proyectos en Cartago, Valle del Cauca
          </div>
        </div>
      </div>
    </section>
  );
};
