import React, { useState } from 'react';
import { CRMStaffUser } from '../types';

interface CrmLoginProps {
  onLoginSuccess: (user: CRMStaffUser) => void;
  onBackToLanding: () => void;
}

export const CrmLogin: React.FC<CrmLoginProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [username, setUsername] = useState('admin@marinysalgado.com');
  const [password, setPassword] = useState('MarinySalgado2025*');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/crm/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem('ms_crm_token', data.user.token);
        localStorage.setItem('ms_crm_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Credenciales inválidas. Por favor intenta de nuevo.');
      }
    } catch (err: any) {
      setError('Error al conectar con el servidor administrativo. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#1F2421] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#C1694F] selection:text-white">
      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 hover:border-[#86c33c] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-[#86c33c]">arrow_back</span>
          <span>Volver al Sitio Web Público</span>
        </button>

        <span className="text-[11px] font-mono text-[#86c33c] bg-[#86c33c]/10 px-2.5 py-1 rounded-full border border-[#86c33c]/20">
          SSL Encriptado 256-bit
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#2B302C] border border-[#3E453F] rounded-3xl p-8 sm:p-10 shadow-2xl">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-white rounded-2xl shadow-md p-2 mb-4 border border-[#3E453F]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT0ilHb0kOxGLbphHwgbb4ezxKn9K_2d2ayTw0dAmLwh1WadC5h2v5s1abM1sZIanyn43getUzGxYKq8PnUqUusrfmIoHDSiP6q6Rfm-yUCQvhuvLenJ7iC3PYUnVTttgSbr7u22M9O39XL5GQgqnK7B2rXSPVyc7Jc9m5OOeGcG6hnA2u4emKVEfO8obhqc12ZIk66-HpbcjvPJMW87qNlRQ3Q_EvmoSWyh_ddt0kn4H7wSdcm3lJ_E7gZW5WKmyC"
              alt="Marin & Salgado"
              className="h-10 w-auto object-contain"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Portal CRM &amp; Administrativo
          </h1>
          <p className="text-xs text-[#9EAAA0] mt-1">
            Marin &amp; Salgado Construcciones S.A.S. · Cartago, Valle
          </p>
          <span className="inline-block mt-2 text-[10px] font-semibold text-[#C1694F] uppercase tracking-widest bg-[#C1694F]/10 px-3 py-1 rounded-full border border-[#C1694F]/30">
            Acceso Exclusivo para Colaboradores
          </span>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-900/40 border border-rose-600/50 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-rose-400 text-[18px] shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#E1E7E2] uppercase tracking-wider mb-1.5">
              Usuario o Correo Institucional
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#9EAAA0] material-symbols-outlined text-[18px]">
                badge
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@marinysalgado.com"
                className="w-full bg-[#1F2421] border border-[#3E453F] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-[#5E6760] focus:border-[#86c33c] focus:outline-none focus:ring-1 focus:ring-[#86c33c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E1E7E2] uppercase tracking-wider mb-1.5">
              Contraseña de Seguridad
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#9EAAA0] material-symbols-outlined text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1F2421] border border-[#3E453F] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-[#5E6760] focus:border-[#86c33c] focus:outline-none focus:ring-1 focus:ring-[#86c33c]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#9EAAA0] hover:text-white cursor-pointer"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#86c33c] hover:bg-[#97d64d] text-[#132A13] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Ingresar al Sistema CRM</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-[#3E453F]/60">
          <p className="text-[11px] font-semibold text-[#B2BDB5] uppercase tracking-wider text-center mb-3">
            Credenciales de Acceso Autorizado:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleFillCredentials('admin@marinysalgado.com', 'MarinySalgado2025*')}
              className="p-2 bg-[#1F2421] hover:bg-[#1A1F1C] border border-[#3E453F] rounded-lg text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <strong className="text-white group-hover:text-[#86c33c]">Gerencia (Admin)</strong>
                <span className="text-[9px] text-[#86c33c]">Auto-completar</span>
              </div>
              <span className="text-[#8E9B91] block truncate">admin@marinysalgado.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('comercial@marinysalgado.com', 'CartagoVIS2025!')}
              className="p-2 bg-[#1F2421] hover:bg-[#1A1F1C] border border-[#3E453F] rounded-lg text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <strong className="text-white group-hover:text-[#86c33c]">Asesor Comercial</strong>
                <span className="text-[9px] text-[#86c33c]">Auto-completar</span>
              </div>
              <span className="text-[#8E9B91] block truncate">comercial@marinysalgado.com</span>
            </button>
          </div>
        </div>

        {/* Security footnote */}
        <div className="mt-6 text-center text-[10px] text-[#717E73]">
          Protección de rutas activa. Cualquier intento de acceso no autorizado queda registrado con dirección IP y marca de tiempo.
        </div>

        {/* Bottom Return Link */}
        <div className="mt-4 pt-4 border-t border-[#3E453F]/60 text-center">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs text-[#86c33c] hover:text-[#9de04c] font-semibold hover:underline transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Regresar a la página web principal de Marín &amp; Salgado</span>
          </button>
        </div>
      </div>
    </div>
  );
};
