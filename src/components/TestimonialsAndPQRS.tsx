import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/projectsData';

interface TestimonialsAndPQRSProps {
  onSubmitPqrs: (data: {
    type: string;
    name: string;
    phone: string;
    email: string;
    project: string;
    message: string;
  }) => Promise<{ radicadoCode?: string }>;
}

export const TestimonialsAndPQRS: React.FC<TestimonialsAndPQRSProps> = ({ onSubmitPqrs }) => {
  const [pqrsType, setPqrsType] = useState('Petición');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('Residencial El Samán');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [radicado, setRadicado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setLoading(true);
    try {
      const res = await onSubmitPqrs({
        type: pqrsType,
        name,
        phone,
        email,
        project,
        message,
      });

      if (res?.radicadoCode) {
        setRadicado(res.radicadoCode);
      } else {
        setRadicado(`PQRS-${Math.floor(100000 + Math.random() * 900000)}`);
      }
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting PQRS', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#FDFCF8] border-t border-[#E5E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Testimonials */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
              Historias Reales
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
              Familias que Cumplieron su Sueño
            </h2>
            <p className="text-[#6B6B54] text-sm mt-2.5 font-light">
              Conoce las experiencias de quienes ya aseguraron su vivienda propia con Marin &amp; Salgado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-7 border border-[#E5E5DF] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C1694F] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-serif italic text-[#4A4A30] leading-relaxed mb-6 font-light">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E5DF] flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E5E5DF]"
                  />
                  <div>
                    <span className="text-sm font-serif font-medium text-[#4A4A30] block">{t.name}</span>
                    <span className="text-[11px] text-[#9E9E8E]">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PQRS Channel (Portal Oficial de Atención al Usuario) */}
        <div className="bg-white rounded-[32px] border border-[#E5E5DF] p-7 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
              Atención al Ciudadano &amp; Peticiones
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#4A4A30]">
              Canal Oficial de PQRS (Peticiones, Quejas, Reclamos y Sugerencias)
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B54] mt-2 font-light leading-relaxed">
              Radica tus solicitudes formales. Cada solicitud genera un número de radicado y se almacena en nuestro CRM
              de Google Sheets para seguimiento oportuno según los términos de ley.
            </p>
          </div>

          {radicado ? (
            <div className="p-8 bg-[#F5F5F0] border border-[#5A5A40]/30 rounded-2xl text-center space-y-4">
              <span className="material-symbols-outlined text-5xl text-[#5A5A40]">mark_email_read</span>
              <h4 className="text-xl font-serif font-medium text-[#4A4A30]">¡PQRS Radicada con Éxito!</h4>
              <div className="inline-block bg-[#5A5A40] text-white font-mono font-bold text-sm px-5 py-2.5 rounded-full shadow-xs">
                Número de Radicado: {radicado}
              </div>
              <p className="text-xs text-[#6B6B54] font-light max-w-lg mx-auto leading-relaxed">
                Hemos notificado a nuestro equipo de atención y guardado la solicitud en el CRM de Google Sheets.
                Responderemos a tu número de contacto dentro de los 15 días hábiles establecidos por ley.
              </p>
              <button
                type="button"
                onClick={() => setRadicado(null)}
                className="mt-2 text-xs font-semibold text-[#C1694F] hover:text-[#A1553F] underline cursor-pointer"
              >
                Radicar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Tipo de Solicitud *</label>
                <select
                  value={pqrsType}
                  onChange={(e) => setPqrsType(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl font-medium text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="Petición">Petición (Derecho de petición / información)</option>
                  <option value="Queja">Queja (Inconformidad con la atención)</option>
                  <option value="Reclamo">Reclamo (Garantía de obra o postventa)</option>
                  <option value="Sugerencia">Sugerencia o Felicitación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellidos"
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Teléfono o Celular *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. 3151234567"
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Proyecto Relacionado</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl font-medium text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="Residencial El Samán">Residencial El Samán</option>
                  <option value="Urbanización Los Álamos">Urbanización Los Álamos</option>
                  <option value="Administración General">Administración General / Sala de Ventas</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Descripción de la Solicitud *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe claramente los detalles de tu petición, reclamo o sugerencia..."
                  className="w-full text-xs p-3 bg-[#FDFCF8] border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-7 py-3 rounded-full font-semibold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {loading ? (
                    'Radicando...'
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      Enviar y Generar Radicado PQRS
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
