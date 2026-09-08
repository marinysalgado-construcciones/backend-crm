import React, { useState, useMemo } from 'react';
import { CalculatorInput } from '../types';
import { calculateVisMortgage, formatCOP } from '../utils/calculatorEngine';
import { generateSimulationPdf } from '../utils/generateSimulationPdf';
import { PROJECTS, COMPANY_INFO } from '../data/projectsData';

interface VisCalculatorProps {
  selectedProjectId?: string;
  onSaveLeadFromCalculator: (data: {
    name: string;
    phone: string;
    email: string;
    project: string;
    simulation: any;
  }) => void;
}

export const VisCalculator: React.FC<VisCalculatorProps> = ({
  selectedProjectId,
  onSaveLeadFromCalculator,
}) => {
  const [projectId, setProjectId] = useState<string>(selectedProjectId || 'urbanizacion-los-alamos');
  const [customPrice, setCustomPrice] = useState<number>(195750000);
  const [householdIncome, setHouseholdIncome] = useState<number>(2); // 2 SMMLV
  const [hasCaja, setHasCaja] = useState<boolean>(true);
  const [sisbenCategory, setSisbenCategory] = useState<'A1_C8' | 'C9_D20' | 'none'>('A1_C8');
  const [useConcurrencia, setUseConcurrencia] = useState<boolean>(true);
  const [savings, setSavings] = useState<number>(10000000); // 10M COP
  const [loanTerm, setLoanTerm] = useState<number>(20); // 20 years
  const [interestRate, setInterestRate] = useState<number>(11.5); // 11.5% EA
  const [applyFrech, setApplyFrech] = useState<boolean>(true);

  // Download feedback state
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Modal for personalizing and capturing lead
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const calcInput: CalculatorInput = useMemo(
    () => ({
      projectId,
      customPriceCOP: customPrice,
      householdIncomeSMMLV: householdIncome,
      hasCompensacionBox: hasCaja,
      sisbenCategory,
      useConcurrencia,
      downPaymentSavings: savings,
      loanTermYears: loanTerm,
      annualInterestRate: interestRate,
      applyFrechRateSubsidy: applyFrech,
    }),
    [projectId, customPrice, householdIncome, hasCaja, sisbenCategory, useConcurrencia, savings, loanTerm, interestRate, applyFrech]
  );

  const results = useMemo(() => calculateVisMortgage(calcInput), [calcInput]);

  const selectedProjectObj = PROJECTS.find((p) => p.id === projectId);
  const currentProjectName = selectedProjectObj ? selectedProjectObj.name : 'Vivienda VIS Personalizada';

  const handleProjectSelect = (id: string) => {
    setProjectId(id);
    const p = PROJECTS.find((item) => item.id === id);
    if (p) {
      setCustomPrice(p.priceCOP);
    }
  };

  const handleSendWhatsapp = () => {
    const text = `Hola Marin & Salgado, realicé una simulación en su calculadora web:%0A` +
      `*Proyecto:* ${currentProjectName}%0A` +
      `*Valor Vivienda:* ${formatCOP(results.totalHousePrice)}%0A` +
      `*Subsidios Estimados:* ${formatCOP(results.totalSubsidies)}%0A` +
      `*Monto a Financiar:* ${formatCOP(results.loanAmount)} (${loanTerm} años a ${interestRate}% EA)%0A` +
      `*Cuota Mensual Estimada:* ${formatCOP(applyFrech ? results.monthlyPaymentSubsidized : results.monthlyPaymentStandard)}%0A` +
      `Deseo asesoría para postularme a subsidios y separar mi vivienda.`;
    window.open(`https://wa.me/573226374991?text=${text}`, '_blank');
  };

  // Immediate PDF Generation and Download to User's computer
  const handleDownloadPdf = (nameOverride?: string, phoneOverride?: string) => {
    try {
      generateSimulationPdf({
        projectName: currentProjectName,
        projectType: selectedProjectObj ? selectedProjectObj.typeName : 'Vivienda VIS',
        projectLocation: selectedProjectObj ? selectedProjectObj.location : 'Cartago, Valle del Cauca',
        priceSMMLV: selectedProjectObj ? selectedProjectObj.priceSMMLV : 135,
        totalPriceCOP: results.totalHousePrice,
        householdIncomeSMMLV: householdIncome,
        hasCaja,
        sisbenCategory,
        useConcurrencia,
        savingsCOP: savings,
        loanTermYears: loanTerm,
        interestRateEA: interestRate,
        applyFrech,
        results,
        clientName: nameOverride || clientName || undefined,
        clientPhone: phoneOverride || clientPhone || undefined,
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch (err) {
      console.error('Error generando PDF:', err);
    }
  };

  const handleSaveLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    onSaveLeadFromCalculator({
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      project: currentProjectName,
      simulation: {
        totalHousePrice: results.totalHousePrice,
        totalSubsidies: results.totalSubsidies,
        loanAmount: results.loanAmount,
        monthlyPayment: applyFrech ? results.monthlyPaymentSubsidized : results.monthlyPaymentStandard,
        termYears: loanTerm,
      },
    });

    // Also download personalized PDF directly
    handleDownloadPdf(clientName, clientPhone);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSaveModal(false);
    }, 2500);
  };

  // Percentage calculations for graphical distribution bar
  const pctSubsidies = Math.min(100, Math.round((results.totalSubsidies / results.totalHousePrice) * 100));
  const pctSavings = Math.min(100, Math.round((savings / results.totalHousePrice) * 100));
  const pctLoan = Math.max(0, 100 - pctSubsidies - pctSavings);

  return (
    <section id="calculadora" className="py-20 bg-[#FDFCF8] border-y border-[#E5E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#C1694F] font-semibold text-xs uppercase tracking-widest block mb-2">
            Simulador Financiero VIS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#4A4A30]">
            Calculadora de Precio, Subsidios y Cuota
          </h2>
          <p className="text-[#6B6B54] text-sm sm:text-base mt-2.5 leading-relaxed font-light">
            Calcula en segundos tu cuota mensual estimada según las tasas de interés actuales de Colombia y los
            subsidios de Mi Casa Ya y Cajas de Compensación familiar.
          </p>
        </div>

        {/* Main Grid: Inputs Left, Live Results Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-[#E5E5DF] shadow-xs space-y-6">
            {/* Step 1: Selecciona Proyecto */}
            <div>
              <label className="block text-xs font-bold text-[#4A4A30] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A5A40] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Selecciona tu Proyecto o Inmueble VIS:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECTS.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleProjectSelect(proj.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      projectId === proj.id
                        ? 'border-[#5A5A40] bg-[#F5F5F0] ring-1 ring-[#5A5A40] shadow-xs'
                        : 'border-[#E5E5DF] hover:bg-[#FDFCF8]'
                    }`}
                  >
                    <div className="font-serif font-semibold text-sm text-[#4A4A30]">{proj.name}</div>
                    <div className="text-[11px] text-[#6B6B54] mt-0.5">{proj.typeName} ({proj.areaMin} m²)</div>
                    <div className="text-xs font-bold text-[#C1694F] mt-1.5">{formatCOP(proj.priceCOP)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Ingresos y Subsidios */}
            <div className="pt-5 border-t border-[#E5E5DF] space-y-4">
              <label className="block text-xs font-bold text-[#4A4A30] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A5A40] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Ingresos Familiares y Subsidios Aplicables:
              </label>

              {/* Rango de ingresos */}
              <div className="bg-[#FDFCF8] p-4 rounded-2xl border border-[#E5E5DF]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-[#4A4A30]">Ingresos Mensuales del Hogar:</span>
                  <span className="text-xs font-bold text-[#C1694F]">
                    {householdIncome} SMMLV (~{formatCOP(householdIncome * 1450000)})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHouseholdIncome(1.5)}
                    className={`py-2 px-2 text-[11px] rounded-xl font-medium border text-center transition-colors cursor-pointer ${
                      householdIncome <= 2
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#6B6B54] border-[#E5E5DF] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    Hasta 2 SMMLV (Máx)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHouseholdIncome(3)}
                    className={`py-2 px-2 text-[11px] rounded-xl font-medium border text-center transition-colors cursor-pointer ${
                      householdIncome > 2 && householdIncome <= 4
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#6B6B54] border-[#E5E5DF] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    2 a 4 SMMLV
                  </button>
                  <button
                    type="button"
                    onClick={() => setHouseholdIncome(5)}
                    className={`py-2 px-2 text-[11px] rounded-xl font-medium border text-center transition-colors cursor-pointer ${
                      householdIncome > 4
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#6B6B54] border-[#E5E5DF] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    Más de 4 SMMLV
                  </button>
                </div>
              </div>

              {/* Mi Casa Ya (Sisben) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E5E5DF]">
                  <span className="block text-[11px] font-bold text-[#4A4A30] mb-1.5 uppercase tracking-wider">Sisbén IV (Mi Casa Ya):</span>
                  <select
                    value={sisbenCategory}
                    onChange={(e) => setSisbenCategory(e.target.value as any)}
                    className="w-full text-xs p-2 bg-white border border-[#E5E5DF] rounded-xl font-medium text-[#2A2A2A] focus:border-[#5A5A40]"
                  >
                    <option value="A1_C8">Grupo A1 a C8 (Subsidio 30 SMMLV)</option>
                    <option value="C9_D20">Grupo C9 a D20 (Subsidio 20 SMMLV)</option>
                    <option value="none">No tengo Sisbén / No aplico</option>
                  </select>
                </div>

                {/* Caja de Compensación */}
                <div className="bg-[#FDFCF8] p-3.5 rounded-2xl border border-[#E5E5DF] flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#4A4A30] uppercase tracking-wider">¿Caja de Compensación?</span>
                    <input
                      type="checkbox"
                      checked={hasCaja}
                      onChange={(e) => setHasCaja(e.target.checked)}
                      className="w-4 h-4 accent-[#5A5A40] rounded border-[#E5E5DF] cursor-pointer"
                    />
                  </div>
                  <span className="text-[11px] text-[#6B6B54] mt-1">
                    Comfamiliar, Comfandi, Comfenalco (Aporte hasta 30 SMMLV)
                  </span>
                </div>
              </div>

              {/* Concurrencia de Subsidios */}
              {hasCaja && sisbenCategory !== 'none' && householdIncome <= 2 && (
                <div className="bg-[#F5F5F0] border border-[#E5E5DF] p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#C1694F] text-xl">stars</span>
                    <div>
                      <span className="text-xs font-bold text-[#4A4A30] block">
                        ¡Aplica a Concurrencia de Subsidios!
                      </span>
                      <span className="text-[11px] text-[#6B6B54]">
                        Puedes sumar Mi Casa Ya + Caja hasta 50 SMMLV ($72.500.000 COP)
                      </span>
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#C1694F]">
                    <input
                      type="checkbox"
                      checked={useConcurrencia}
                      onChange={(e) => setUseConcurrencia(e.target.checked)}
                      className="w-4 h-4 accent-[#C1694F] rounded"
                    />
                    Sumar
                  </label>
                </div>
              )}
            </div>

            {/* Step 3: Ahorros y Condiciones del Crédito */}
            <div className="pt-5 border-t border-[#E5E5DF] space-y-4">
              <label className="block text-xs font-bold text-[#4A4A30] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#5A5A40] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Ahorros, Plazo y Tasa Hipotecaria:
              </label>

              {/* Ahorros / Cesantías */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-[#6B6B54]">Ahorros Previos o Cesantías Disponibles:</span>
                  <span className="font-bold text-[#4A4A30]">{formatCOP(savings)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#9E9E8E]">
                  <span>$0</span>
                  <span>$25.000.000</span>
                  <span>$50.000.000</span>
                </div>
              </div>

              {/* Plazo del crédito en años */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-[#6B6B54]">Plazo del Crédito Hipotecario:</span>
                  <span className="font-bold text-[#4A4A30]">{loanTerm} años ({loanTerm * 12} cuotas)</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 20, 25, 30].map((years) => (
                    <button
                      key={years}
                      type="button"
                      onClick={() => setLoanTerm(years)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        loanTerm === years
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                          : 'bg-[#FDFCF8] text-[#6B6B54] border-[#E5E5DF] hover:bg-[#F5F5F0]'
                      }`}
                    >
                      {years} años
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasa de interés */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-[#6B6B54]">Tasa de Interés Efectiva Anual (EA):</span>
                  <span className="font-bold text-[#4A4A30]">{interestRate}% EA</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setInterestRate(10.2)}
                    className={`py-1.5 text-[11px] rounded-xl border font-medium ${
                      interestRate === 10.2 ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-[#FDFCF8] text-[#6B6B54] border-[#E5E5DF]'
                    }`}
                  >
                    10.2% (FNA / Agrario)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(11.5)}
                    className={`py-1.5 text-[11px] rounded-xl border font-medium ${
                      interestRate === 11.5 ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-[#FDFCF8] text-[#6B6B54] border-[#E5E5DF]'
                    }`}
                  >
                    11.5% (Bancolombia VIS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(12.5)}
                    className={`py-1.5 text-[11px] rounded-xl border font-medium ${
                      interestRate === 12.5 ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-[#FDFCF8] text-[#6B6B54] border-[#E5E5DF]'
                    }`}
                  >
                    12.5% (Tasa Estándar)
                  </button>
                </div>
                <input
                  type="range"
                  min="9.0"
                  max="15.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>

              {/* Subsidio a la tasa FRECH */}
              <div className="bg-[#F5F5F0] p-3.5 rounded-2xl border border-[#E5E5DF] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#4A4A30] block">
                    Beneficio Cobertura de Tasa FRECH (Gobierno):
                  </span>
                  <span className="text-[11px] text-[#6B6B54]">
                    Rebaja hasta 4.5% EA de los intereses durante los primeros 7 años
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={applyFrech}
                  onChange={(e) => setApplyFrech(e.target.checked)}
                  className="w-4 h-4 accent-[#5A5A40] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Column (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-[#4A4A30] text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-[#4A4A30] relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#C1694F]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <span className="text-xs uppercase tracking-widest text-[#E5E5DF] font-semibold">
                  Resumen de Liquidación VIS
                </span>
                <span className="bg-[#5A5A40] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Simulación 2025
                </span>
              </div>

              {/* Cuota Mensual Hero Box */}
              <div className="my-6 bg-[#FDFCF8] rounded-2xl p-5 text-[#2A2A2A] shadow-xs">
                <span className="text-xs text-[#6B6B54] uppercase tracking-wider font-semibold block mb-1">
                  Cuota Mensual Estimada:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#C1694F]">
                    {formatCOP(applyFrech ? results.monthlyPaymentSubsidized : results.monthlyPaymentStandard)}
                  </span>
                  <span className="text-xs text-[#6B6B54]">/ mes</span>
                </div>

                {applyFrech && results.monthlyFrechSavings > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#E5E5DF] text-[11px] text-[#5A5A40] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-[#C1694F]">trending_down</span>
                    ¡Ahorras {formatCOP(results.monthlyFrechSavings)}/mes con tasa FRECH!
                  </div>
                )}
              </div>

              {/* Distribution Bar */}
              <div className="mb-6">
                <span className="text-xs font-medium text-white/90 block mb-1.5">
                  Distribución del Inmueble ({formatCOP(results.totalHousePrice)}):
                </span>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${pctSubsidies}%` }}
                    className="bg-[#C1694F] h-full"
                    title={`Subsidios: ${pctSubsidies}%`}
                  />
                  <div
                    style={{ width: `${pctSavings}%` }}
                    className="bg-[#5A5A40] h-full"
                    title={`Ahorros: ${pctSavings}%`}
                  />
                  <div
                    style={{ width: `${pctLoan}%` }}
                    className="bg-[#9E9E8E] h-full"
                    title={`Crédito: ${pctLoan}%`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-white/80 mt-2 font-medium">
                  <span className="text-[#F5F5F0]">● Subsidios ({pctSubsidies}%)</span>
                  <span className="text-[#E5E5DF]">● Ahorro ({pctSavings}%)</span>
                  <span className="text-white/70">● Crédito ({pctLoan}%)</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <ul className="space-y-2.5 text-xs sm:text-sm border-t border-white/15 pt-4">
                <li className="flex justify-between items-center text-white/90">
                  <span className="text-white/80">Valor Total del Inmueble:</span>
                  <span className="font-semibold text-white">{formatCOP(results.totalHousePrice)}</span>
                </li>
                <li className="flex justify-between items-center text-[#F5F5F0]">
                  <span className="flex items-center gap-1 text-white/90">
                    <span className="material-symbols-outlined text-[15px] text-[#C1694F]">redeem</span>
                    Total Subsidios Recibidos:
                  </span>
                  <span className="font-bold text-[#C1694F]">{formatCOP(results.totalSubsidies)}</span>
                </li>
                <li className="flex justify-between items-center text-white/80">
                  <span>Ahorros / Cesantías:</span>
                  <span className="font-semibold text-white">{formatCOP(savings)}</span>
                </li>
                <li className="flex justify-between items-center text-white/80">
                  <span>Cuota Inicial Pendiente:</span>
                  <span className="font-semibold text-white">
                    {results.remainingDownPaymentToPay > 0
                      ? formatCOP(results.remainingDownPaymentToPay)
                      : '¡Cubierta 100%! ($0)'}
                  </span>
                </li>
                <li className="flex justify-between items-center text-white border-t border-white/15 pt-2 font-medium">
                  <span>Monto Crédito a Financiar:</span>
                  <span className="font-serif font-bold text-lg text-white">{formatCOP(results.loanAmount)}</span>
                </li>
                <li className="flex justify-between items-center text-[11px] text-white/70">
                  <span>Ingreso familiar sugerido:</span>
                  <span>{formatCOP(results.minRecommendedIncome)}/mes</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  id="btn-guardar-en-mi-equipo"
                  onClick={() => handleDownloadPdf()}
                  className="w-full bg-[#C1694F] hover:bg-[#A1553F] text-white font-semibold py-3 px-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  GUARDAR EN MI EQUIPO
                </button>

                {/* Instant Feedback Banner */}
                {downloadSuccess && (
                  <div className="p-3 bg-white/15 border border-white/25 rounded-2xl text-center text-white text-xs flex items-center justify-center gap-2 backdrop-blur-sm animate-fade-in">
                    <span className="material-symbols-outlined text-[#E5E5DF] text-base">check_circle</span>
                    <span>¡Resumen en PDF guardado en tu equipo! Revisa tu carpeta de descargas.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSendWhatsapp}
                  className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold py-2.5 px-4 rounded-full text-xs transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Consultar por WhatsApp
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(true)}
                    className="text-[11px] text-white/75 hover:text-white underline transition-colors cursor-pointer"
                  >
                    ¿Deseas personalizar el PDF con tu nombre o recibir asesoría?
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-white/60 text-center mt-3">
                *Simulación informativa sujeta a políticas de crédito bancario y aprobación de subsidios vigentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personalize & Download Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-[#FDFCF8] rounded-[32px] max-w-md w-full p-7 sm:p-8 shadow-2xl border border-[#E5E5DF] relative">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-5 right-5 text-[#9E9E8E] hover:text-[#2A2A2A] rounded-full p-1 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <span className="text-[#C1694F] font-semibold text-[11px] uppercase tracking-widest block mb-1">
              Documento Personalizado
            </span>
            <h3 className="text-2xl font-serif text-[#4A4A30] mb-1">
              Personalizar y Guardar en Mi Equipo
            </h3>
            <p className="text-xs text-[#6B6B54] mb-5 leading-relaxed font-light">
              Ingresa tus datos para generar el PDF personalizado con tu nombre y recibir acompañamiento para postularte a los subsidios de {currentProjectName}.
            </p>

            {saveSuccess ? (
              <div className="p-5 bg-[#F5F5F0] border border-[#E5E5DF] rounded-2xl text-center text-[#4A4A30] space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#C1694F]">check_circle</span>
                <h4 className="font-serif font-bold text-base">¡Resumen en PDF Descargado!</h4>
                <p className="text-xs text-[#6B6B54]">
                  El archivo PDF ha sido guardado en tu equipo y tu solicitud registrada para que un asesor te contacte.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveLeadSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A4A30] mb-1 uppercase tracking-wider">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Carlos Mario Giraldo"
                    className="w-full text-sm p-3 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A4A30] mb-1 uppercase tracking-wider">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. 3201234567"
                    className="w-full text-sm p-3 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A4A30] mb-1 uppercase tracking-wider">Correo Electrónico</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full text-sm p-3 bg-white border border-[#E5E5DF] rounded-xl text-[#2A2A2A] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div className="bg-[#F5F5F0] p-3 rounded-xl border border-[#E5E5DF] text-xs text-[#6B6B54]">
                  <span className="font-semibold text-[#4A4A30] block mb-0.5">Resumen de simulación:</span>
                  <span>{currentProjectName} · Cuota: {formatCOP(applyFrech ? results.monthlyPaymentSubsidized : results.monthlyPaymentStandard)}/mes</span>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="px-5 py-2.5 border border-[#E5E5DF] text-xs font-semibold rounded-full text-[#6B6B54] hover:bg-[#F5F5F0]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C1694F] hover:bg-[#A1553F] text-white text-xs font-semibold rounded-full transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Descargar en Mi Equipo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
