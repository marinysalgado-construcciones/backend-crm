import React, { useState } from 'react';

interface HeroProps {
  onFilterChange: (filters: { zone: string; type: string; budget: string }) => void;
  onResetFilter: () => void;
  selectedZone: string;
  selectedType: string;
  selectedBudget: string;
}

export const Hero: React.FC<HeroProps> = ({
  onFilterChange,
  onResetFilter,
  selectedZone,
  selectedType,
  selectedBudget,
}) => {
  const [zone, setZone] = useState(selectedZone);
  const [type, setType] = useState(selectedType);
  const [budget, setBudget] = useState(selectedBudget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ zone, type, budget });
    const target = document.getElementById('propiedades') || document.getElementById('proyectos');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setZone('all');
    setType('all');
    setBudget('all');
    onResetFilter();
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcUZzoQjjzLxax2K-5563dJWmdWet2zwLLENXiZJAWrwQJP79z3-RgBGex3RRdk9pR3Pzh6ke7BrvuJSkwt9ZUMtwWbac0waVkTFPjJZgmVAA91979IaL5gHFeoI2zcZiCnvncELe_lS0nUvhWUw8g3gWToD3lNDtqbK_OdTZB-1rSIrGKW_529TfXyp4s1rTlqxHfBZGvXcWJ2qK0i2X1tlm4BwSwOVrgw_BCNZlD6KfPJBV6BusKr8RF012px31"
          alt="Proyectos de Vivienda VIS Cartago"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/70 to-[#000000]/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Headline */}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight max-w-3xl leading-[1.15] mb-4 drop-shadow-md">
          Tu próximo hogar comienza aquí
        </h1>

        {/* Subtitle */}
        <p className="text-[#F5F5F0]/90 text-sm sm:text-base md:text-lg max-w-2xl mb-6 leading-relaxed font-light drop-shadow">
          Desarrollamos proyectos de vivienda con diseño bioclimático superior,
          amplias zonas verdes y facilidades de pago en Cartago.
        </p>

        {/* Search & Filter - Compact & Semi-transparent */}
        <div className="w-full max-w-3xl bg-white/45 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl border border-white/40 text-left">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/30">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2A2A2A] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#C1694F]">sell</span>
              Propiedades en Venta
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#4A4A30] hidden sm:inline font-medium">
              Cartago, Valle del Cauca
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-2.5 items-end">
            {/* 1. Ubicación */}
            <div className="lg:col-span-3">
              <label htmlFor="hero-filter-zone" className="block text-[10px] font-bold text-[#2A2A2A] mb-1 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#5A5A40]">location_on</span>
                Ubicación
              </label>
              <select
                id="hero-filter-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 bg-white/75 backdrop-blur-sm border border-white/60 rounded-xl text-xs text-[#2A2A2A] font-medium focus:border-[#5A5A40] focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">Todas las ubicaciones</option>
                <option value="norte">Cartago - Sector Norte</option>
                <option value="zaragoza">Cartago - Vía Zaragoza</option>
              </select>
            </div>

            {/* 2. Tipo de inmueble */}
            <div className="lg:col-span-3">
              <label htmlFor="hero-filter-type" className="block text-[10px] font-bold text-[#2A2A2A] mb-1 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#5A5A40]">home</span>
                Tipo de inmueble
              </label>
              <select
                id="hero-filter-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-white/75 backdrop-blur-sm border border-white/60 rounded-xl text-xs text-[#2A2A2A] font-medium focus:border-[#5A5A40] focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">Todos los inmuebles</option>
                <option value="casa">Casas en Venta</option>
                <option value="apartamento">Apartamentos</option>
                <option value="lote">Lotes / Terrenos</option>
              </select>
            </div>

            {/* 3. Presupuesto */}
            <div className="lg:col-span-3">
              <label htmlFor="hero-filter-budget" className="block text-[10px] font-bold text-[#2A2A2A] mb-1 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#5A5A40]">payments</span>
                Presupuesto
              </label>
              <select
                id="hero-filter-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 bg-white/75 backdrop-blur-sm border border-white/60 rounded-xl text-xs text-[#2A2A2A] font-medium focus:border-[#5A5A40] focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">Cualquier presupuesto</option>
                <option value="hasta180">Hasta $180M COP</option>
                <option value="hasta250">Hasta $250M COP</option>
                <option value="mas250">Más de $250M COP</option>
              </select>
            </div>

            {/* Botones de acción */}
            <div className="lg:col-span-3 flex gap-1.5">
              <button
                type="submit"
                id="btn-search-hero"
                className="flex-1 bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold py-2 px-3 rounded-full text-xs tracking-wider uppercase flex items-center justify-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">search</span>
                Buscar
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Restablecer búsqueda"
                className="bg-white/60 hover:bg-white/90 text-[#4A4A30] px-2.5 py-2 rounded-full transition-colors flex items-center justify-center cursor-pointer border border-white/40"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
