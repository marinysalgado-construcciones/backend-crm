import { CalculatorInput, CalculatorResult } from '../types';
import { SMMLV_CURRENT } from '../data/projectsData';

export function calculateVisMortgage(input: CalculatorInput): CalculatorResult {
  // 1. Determine base price
  // El precio llega sincronizado desde el proyecto dinámico seleccionado en la
  // calculadora (customPriceCOP); ya no se consulta la lista estática de proyectos.
  let totalHousePrice = input.customPriceCOP;

  if (totalHousePrice <= 0) {
    totalHousePrice = 135 * SMMLV_CURRENT;
  }

  // 2. Calculate Subsidies
  let subsidyMiCasaYa = 0;
  if (input.sisbenCategory === 'A1_C8') {
    subsidyMiCasaYa = 30 * SMMLV_CURRENT; // 30 SMMLV
  } else if (input.sisbenCategory === 'C9_D20') {
    subsidyMiCasaYa = 20 * SMMLV_CURRENT; // 20 SMMLV
  }

  let subsidyCajaCompensacion = 0;
  if (input.hasCompensacionBox) {
    if (input.householdIncomeSMMLV <= 2) {
      subsidyCajaCompensacion = 30 * SMMLV_CURRENT;
    } else if (input.householdIncomeSMMLV <= 4) {
      subsidyCajaCompensacion = 20 * SMMLV_CURRENT;
    }
  }

  // Concurrence cap (up to 50 SMMLV max combined if <= 2 SMMLV income)
  let totalSubsidies = 0;
  if (input.useConcurrencia && input.hasCompensacionBox && input.sisbenCategory !== 'none') {
    const sum = subsidyMiCasaYa + subsidyCajaCompensacion;
    const maxConcurrencia = 50 * SMMLV_CURRENT; // 50 SMMLV = ~$72.5M COP
    totalSubsidies = Math.min(sum, maxConcurrencia);
  } else {
    // Standard single subsidy or independent application
    totalSubsidies = Math.max(subsidyMiCasaYa, subsidyCajaCompensacion);
    if (input.sisbenCategory !== 'none' && input.hasCompensacionBox) {
      // If both selected but concurrence not enabled, default to the highest
      totalSubsidies = Math.max(subsidyMiCasaYa, subsidyCajaCompensacion);
    }
  }

  // Subsidies cannot exceed 60% of house value
  totalSubsidies = Math.min(totalSubsidies, totalHousePrice * 0.6);

  // 3. Cuota Inicial (typically 30% of house price for Colombian banks, or 20% minimum)
  const totalDownPaymentNeeded = totalHousePrice * 0.3; // 30% cuota inicial
  const availableDownPayment = totalSubsidies + (input.downPaymentSavings || 0);
  const remainingDownPaymentToPay = Math.max(0, totalDownPaymentNeeded - availableDownPayment);

  // 4. Loan Amount (Monto del crédito hipotecario)
  // Loan = Total Price - Subsidies - Personal Down Payment Savings
  let loanAmount = totalHousePrice - totalSubsidies - (input.downPaymentSavings || 0);
  // Cap loan at 80% maximum LTV
  const maxLoan = totalHousePrice * 0.8;
  loanAmount = Math.max(0, Math.min(loanAmount, maxLoan));

  // 5. Interest Rate & Monthly Payment
  const nominalAnnualRate = input.annualInterestRate / 100;
  // Convert Effective Annual (EA) to Effective Monthly (EM)
  const monthlyRateStandard = Math.pow(1 + nominalAnnualRate, 1 / 12) - 1;

  // Subsidized rate with FRECH (government subsidizes 4.0% to 5.0% of the EA)
  const frechDiscount = input.applyFrechRateSubsidy ? 0.045 : 0; // 4.5% subsidy
  const nominalSubsidizedAnnualRate = Math.max(0.04, nominalAnnualRate - frechDiscount);
  const monthlyRateSubsidized = Math.pow(1 + nominalSubsidizedAnnualRate, 1 / 12) - 1;

  const totalMonths = Math.max(12, input.loanTermYears * 12);

  // Standard installment
  let monthlyPaymentStandard = 0;
  if (loanAmount > 0 && monthlyRateStandard > 0) {
    monthlyPaymentStandard =
      loanAmount *
      ((monthlyRateStandard * Math.pow(1 + monthlyRateStandard, totalMonths)) /
        (Math.pow(1 + monthlyRateStandard, totalMonths) - 1));
  }

  // Subsidized installment
  let monthlyPaymentSubsidized = 0;
  if (loanAmount > 0 && monthlyRateSubsidized > 0) {
    monthlyPaymentSubsidized =
      loanAmount *
      ((monthlyRateSubsidized * Math.pow(1 + monthlyRateSubsidized, totalMonths)) /
        (Math.pow(1 + monthlyRateSubsidized, totalMonths) - 1));
  }

  const monthlyFrechSavings = Math.max(0, monthlyPaymentStandard - monthlyPaymentSubsidized);

  // Law in Colombia stipulates mortgage payment cannot exceed 40% of income for VIS
  const minRecommendedIncome = (input.applyFrechRateSubsidy ? monthlyPaymentSubsidized : monthlyPaymentStandard) / 0.35;

  return {
    totalHousePrice: Math.round(totalHousePrice),
    subsidyMiCasaYa: Math.round(subsidyMiCasaYa),
    subsidyCajaCompensacion: Math.round(subsidyCajaCompensacion),
    totalSubsidies: Math.round(totalSubsidies),
    totalDownPaymentNeeded: Math.round(totalDownPaymentNeeded),
    remainingDownPaymentToPay: Math.round(remainingDownPaymentToPay),
    loanAmount: Math.round(loanAmount),
    effectiveInterestRate: input.annualInterestRate,
    subsidizedInterestRate: Number((nominalSubsidizedAnnualRate * 100).toFixed(2)),
    monthlyPaymentStandard: Math.round(monthlyPaymentStandard),
    monthlyPaymentSubsidized: Math.round(monthlyPaymentSubsidized),
    monthlyFrechSavings: Math.round(monthlyFrechSavings),
    minRecommendedIncome: Math.round(minRecommendedIncome),
  };
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}
