export type ProjectStatus = 'Lanzamiento' | 'Preventa' | 'En Obra' | 'Entregado';
export type ProjectStage = 'En Preventa' | 'En Obra' | 'En Acabados' | 'Para Entregar';

export interface Project {
  id: string;
  name: string;
  projectType?: string; // VIS, No VIS, Campestre, etc.
  location: string;
  zone?: 'norte' | 'zaragoza' | string;
  type?: 'casa' | 'apartamento' | string;
  typeName?: string;
  status?: ProjectStatus;
  priceRange?: string; // ej. Desde $159.500.000 COP
  priceSMMLV?: number;
  priceCOP?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: string;
  bathrooms?: string;
  parking?: string;
  stage?: string;
  constructionStage?: ProjectStage;
  deliveryYear?: string;
  statusText?: string;
  heroImage?: string;
  photos?: string[];
  galleryImages?: string[];
  description: string;
  shortDescription?: string;
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  floorPlans?: {
    id: string;
    title: string;
    area: string;
    rooms: string;
    baths: string;
    image: string;
    type: '2D' | '3D';
    description: string;
  }[];
  createdAt?: string;
}

export type PropertyType = 'Casa' | 'Apartamento' | 'Lote';
export type PropertyStatus = 'Disponible' | 'Reservado' | 'Vendido';

export interface PropertyItem {
  id: string;
  name: string;
  projectId?: string | null;
  projectName?: string;
  type: PropertyType;
  location: string;
  price: number;
  status: PropertyStatus;
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  description: string;
  photos: string[];
  featured?: boolean;
  createdAt?: string;
}

export interface CalculatorInput {
  projectId: string;
  customPriceCOP: number;
  householdIncomeSMMLV: number; // 1 to 4+
  hasCompensacionBox: boolean; // Caja de compensación (Comfamiliar, Comfandi, etc.)
  sisbenCategory: 'A1_C8' | 'C9_D20' | 'none'; // Sisben para Mi Casa Ya
  useConcurrencia: boolean; // Concurrencia de subsidios
  downPaymentSavings: number; // Ahorros o cesantías
  loanTermYears: number; // 5, 10, 15, 20, 25, 30
  annualInterestRate: number; // e.g. 11.5%
  applyFrechRateSubsidy: boolean; // Cobertura a la tasa de interés (4-5 puntos)
}

export interface CalculatorResult {
  totalHousePrice: number;
  subsidyMiCasaYa: number;
  subsidyCajaCompensacion: number;
  totalSubsidies: number;
  totalDownPaymentNeeded: number; // e.g. 20% or 30%
  remainingDownPaymentToPay: number; // Down payment minus subsidies and personal savings
  loanAmount: number; // Remaining amount to finance with bank
  effectiveInterestRate: number;
  subsidizedInterestRate: number;
  monthlyPaymentStandard: number;
  monthlyPaymentSubsidized: number;
  monthlyFrechSavings: number;
  minRecommendedIncome: number;
}

export interface CRMLeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export type CRMLeadStatus =
  | 'Nuevo'
  | 'Contactado'
  | 'Cita Agendada'
  | 'En trámite de crédito'
  | 'Venta Cerrada'
  | 'Descartado';

export type PQRSType = 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';

export type PQRSStatus = 'Pendiente' | 'En trámite' | 'Respondida / Cerrada';

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  subsidyStatus?: string;
  source: 'formulario' | 'calculadora' | 'chatbot' | 'pqrs';
  status: CRMLeadStatus;
  message?: string;
  calculatorDetails?: {
    totalHousePrice: number;
    totalSubsidies: number;
    loanAmount: number;
    monthlyPayment: number;
    termYears: number;
  };
  pqrsType?: PQRSType;
  radicadoCode?: string;
  createdAt: string;
  syncedToGoogleSheet: boolean;
  notes: CRMLeadNote[];
}

export interface PQRSItem {
  id: string;
  radicadoCode: string;
  type: PQRSType;
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  status: PQRSStatus;
  createdAt: string;
  legalDeadlineDays: number;
  officialResponse?: string;
  respondedAt?: string;
  respondedBy?: string;
  syncedToGoogleSheet: boolean;
}

export interface CRMStaffUser {
  id: string;
  username: string;
  name: string;
  role: string;
  token: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  leadCaptured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  image: string;
  deliverables: string[];
  shortDescription?: string;
  detailedDescription?: string;
  benefits?: string[];
}

export type Service = ServiceItem;
