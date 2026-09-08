import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/projectsData';

interface HeaderProps {
  onOpenCrm?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCrm }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Propiedades', href: '#propiedades' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-[#FDFCF8]/95 backdrop-blur-md shadow-xs border-b border-[#E5E5DF]'
            : 'h-20 bg-[#FDFCF8] border-b border-[#E5E5DF]'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-11 sm:h-12 w-auto bg-white p-1.5 rounded-xl border border-[#E5E5DF] shadow-xs flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT0ilHb0kOxGLbphHwgbb4ezxKn9K_2d2ayTw0dAmLwh1WadC5h2v5s1abM1sZIanyn43getUzGxYKq8PnUqUusrfmIoHDSiP6q6Rfm-yUCQvhuvLenJ7iC3PYUnVTttgSbr7u22M9O39XL5GQgqnK7B2rXSPVyc7Jc9m5OOeGcG6hnA2u4emKVEfO8obhqc12ZIk66-HpbcjvPJMW87qNlRQ3Q_EvmoSWyh_ddt0kn4H7wSdcm3lJ_E7gZW5WKmyC"
                alt="Marin & Salgado Construcciones S.A.S."
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[#4A4A30] font-serif font-bold text-base sm:text-lg leading-tight tracking-tight">
                Marin &amp; Salgado
              </span>
              <span className="text-[#C1694F] text-[10px] font-semibold tracking-widest uppercase">
                Construcciones S.A.S.
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest font-medium text-[#6B6B54] hover:text-[#C1694F] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CRM Portal Access for Staff */}
            {onOpenCrm && (
              <button
                type="button"
                onClick={onOpenCrm}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A4A30] hover:text-[#054316] bg-[#F0EFEB] hover:bg-[#E5E5DF] rounded-full transition-colors cursor-pointer border border-[#E5E5DF]"
                title="Acceso exclusivo colaboradores: CRM & Dashboard Administrativo"
              >
                <span className="material-symbols-outlined text-[15px] text-[#054316]">lock</span>
                <span>Portal CRM</span>
              </button>
            )}

            {/* WhatsApp CTA */}
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Contacto</span>
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#4A4A30] p-1.5 hover:bg-[#F5F5F0] rounded-lg focus:outline-none"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm pt-20">
          <div className="bg-[#FDFCF8] border-b border-[#E5E5DF] p-6 space-y-4 max-h-[85vh] overflow-y-auto rounded-b-[32px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DF] text-[#4A4A30]">
              <span className="text-xs font-bold text-[#C1694F] uppercase tracking-widest">
                Navegación Principal
              </span>
              <span className="text-xs text-[#6B6B54]">Cartago, Valle</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl font-medium text-sm text-[#4A4A30] hover:bg-[#F5F5F0] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E5DF] space-y-2.5">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5A5A40] text-white hover:bg-[#4A4A30] py-2.5 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Hablar con Asesor en WhatsApp
              </a>

              {onOpenCrm && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCrm();
                  }}
                  className="w-full bg-[#F0EFEB] hover:bg-[#E5E5DF] text-[#4A4A30] py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 border border-[#E5E5DF] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#054316]">lock</span>
                  Ingreso Colaboradores (Portal CRM)
                </button>
              )}

              <div className="text-center pt-2 text-[11px] text-[#9E9E8E]">
                Cra 6 # 14-55, Cartago, Valle · Tel: {COMPANY_INFO.phoneFormatted}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
