import React, { useState } from 'react';

export const GalleryAndPlans: React.FC = () => {
  const [selectedPlanTab, setSelectedPlanTab] = useState<'saman-a' | 'saman-b' | 'alamos'>('saman-a');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const plans = {
    'saman-a': {
      title: 'Residencial El Samán · Apartamento Tipo A',
      area: '54 m²',
      rooms: '3 Habitaciones',
      baths: '2 Baños',
      type: 'Plano 3D Perspectiva',
      features: 'Sala-comedor, balcón, cocina tipo americano, zona de ropas independiente, alcoba principal con baño.',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1V_SyP-2BMzwEiJ7yhRUCie_y6GoPLlqXSkqBCflX__oRKRIYb5sldUjVOiJTQA0c-AaoJNw9mUJK_9601DJxGXOMsi5z2XQrWTMiYT7VYiXiD2OVRv2whjRfi0BQKNu8YxnX0whHLmO9Vdj082fze_R52xF4iJMNfhoCfyL9ANoXsFDKmuCHUroq-GXVx0x6pX5wXUeBTYSocRKJYdm2tVhqcL7DhatQFGWR8rv502FG1rybYttFwvmQ',
    },
    'saman-b': {
      title: 'Residencial El Samán · Apartamento Tipo B',
      area: '48 m²',
      rooms: '2 Habitaciones',
      baths: '1 Baño',
      type: 'Plano Arquitectónico 2D Técnico',
      features: 'Diseño optimizado, iluminación natural, sala-comedor continua, cocina funcional y dos alcobas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBadwx1p3hyaLMMr5Ck9hLFXVxZFxdqoqdp7iTbLn8bDmc_Ji74VEYVZnmCXdn9OzgoFyZMc8Mf_l_T8vIEEEgF96kDMeLjLl5MmjfseY7sJ6CMgiBkvdoXPyhoiY1JiyPHJbLEoQVFZ7oAgHP9ILlohYl4zbIMA4WRY4rHFFhB9_JDSYNGIbCfqT6BbTF-9TRQnBORm_1_5oFQ9IkkzYUqno0fLkz92JyjNgkNE_1-kJRXRGbh79Y',
    },
    'alamos': {
      title: 'Urbanización Los Álamos · Casa Unifamiliar',
      area: '65 m² (Hasta 78 m²)',
      rooms: '3 Habitaciones',
      baths: '2 Baños',
      type: 'Plano 3D Distribución Casa',
      features: 'Casa en 1 o 2 niveles, patio posterior para ampliación futura, parqueadero y acabados sismorresistentes.',
      image: 'https://lh3.googleusercontent.com/aida/AEtjO1V_SyP-2BMzwEiJ7yhRUCie_y6GoPLlqXSkqBCflX__oRKRIYb5sldUjVOiJTQA0c-AaoJNw9mUJK_9601DJxGXOMsi5z2XQrWTMiYT7VYiXiD2OVRv2whjRfi0BQKNu8YxnX0whHLmO9Vdj082fze_R52xF4iJMNfhoCfyL9ANoXsFDKmuCHUroq-GXVx0x6pX5wXUeBTYSocRKJYdm2tVhqcL7DhatQFGWR8rv502FG1rybYttFwvmQ',
    },
  };

  const currentPlan = plans[selectedPlanTab];

  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* 1. Floor Plans Section */}
      <div className="bg-white border border-[#E5E5DF] rounded-[32px] p-7 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
              Diseño &amp; Arquitectura VIS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
              Planos y Distribución de Espacios
            </h2>
            <p className="text-[#6B6B54] text-sm mt-2 font-light">
              Espacios pensados para el confort, ventilación cruzada bioclimática y proyección de ampliación familiar.
            </p>
          </div>

          {/* Plan Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedPlanTab('saman-a')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                selectedPlanTab === 'saman-a'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F5F5F0] text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#E5E5DF]'
              }`}
            >
              El Samán Tipo A (54m²)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlanTab('saman-b')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                selectedPlanTab === 'saman-b'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F5F5F0] text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#E5E5DF]'
              }`}
            >
              El Samán Tipo B (48m²)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlanTab('alamos')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                selectedPlanTab === 'alamos'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F5F5F0] text-[#6B6B54] border border-[#E5E5DF] hover:bg-[#E5E5DF]'
              }`}
            >
              Los Álamos Casa (65m²)
            </button>
          </div>
        </div>

        {/* Plan Display Box */}
        <div className="bg-[#FDFCF8] border border-[#E5E5DF] rounded-2xl p-4 sm:p-6 shadow-xs">
          <div
            onClick={() => setLightboxImage(currentPlan.image)}
            className="group relative max-h-[500px] overflow-hidden rounded-xl bg-white flex items-center justify-center p-4 border border-[#E5E5DF] cursor-zoom-in"
          >
            <img
              src={currentPlan.image}
              alt={currentPlan.title}
              className="max-h-[460px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
            <div className="absolute bottom-3 right-3 bg-[#4A4A30]/85 backdrop-blur-xs text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shadow-xs">
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              Clic para ampliar
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E5E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#6B6B54]">
            <div>
              <span className="font-serif font-bold text-[#4A4A30] text-lg block sm:inline mr-2">
                {currentPlan.title}
              </span>
              <span>
                Área: <strong className="text-[#4A4A30]">{currentPlan.area}</strong> · {currentPlan.rooms} · {currentPlan.baths}
              </span>
            </div>
            <span className="bg-[#F5F5F0] text-[#6B6B54] border border-[#E5E5DF] px-3.5 py-1 rounded-full font-semibold text-xs self-start sm:self-auto">
              {currentPlan.type}
            </span>
          </div>

          <p className="text-xs text-[#6B6B54] mt-2 italic font-light">{currentPlan.features}</p>
        </div>
      </div>

      {/* 2. Photo Gallery Bento Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
            Imágenes Reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
            Galería Fotográfica de Proyectos
          </h2>
          <p className="text-[#6B6B54] text-sm mt-2 font-light">
            Conoce los exteriores, acabados de casas modelo y zonas recreativas diseñadas para tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 h-auto md:h-[550px]">
          {/* Main Large Item */}
          <div
            onClick={() =>
              setLightboxImage(
                'https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg'
              )
            }
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[28px] border border-[#E5E5DF] shadow-xs cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg"
              alt="Fachada Principal Residencial El Samán"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div>
                <span className="text-white text-lg sm:text-xl font-serif font-medium block">
                  Fachada Principal y Entorno Natural
                </span>
                <span className="text-[#C1694F] text-xs font-semibold">Residencial El Samán · Cartago</span>
              </div>
            </div>
          </div>

          {/* Top Right Item */}
          <div
            onClick={() =>
              setLightboxImage(
                'https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw'
              )
            }
            className="relative group overflow-hidden rounded-[28px] border border-[#E5E5DF] shadow-xs h-60 md:h-auto cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw"
              alt="Interior Casa Modelo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="text-white text-xs sm:text-sm font-medium">Interiores Modelo Iluminados</span>
            </div>
          </div>

          {/* Bottom Right Item */}
          <div
            onClick={() =>
              setLightboxImage(
                'https://lh3.googleusercontent.com/aida/AEtjO1WJNa-Rr2H-VlTOHeDwCj3Xac21-qfxghonBmcbEUoY-pfvJO2TXLosNYooOweNzxbJITIzr73I7_VAhz-1ecSAYsPHgJ8pPBs1C64mT-IXucQA6DaONTF_ajQAmZCBzfd8hEtbl67-hqzO6ov7WIHj83Mp6P22hmWpurkg-gfrZsIOB0OUDipaYS1RfKVZz4PQ9c_jkQOFlFjq0KT83gVt86UbfYOQmj18vKUhouJKQMSQr8lyrvzSKQ'
              )
            }
            className="relative group overflow-hidden rounded-[28px] border border-[#E5E5DF] shadow-xs h-60 md:h-auto cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WJNa-Rr2H-VlTOHeDwCj3Xac21-qfxghonBmcbEUoY-pfvJO2TXLosNYooOweNzxbJITIzr73I7_VAhz-1ecSAYsPHgJ8pPBs1C64mT-IXucQA6DaONTF_ajQAmZCBzfd8hEtbl67-hqzO6ov7WIHj83Mp6P22hmWpurkg-gfrZsIOB0OUDipaYS1RfKVZz4PQ9c_jkQOFlFjq0KT83gVt86UbfYOQmj18vKUhouJKQMSQr8lyrvzSKQ"
              alt="Zonas Comunes y Recreación"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="text-white text-xs sm:text-sm font-medium">Zonas Comunes y Áreas Verdes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#2A2A2A]/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Detalle ampliado"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white font-semibold flex items-center gap-1.5 text-xs hover:text-[#C1694F] transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span> Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
