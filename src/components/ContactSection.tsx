import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/projectsData';

interface ContactSectionProps {
  onSubmitLead: (data: {
    name: string;
    phone: string;
    email: string;
    project: string;
    message: string;
    subsidyStatus?: string;
  }) => Promise<boolean>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitLead }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('Urbanización Los Álamos');
  const [subsidyStatus, setSubsidyStatus] = useState('Tengo Sisbén y Caja de Compensación');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSubmitting(true);
    try {
      const ok = await onSubmitLead({
        name,
        phone,
        email,
        project,
        message: `${message} [Estado Subsidio: ${subsidyStatus}]`,
        subsidyStatus,
      });

      if (ok) {
        setSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c1c9bc] p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-[#3f6900] font-bold text-xs uppercase tracking-widest block mb-1">
              Hablemos de tu Futuro Hogar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#054316]">
              Solicita Asesoría Personalizada
            </h2>
            <p className="text-xs sm:text-sm text-[#41493f] mt-1">
              Diligencia este formulario para que un asesor te contacte. Tu solicitud se registra automáticamente en
              nuestro CRM y hoja de Google Sheets para darte respuesta inmediata.
            </p>
          </div>

          {success ? (
            <div className="p-6 bg-[#b4f2b3]/40 border border-[#86c33c] rounded-lg text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#3f6900]">task_alt</span>
              <h4 className="text-base font-bold text-[#054316]">¡Información Recibida con Éxito!</h4>
              <p className="text-xs text-[#41493f]">
                Tus datos han sido ingresados al CRM. En breve nos comunicaremos contigo vía WhatsApp o llamada
                telefónica para brindarte todos los detalles.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#054316] mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. María Fernanda Morales"
                    className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded focus:border-[#054316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#054316] mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 3123456789"
                    className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded focus:border-[#054316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#054316] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded focus:border-[#054316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#054316] mb-1">Proyecto de Interés</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded font-medium text-[#191c18]"
                  >
                    <option value="Urbanización Los Álamos">Urbanización Los Álamos (Casas VIS)</option>
                    <option value="Residencial El Samán">Residencial El Samán (Apartamentos VIS)</option>
                    <option value="Asesoría General en Subsidios">Asesoría General en Subsidios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#054316] mb-1">
                  ¿Cuentas con Sisbén o Caja de Compensación?
                </label>
                <select
                  value={subsidyStatus}
                  onChange={(e) => setSubsidyStatus(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded font-medium text-[#191c18]"
                >
                  <option value="Tengo Sisbén y Caja de Compensación">Sí, tengo Sisbén IV y Caja de Compensación</option>
                  <option value="Solo Caja de Compensación">Solo Caja de Compensación (Comfamiliar, Comfandi, etc.)</option>
                  <option value="Solo Sisbén">Solo Sisbén IV (Grupos A, B o C)</option>
                  <option value="No sé aún / Necesito orientación">No sé aún, requiero asesoría para postularme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#054316] mb-1">Mensaje o Consulta Específica</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe si deseas agendar visita a la casa modelo, conocer planes de pago o cupos de subsidio..."
                  className="w-full text-xs p-2.5 bg-[#f8faf3] border border-[#c1c9bc] rounded focus:border-[#054316]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-[#41493f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#3f6900] text-[16px]">sync</span>
                  Conexión directa con CRM &amp; Google Sheets
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#054316] hover:bg-[#235b2b] text-white px-7 py-3 rounded font-bold text-xs tracking-wide uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Corporate Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#054316] text-white rounded-xl p-6 sm:p-7 shadow-md border border-[#235b2b]">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#86c33c]">contact_support</span>
              Atención Directa
            </h3>
            <p className="text-xs text-white/80 mb-6">
              Visítanos en nuestra sala de ventas o escríbenos directamente a través de nuestros canales oficiales.
            </p>

            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#86c33c] text-xl shrink-0 mt-0.5">location_on</span>
                <div>
                  <strong className="block text-white">Oficina y Sala de Ventas:</strong>
                  <span className="text-white/80">{COMPANY_INFO.address}, Cartago, Valle del Cauca</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#86c33c] text-xl shrink-0 mt-0.5">call</span>
                <div>
                  <strong className="block text-white">Línea Telefónica &amp; WhatsApp:</strong>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-white/80 hover:text-[#86c33c] underline">
                    {COMPANY_INFO.phoneFormatted}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#86c33c] text-xl shrink-0 mt-0.5">mail</span>
                <div>
                  <strong className="block text-white">Correo Electrónico Oficial:</strong>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-white/80 hover:text-[#86c33c] underline break-all">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#86c33c] text-xl shrink-0 mt-0.5">schedule</span>
                <div>
                  <strong className="block text-white">Horarios de Atención:</strong>
                  <span className="text-white/80">Lunes a Sábado: 8:00 a.m. - 5:30 p.m.</span>
                  <span className="block text-white/60">Domingos y festivos con cita previa</span>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-white/15">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#86c33c] hover:bg-[#a4d65e] text-[#054316] font-bold py-3 px-4 rounded text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Chatear con un Asesor en WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
