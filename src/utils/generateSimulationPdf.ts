import { jsPDF } from 'jspdf';
import { formatCOP } from './calculatorEngine';
import { CalculatorResult } from '../types';

export interface SimulationPdfData {
  projectName: string;
  projectType: string;
  projectLocation: string;
  priceSMMLV: number;
  totalPriceCOP: number;
  householdIncomeSMMLV: number;
  hasCaja: boolean;
  sisbenCategory: string;
  useConcurrencia: boolean;
  savingsCOP: number;
  loanTermYears: number;
  interestRateEA: number;
  applyFrech: boolean;
  results: CalculatorResult;
  clientName?: string;
  clientPhone?: string;
}

export function generateSimulationPdf(data: SimulationPdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primaryOlive = [74, 74, 48]; // #4A4A30
  const accentTerracotta = [193, 105, 79]; // #C1694F
  const darkCharcoal = [42, 42, 42]; // #2A2A2A
  const textMuted = [107, 107, 84]; // #6B6B54
  const lightBg = [248, 248, 244]; // #F8F8F4
  const borderColor = [229, 229, 223]; // #E5E5DF

  // 1. Header Banner
  doc.setFillColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MARÍN & SALGADO CONSTRUCCIONES S.A.S.', margin + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(230, 230, 220);
  doc.text('Viviendas de Interés Social (VIS) Premium · Cartago, Valle del Cauca · NIT 901.482.391-4', margin + 8, y + 17);
  doc.text('PBX: +57 (322) 637-4991 · contacto@marinysalgado.com · www.marinysalgado.com', margin + 8, y + 22);

  y += 32;

  // 2. Document Title & Folio
  doc.setTextColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('SIMULACIÓN FINANCIERA Y SUBSIDIOS DE VIVIENDA VIS', margin, y);

  const todayStr = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const folioCode = `MS-VIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Fecha: ${todayStr}  |  Folio: ${folioCode}`, margin, y + 5);

  y += 10;

  // 3. Project Information Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setTextColor(accentTerracotta[0], accentTerracotta[1], accentTerracotta[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DATOS DEL PROYECTO SELECCIONADO', margin + 6, y + 7);

  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.setFontSize(11);
  doc.text(data.projectName, margin + 6, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Ubicación: ${data.projectLocation}  |  Tipología: ${data.projectType}`, margin + 6, y + 20);

  // Price badge inside box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.text(`Valor Vivienda VIS: ${formatCOP(data.results.totalHousePrice)}`, margin + 6, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`(${data.priceSMMLV} SMMLV al momento de escrituración)`, margin + 95, y + 26);

  y += 36;

  // 4. Client / Beneficiary info (if available)
  if (data.clientName || data.clientPhone) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
    doc.text('BENEFICIARIO TITULAR:', margin + 6, y + 7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
    const nameTxt = data.clientName || 'Cliente Interesado';
    const phoneTxt = data.clientPhone ? ` · Tel: ${data.clientPhone}` : '';
    doc.text(`${nameTxt}${phoneTxt}`, margin + 45, y + 7.5);
    y += 16;
  }

  // 5. Two Columns: Left = Subsidios y Cuota Inicial, Right = Crédito y Cuota Mensual
  const colWidth = (contentWidth - 6) / 2;
  const leftX = margin;
  const rightX = margin + colWidth + 6;
  const boxHeight = 74;

  // --- Left Box: Subsidios & Cuota Inicial ---
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(leftX, y, colWidth, boxHeight, 2, 2, 'FD');

  doc.setFillColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.rect(leftX, y, colWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('1. SUBSIDIOS Y CUOTA INICIAL', leftX + 4, y + 4.8);

  let ly = y + 13;
  const printRow = (x: number, currentY: number, label: string, value: string, isBold = false, isAccent = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(8);
    if (isAccent) {
      doc.setTextColor(accentTerracotta[0], accentTerracotta[1], accentTerracotta[2]);
    } else {
      doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
    }
    doc.text(label, x + 4, currentY);
    doc.text(value, x + colWidth - 4, currentY, { align: 'right' });
  };

  printRow(leftX, ly, 'Cuota Inicial Requerida (20%):', formatCOP(data.results.totalDownPaymentNeeded));
  ly += 7;

  printRow(leftX, ly, 'Subsidio Mi Casa Ya:', formatCOP(data.results.subsidyMiCasaYa), false, true);
  ly += 7;

  printRow(leftX, ly, 'Subsidio Caja Compensación:', formatCOP(data.results.subsidyCajaCompensacion), false, true);
  ly += 7;

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(leftX + 4, ly - 1.5, leftX + colWidth - 4, ly - 1.5);

  printRow(leftX, ly + 2, 'TOTAL SUBSIDIOS DE VIVIENDA:', formatCOP(data.results.totalSubsidies), true, true);
  ly += 9;

  printRow(leftX, ly, 'Ahorros / Cesantías Propias:', formatCOP(data.savingsCOP));
  ly += 8;

  doc.line(leftX + 4, ly - 2, leftX + colWidth - 4, ly - 2);

  const pendingDownPaymentText = data.results.remainingDownPaymentToPay > 0
    ? formatCOP(data.results.remainingDownPaymentToPay)
    : '$0 (¡Cubierta 100%!)';
  printRow(leftX, ly + 2, 'Cuota Inicial Pendiente por Pagar:', pendingDownPaymentText, true);

  // --- Right Box: Crédito Hipotecario & Cuotas ---
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(rightX, y, colWidth, boxHeight, 2, 2, 'FD');

  doc.setFillColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.rect(rightX, y, colWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('2. CRÉDITO Y CUOTAS MENSUALES', rightX + 4, y + 4.8);

  let ry = y + 13;
  printRow(rightX, ry, 'Monto a Financiar (Banco):', formatCOP(data.results.loanAmount), true);
  ry += 7;

  printRow(rightX, ry, 'Plazo del Crédito:', `${data.loanTermYears} años (${data.loanTermYears * 12} meses)`);
  ry += 7;

  printRow(rightX, ry, 'Tasa de Interés Referencia:', `${data.interestRateEA.toFixed(1)}% E.A.`);
  ry += 7;

  printRow(rightX, ry, 'Cobertura Tasa FRECH VIS:', data.applyFrech ? 'Aplicada (-4.0% E.A.)' : 'No aplicada');
  ry += 7;

  doc.line(rightX + 4, ry - 1.5, rightX + colWidth - 4, ry - 1.5);

  printRow(rightX, ry + 2, 'Cuota Estándar sin Subsidio:', `${formatCOP(data.results.monthlyPaymentStandard)}/mes`);
  ry += 9;

  // Highlighted monthly payment
  doc.setFillColor(74, 74, 48);
  doc.roundedRect(rightX + 3, ry - 3, colWidth - 6, 12, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CUOTA ESTIMADA CON COBERTURA:', rightX + 6, ry + 1);
  doc.setFontSize(10.5);
  const finalMonthly = data.applyFrech ? data.results.monthlyPaymentSubsidized : data.results.monthlyPaymentStandard;
  doc.text(`${formatCOP(finalMonthly)} / mes`, rightX + colWidth - 6, ry + 5, { align: 'right' });

  ry += 14;
  printRow(rightX, ry, 'Ingreso Familiar Recomendado:', `${formatCOP(data.results.minRecommendedIncome)}/mes`);

  y += boxHeight + 8;

  // 6. Subsidies Criteria & Assumptions Table
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.text('PARÁMETROS APLICADOS PARA ESTA SIMULACIÓN:', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);

  const sisbenLabel = data.sisbenCategory === 'A1_C8' ? 'A1 hasta C8 (Prioritario)' : data.sisbenCategory === 'C9_D20' ? 'C9 hasta D20' : 'Sin Sisbén registrado';
  const cajaLabel = data.hasCaja ? 'Afiliado a Caja de Compensación' : 'No afiliado a Caja';
  const concurrenciaLabel = data.useConcurrencia ? 'Aplica Concurrencia de Subsidios' : 'Subsidio único';

  doc.text(`• Ingresos del Hogar: ${data.householdIncomeSMMLV} SMMLV (${formatCOP(data.householdIncomeSMMLV * 1423500)} aprox.)`, margin + 6, y + 13);
  doc.text(`• Clasificación Sisbén IV: ${sisbenLabel}`, margin + 6, y + 19);
  doc.text(`• Caja de Compensación: ${cajaLabel}`, margin + 6, y + 25);
  doc.text(`• Concurrencia Mi Casa Ya + Caja: ${concurrenciaLabel}`, margin + 6, y + 31);

  doc.text(`• Tasa E.A. Efectiva Calculada: ${(data.applyFrech ? data.results.subsidizedInterestRate : data.results.effectiveInterestRate).toFixed(2)}% E.A.`, margin + 100, y + 13);
  doc.text(`• Ahorro Mensual Estimado por Subsidio a la Tasa: ${formatCOP(data.results.monthlyFrechSavings)}/mes`, margin + 100, y + 19);
  doc.text(`• Porcentaje de Financiación Bancaria: ${((data.results.loanAmount / data.results.totalHousePrice) * 100).toFixed(0)}% del valor`, margin + 100, y + 25);
  doc.text(`• Acompañamiento en Trámite: Incluido sin costo por Marín & Salgado`, margin + 100, y + 31);

  y += 40;

  // 7. Steps to Access Subsidies in Cartago
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accentTerracotta[0], accentTerracotta[1], accentTerracotta[2]);
  doc.text('PASOS PARA POSTULARSE Y SEPARAR SU VIVIENDA VIS:', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text('1. Presentar esta simulación en nuestra sala de ventas en Cartago o enviarla vía WhatsApp al +57 (322) 637-4991.', margin + 6, y + 12);
  doc.text('2. Solicitar pre-aprobación del crédito hipotecario con nuestras entidades financieras aliadas (Bancolombia, Davivienda, FNA).', margin + 6, y + 17);
  doc.text('3. Postulación de cupo al programa "Mi Casa Ya" y trámite del subsidio con la Caja de Compensación Familiar.', margin + 6, y + 22);

  y += 28;

  // 8. Legal Disclaimer & Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const disclaimerText = 'AVISO LEGAL: El presente documento es una simulación financiera ilustrativa y orientativa que no constituye una oferta comercial vinculante. La adjudicación de subsidios del Gobierno Nacional (Mi Casa Ya) y de Cajas de Compensación Familiar está sujeta a la disponibilidad de cupos presupuestales y cumplimiento de requisitos normativos. La aprobación del crédito hipotecario depende exclusivamente del estudio de capacidad de pago de la entidad financiera vigilada por la Superfinanciera.';
  doc.text(disclaimerText, margin, y, { maxWidth: contentWidth, align: 'justify' });

  // Page Bottom Watermark / Contact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryOlive[0], primaryOlive[1], primaryOlive[2]);
  doc.text('Marín & Salgado Construcciones S.A.S. · Cartago, Valle del Cauca · Sala de Ventas: Carrera 4 # 12-35', margin, 288);
  doc.setFont('helvetica', 'normal');
  doc.text(`Documento generado electrónicamente · Página 1 de 1`, pageWidth - margin, 288, { align: 'right' });

  // Clean filename with project slug and date
  const sanitizedProject = data.projectName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateSlug = new Date().toISOString().slice(0, 10);
  const fileName = `Simulacion_VIS_${sanitizedProject}_${dateSlug}.pdf`;

  // Download directly to the user's computer
  doc.save(fileName);
}
