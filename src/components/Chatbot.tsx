import React, { useState, useRef, useEffect } from 'react';
import { COMPANY_INFO } from '../data/projectsData';
import marianaPhoto from '../assets/images/mariana_virtual_advisor_1788563544538.jpg';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface ChatbotProps {
  onRegisterLeadFromChat: (leadData: {
    name: string;
    phone: string;
    email?: string;
    project?: string;
    message: string;
  }) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onRegisterLeadFromChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: '¡Hola! Qué gusto saludarte, soy Mariana, asesora de Marin & Salgado Construcciones en Cartago. Estoy aquí para orientarte con toda la información de nuestros proyectos VIS (Los Álamos y El Samán), subsidios de vivienda y opciones de pago. ¿En qué puedo ayudarte hoy?',
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadProject, setLeadProject] = useState('Urbanización Los Álamos');
  const [leadSaved, setLeadSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const quickChips = [
    '¿Qué subsidios aplican?',
    'Precios de Los Álamos',
    'Apartamentos El Samán',
    '¿Cómo funciona la concurrencia?',
    'Quiero que me llamen',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!textToSend) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // If user clicked "Quiero que me llamen" or text indicates wanting to be contacted
    if (text.toLowerCase().includes('quiero que me llamen') || text.toLowerCase().includes('asesor humano') || text.toLowerCase().includes('dejar mis datos')) {
      setShowLeadForm(true);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Con gusto te oriento sobre nuestros proyectos de vivienda VIS en Cartago.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'En Marin & Salgado Construcciones te asesoramos para que apliques a Mi Casa Ya y Cajas de Compensación en nuestros proyectos de Cartago: Urbanización Los Álamos y Residencial El Samán. Si deseas atención inmediata, llámanos o escríbenos al WhatsApp 3226374991.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    onRegisterLeadFromChat({
      name: leadName,
      phone: leadPhone,
      project: leadProject,
      message: 'Contacto solicitado desde el Asistente Virtual Mariana',
    });

    setLeadSaved(true);
    setTimeout(() => {
      setShowLeadForm(false);
      setLeadSaved(false);
      setLeadName('');
      setLeadPhone('');

      const botConfirm: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `¡Listo ${leadName}! Tus datos han sido sincronizados en nuestro CRM y Google Sheets. Un asesor se comunicará al ${leadPhone} para ayudarte con ${leadProject}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botConfirm]);
    }, 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-[28px] shadow-2xl border border-[#E5E5DF] flex flex-col overflow-hidden mb-3 animate-fade-in">
          {/* Header */}
          <div className="bg-[#4A4A30] text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#C1694F] shadow-sm shrink-0 bg-[#5A5A40]">
                  <img
                    src={marianaPhoto}
                    alt="Mariana - Asesora Virtual"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="w-3 h-3 bg-[#8FA382] rounded-full border-2 border-[#4A4A30] absolute bottom-0 right-0 shadow-xs" />
              </div>
              <div>
                <span className="font-serif font-medium text-sm block leading-tight">Mariana · Asesora Virtual</span>
                <span className="text-[10px] text-white/80 flex items-center gap-1 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C1694F] animate-pulse" />
                  En línea · Orientación y Proyectos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowLeadForm(!showLeadForm)}
                title="Pedir que me contacten"
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full font-medium border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">phone_in_talk</span>
                <span className="hidden sm:inline">Contacto</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Quick Lead Capture Banner (collapsible) */}
          {showLeadForm && (
            <div className="bg-[#FDFCF8] p-4 border-b border-[#E5E5DF] text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-serif font-medium text-[#4A4A30]">Solicitar que me contacten</span>
                <button onClick={() => setShowLeadForm(false)} className="text-[#9E9E8E] hover:text-[#2A2A2A] cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {leadSaved ? (
                <div className="text-center p-2 text-[#5A5A40] font-semibold">
                  ✓ Datos recibidos, te contactaremos pronto
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Teléfono / Celular"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A]"
                    />
                    <select
                      value={leadProject}
                      onChange={(e) => setLeadProject(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A]"
                    >
                      <option value="Urbanización Los Álamos">Los Álamos</option>
                      <option value="Residencial El Samán">El Samán</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-2 rounded-full font-semibold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    Enviar Solicitud de Asesoría
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FDFCF8] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#C1694F] mt-1 bg-[#5A5A40]">
                    <img
                      src={marianaPhoto}
                      alt="Mariana"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[280px] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#5A5A40] text-white rounded-br-xs'
                        : 'bg-white border border-[#E5E5DF] text-[#2A2A2A] font-light rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9E9E8E] mt-0.5 px-1 font-light">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#C1694F] bg-[#5A5A40]">
                  <img
                    src={marianaPhoto}
                    alt="Mariana"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[#6B6B54] bg-white border border-[#E5E5DF] rounded-full px-3 py-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#4A4A30] ml-1 font-medium">Mariana escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 bg-[#F5F5F0] border-t border-[#E5E5DF] flex gap-1.5 overflow-x-auto whitespace-nowrap">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-medium bg-white hover:bg-[#FDFCF8] text-[#4A4A30] border border-[#E5E5DF] px-3 py-1 rounded-full shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E5E5DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta sobre subsidios o proyectos..."
              className="flex-1 text-xs p-2.5 bg-[#FDFCF8] border border-[#E5E5DF] rounded-full px-4 focus:outline-none focus:border-[#5A5A40] text-[#2A2A2A]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="btn-trigger-chatbot"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-[#5A5A40] hover:bg-[#4A4A30] text-white p-1 rounded-full shadow-2xl border-2 border-[#C1694F] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Abrir asistente virtual Mariana"
      >
        {isOpen ? (
          <div className="w-12 h-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-white">close</span>
          </div>
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden relative">
            <img
              src={marianaPhoto}
              alt="Mariana - Asesora Virtual"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {!isOpen && (
          <>
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1694F] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C1694F] border-2 border-white" />
            </span>

            {/* Tooltip badge */}
            <span className="hidden md:block absolute right-16 bg-[#2A2A2A] text-white text-xs font-normal py-2 px-3.5 rounded-full shadow-lg whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
              Habla con Mariana · Asesora Virtual
            </span>
          </>
        )}
      </button>
    </div>
  );
};
