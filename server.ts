import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// In-memory CRM Leads Store & PQRS Store
interface CRMLeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface CRMLeadStore {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  subsidyStatus: string;
  source: 'formulario' | 'calculadora' | 'chatbot' | 'pqrs';
  status: 'Nuevo' | 'Contactado' | 'Cita Agendada' | 'En trámite de crédito' | 'Venta Cerrada' | 'Descartado';
  message?: string;
  calculatorDetails?: {
    totalHousePrice: number;
    totalSubsidies: number;
    loanAmount: number;
    monthlyPayment: number;
    termYears: number;
  };
  createdAt: string;
  syncedToGoogleSheet: boolean;
  notes: CRMLeadNote[];
}

interface PQRSStore {
  id: string;
  radicadoCode: string;
  type: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  status: 'Pendiente' | 'En trámite' | 'Respondida / Cerrada';
  createdAt: string;
  legalDeadlineDays: number;
  officialResponse?: string;
  respondedAt?: string;
  respondedBy?: string;
  syncedToGoogleSheet: boolean;
}

const crmLeads: CRMLeadStore[] = [
  {
    id: 'lead-001',
    name: 'Andrés Felipe Gómez',
    email: 'andres.gomez@gmail.com',
    phone: '3157892341',
    project: 'Urbanización Los Álamos',
    subsidyStatus: 'Sisbén IV (A1-C8) + Comfamiliar Risaralda',
    source: 'calculadora',
    status: 'En trámite de crédito',
    message: 'Interesado en casa unifamiliar de 65m² con subsidio concurrente Mi Casa Ya y Comfamiliar.',
    calculatorDetails: {
      totalHousePrice: 195750000,
      totalSubsidies: 72500000,
      loanAmount: 123250000,
      monthlyPayment: 980000,
      termYears: 20,
    },
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    syncedToGoogleSheet: true,
    notes: [
      {
        id: 'note-1',
        author: 'Carolina Salgado',
        text: 'Se realizó perfilamiento financiero inicial. Cuenta con preaprobado de Bancolombia por $115M.',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
      {
        id: 'note-2',
        author: 'Carlos Patiño',
        text: 'Cita en sala de ventas agendada para revisar plano de ampliación de la casa modelo.',
        createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      },
    ],
  },
  {
    id: 'lead-002',
    name: 'Sandra Milena Valencia',
    email: 'sandram.valencia@hotmail.com',
    phone: '3184561290',
    project: 'Residencial El Samán',
    subsidyStatus: 'Solo Caja de Compensación (Comfandi)',
    source: 'formulario',
    status: 'Contactado',
    message: 'Solicitud de información sobre apartamentos de 3 alcobas y fecha de entrega Etapa 1 en Cartago.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    syncedToGoogleSheet: true,
    notes: [
      {
        id: 'note-3',
        author: 'Carlos Patiño',
        text: 'Contactada por WhatsApp. Se le envió brochure digital de Residencial El Samán y lista de precios.',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
    ],
  },
  {
    id: 'lead-003',
    name: 'Julián David Morales',
    email: 'jdmorales_cartago@gmail.com',
    phone: '3206789123',
    project: 'Residencial El Samán',
    subsidyStatus: 'Sisbén IV Grupo C2 (Mi Casa Ya)',
    source: 'chatbot',
    status: 'Nuevo',
    message: 'Consultó por subsidio Sisbén C2 y plan de pagos de cuota inicial a 18 meses para El Samán.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    syncedToGoogleSheet: false,
    notes: [],
  },
  {
    id: 'lead-004',
    name: 'Claudia Patricia Restrepo',
    email: 'claudia.restrepo.vis@gmail.com',
    phone: '3117823901',
    project: 'Urbanización Los Álamos',
    subsidyStatus: 'Concurrencia (Sisbén B4 + Comfamiliar)',
    source: 'formulario',
    status: 'Cita Agendada',
    message: 'Desea visitar el lote y conocer la distribución de 3 habitaciones en Los Álamos.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    syncedToGoogleSheet: true,
    notes: [
      {
        id: 'note-4',
        author: 'Carolina Salgado',
        text: 'Asignada cita para el sábado a las 10:30 AM en la Sala de Ventas Cra 6 # 14-55.',
        createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
      },
    ],
  },
  {
    id: 'lead-005',
    name: 'Héctor Fabio Ramírez',
    email: 'hector.ramirez77@yahoo.es',
    phone: '3145678901',
    project: 'Residencial El Samán',
    subsidyStatus: 'Ahorro programado + Caja de Compensación',
    source: 'calculadora',
    status: 'Venta Cerrada',
    message: 'Separó apartamento Torre 1 apartamento 402 en Residencial El Samán.',
    calculatorDetails: {
      totalHousePrice: 159500000,
      totalSubsidies: 43500000,
      loanAmount: 116000000,
      monthlyPayment: 810000,
      termYears: 20,
    },
    createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    syncedToGoogleSheet: true,
    notes: [
      {
        id: 'note-5',
        author: 'Carolina Salgado',
        text: 'Legalización de encargo fiduciario y separación por $2.000.000 COP completada.',
        createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
      },
    ],
  },
  {
    id: 'lead-006',
    name: 'Marcela Viviana Henao',
    email: 'mviviana.henao@gmail.com',
    phone: '3168901234',
    project: 'Urbanización Los Álamos',
    subsidyStatus: 'Sin subsidio / Crédito directo',
    source: 'chatbot',
    status: 'Descartado',
    message: 'Buscaba vivienda no VIS de más de 300 millones.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    syncedToGoogleSheet: true,
    notes: [
      {
        id: 'note-6',
        author: 'Carlos Patiño',
        text: 'Se le aclaró que nuestros proyectos actuales son VIS (hasta 135 SMMLV). Descartado de común acuerdo.',
        createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      },
    ],
  },
];

const pqrsStore: PQRSStore[] = [
  {
    id: 'pqrs-001',
    radicadoCode: 'PQRS-2025-0142',
    type: 'Petición',
    name: 'Carlos Mario Londoño',
    phone: '3174567890',
    email: 'carlos.mario.l@hotmail.com',
    project: 'Residencial El Samán',
    message: 'Solicito certificación de fecha estimada de escrituración y entrega para Torre 1 de El Samán.',
    status: 'Respondida / Cerrada',
    createdAt: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
    legalDeadlineDays: 15,
    officialResponse: 'Estimado señor Carlos Mario: Mediante comunicación radicada y enviada a su correo electrónico se le remitió la certificación oficial suscrita por Gerencia con cronograma de obra y fecha de escrituración estimada noviembre 2025.',
    respondedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    respondedBy: 'Carolina Salgado (Gerencia de Proyectos)',
    syncedToGoogleSheet: true,
  },
  {
    id: 'pqrs-002',
    radicadoCode: 'PQRS-2025-0189',
    type: 'Reclamo',
    name: 'Diana Marcela Echeverri',
    phone: '3139876543',
    email: 'diana.echeverri88@gmail.com',
    project: 'Urbanización Los Álamos',
    message: 'Requiero revisión de los niveles topográficos de los lotes colindantes en la Manzana 2 de Los Álamos.',
    status: 'Pendiente',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    legalDeadlineDays: 15,
    syncedToGoogleSheet: true,
  },
  {
    id: 'pqrs-003',
    radicadoCode: 'PQRS-2025-0205',
    type: 'Sugerencia',
    name: 'Jorge Eliécer Quintero',
    phone: '3213456789',
    email: 'jorge.quintero.cartago@gmail.com',
    project: 'Residencial El Samán',
    message: 'Sugerencia para incluir punto de recarga para motos eléctricas en el parqueadero de visitantes.',
    status: 'Pendiente',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    legalDeadlineDays: 15,
    syncedToGoogleSheet: false,
  },
];

const SHEET_CONFIG_FILE = path.join(process.cwd(), '.sheet_config.json');

function loadSavedSheetConfig(): string {
  try {
    if (fs.existsSync(SHEET_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(SHEET_CONFIG_FILE, 'utf8'));
      if (data && typeof data.webhookUrl === 'string') {
        return data.webhookUrl.trim();
      }
    }
  } catch (e) {
    // silent
  }
  return '';
}

function saveSheetConfig(url: string) {
  try {
    fs.writeFileSync(SHEET_CONFIG_FILE, JSON.stringify({ webhookUrl: url.trim(), updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  } catch (e) {
    // silent
  }
}

let activeGoogleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || loadSavedSheetConfig() || '';

// Staff credentials table
const STAFF_ACCOUNTS = [
  {
    id: 'staff-1',
    username: 'admin@marinysalgado.com',
    password: 'MarinySalgado2025*',
    name: 'Carolina Salgado',
    role: 'Gerente de Proyectos & Fundadora',
    token: 'token-ms-admin-carolina-2025',
  },
  {
    id: 'staff-2',
    username: 'comercial@marinysalgado.com',
    password: 'CartagoVIS2025!',
    name: 'Carlos Andrés Patiño',
    role: 'Coordinador Comercial VIS',
    token: 'token-ms-comercial-carlos-2025',
  },
];

// Helper: Authentication Middleware for CRM routes
function verifyCrmAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No autorizado. Inicie sesión en el Portal CRM.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const staff = STAFF_ACCOUNTS.find((s) => s.token === token);
  if (!staff) {
    return res.status(403).json({ error: 'Sesión inválida o expirada. Vuelva a autenticarse.' });
  }

  (req as any).user = staff;
  next();
}

// -------------------------------------------------------------
// DYNAMIC DATABASE STORE: PROYECTOS & PROPIEDADES (DOBLE COLECCIÓN)
// -------------------------------------------------------------

export interface ServerProject {
  id: string;
  name: string;
  projectType: string; // VIS, No VIS, Comercial, Campestre, etc.
  location: string;
  zone?: string;
  status: 'Lanzamiento' | 'Preventa' | 'En Obra' | 'Entregado';
  priceRange: string;
  priceCOP?: number;
  priceSMMLV?: number;
  description: string;
  shortDescription?: string;
  constructionStage: 'En Preventa' | 'En Obra' | 'En Acabados' | 'Para Entregar';
  photos: string[];
  heroImage?: string;
  features?: { icon: string; title: string; description: string }[];
  deliveryYear?: string;
  createdAt: string;
}

export interface ServerProperty {
  id: string;
  name: string;
  projectId?: string | null;
  projectName?: string;
  type: 'Casa' | 'Apartamento' | 'Lote';
  location: string;
  price: number;
  status: 'Disponible' | 'Reservado' | 'Vendido';
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  description: string;
  photos: string[];
  featured?: boolean;
  createdAt: string;
}

const PROJECTS_STORE_FILE = path.join(process.cwd(), '.projects_store.json');
const PROPERTIES_STORE_FILE = path.join(process.cwd(), '.properties_store.json');

const SEED_PROJECTS: ServerProject[] = [
  {
    id: 'urbanizacion-los-alamos',
    name: 'Urbanización Los Álamos',
    projectType: 'VIS',
    location: 'Cartago, Sector Norte - Valle del Cauca',
    zone: 'norte',
    status: 'Preventa',
    priceRange: 'Desde $195.750.000 COP (135 SMMLV)',
    priceCOP: 195750000,
    priceSMMLV: 135,
    description: 'Urbanización Los Álamos combina armonía natural y arquitectura contemporánea en el Sector Norte de Cartago. Casas unifamiliares diseñadas con amplios espacios, ventilación cruzada e iluminación natural, pensadas para el bienestar familiar aplicando a subsidios VIS.',
    shortDescription: 'Casas unifamiliares con acabados y diseño sismorresistente en el sector norte de mayor valorización.',
    constructionStage: 'En Obra',
    heroImage: 'https://lh3.googleusercontent.com/aida/AEtjO1WzmJjPEXcy05boPwamPvH-RWmZKkSpQIrpjrSpv6Q4LxVKYDdbK8PsmSECyKZdMmdzlPQh6V9yLAfEc2xGQHGsSe8I0m0UWUmXzxGu3Xl8JvkywVC4T_dAfB5eIjOkLwsyrNM0anNa6fgF3Lrwpyp5jahAzYzgrbqGfbPEn-NQxpWqM12_2hieP00HAIlF70_a7FnayH5LTZQvSg0tK8myZNUm6bQeR2Wz3mLFm2f6FToCFuYZUwCS4w',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1WzmJjPEXcy05boPwamPvH-RWmZKkSpQIrpjrSpv6Q4LxVKYDdbK8PsmSECyKZdMmdzlPQh6V9yLAfEc2xGQHGsSe8I0m0UWUmXzxGu3Xl8JvkywVC4T_dAfB5eIjOkLwsyrNM0anNa6fgF3Lrwpyp5jahAzYzgrbqGfbPEn-NQxpWqM12_2hieP00HAIlF70_a7FnayH5LTZQvSg0tK8myZNUm6bQeR2Wz3mLFm2f6FToCFuYZUwCS4w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHqJ_ir118AcH2J-Cod5Xvu0dujaPr8RzDy1_XflOrw2CfA3y5L3TOpGamsWbxxafJiZwxMJDB_826lP-V1vRbSXorqzmOYlEnkE9qwKw5eOZNg0n-fFca5irr6ufQFj_S8pUSsCP9LCTCSp25J-wBTyaXJtDFKvmS2jR9NJazm6LaGgB6YmvF7FVMfCIOdL1AsaPH1S7t3I97-9LH96thKb98upLb8BUtQqQustYZIYuDqr8CNs8',
      'https://lh3.googleusercontent.com/aida/AEtjO1VFrhV5j_MgbF9jtQowlBY98hd68y9L8YQyV0lSbPoR14J6ff6ojnEBlirBSxbreQmoinTjJfwqRIRP7SkQDTZ13KweGSe1aW9AqCAWqK3sMNQK36iq97BOS1rJLn_ksYdZm6kmDU7H3e5G8l0r6Lt9EB-fE_n2GxYS5i0VGKssGI5tbz6y9uFJ5CkFznubskU0h44YPPP8Icrq-PiJVnUzOK0hwJqjxWmQujvHcR992AtYB6uB-qwVfA',
      'https://lh3.googleusercontent.com/aida/AEtjO1VxP_eJG42s2s-PDqU7RtZp_pB5P_51FrMIZaUWR0-7OtCeK9zvvMxWJPDdH7L93LRwU9Lk62QEl6EPNx2Ma2KQLGSCalKV3pyLnR8e-aE1ljikXg4wiuR6xi8VEKCUfUyxIBykUCnQH3xJyjwxfnu1pmUzlPpAIVHAOnfFOMwIf9_gTb7NZoHSrhi2DNzg7vmlQCKlBqgLqT5qoqNefGETm2SSR38K9lKWhaFAJHcLKrkXJTaaI7qAeA',
    ],
    features: [
      { icon: 'location_on', title: 'Sector Norte', description: 'Alta valorización y acceso rápido hacia Pereira.' },
      { icon: 'park', title: 'Zonas Verdes y Parques', description: 'Senderos ecológicos y juegos infantiles.' },
      { icon: 'verified', title: 'Aplica Subsidio Mi Casa Ya', description: 'Aplica a subsidios concurrentes de vivienda.' },
    ],
    deliveryYear: '2025',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'residencial-el-saman',
    name: 'Residencial El Samán',
    projectType: 'VIS',
    location: 'Cartago, Vía Zaragoza - Valle del Cauca',
    zone: 'zaragoza',
    status: 'Lanzamiento',
    priceRange: 'Desde $159.500.000 COP (110 SMMLV)',
    priceCOP: 159500000,
    priceSMMLV: 110,
    description: 'Residencial El Samán representa una oportunidad única para consolidar el sueño de tener vivienda propia en Cartago. Ubicado sobre la estratégica Vía Zaragoza a sólo 8 minutos del C.C. Nuestro Cartago, este conjunto ofrece apartamentos con excelente distribución, ascensor por torre y club house.',
    shortDescription: 'Apartamentos modernos de 2 y 3 alcobas con balcón y club house en conjunto cerrado.',
    constructionStage: 'En Obra',
    heroImage: 'https://lh3.googleusercontent.com/aida/AEtjO1W0EFz6VMqBr_kurg6YW3huRcbip6yen7I7SDtBdHs9eFgO88uk8J68rbT9s-Y_N21I3yJexaoiJtgNyGx5nzsh-Ucz1eyxp9FyHjRGrhhivRPqnSNY9PkVrlT1S_LPWkmLUQr4V7B52PyBO-pUCEtU8WHQ_bNeWeW6drF9PJrawH4CKzqMiUbite2xRyvituo4e48RoX9jWRUfWQFrZXcnarWHVTsVNXkJXhFqdti6AqlBIJV3gazvAg',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1W0EFz6VMqBr_kurg6YW3huRcbip6yen7I7SDtBdHs9eFgO88uk8J68rbT9s-Y_N21I3yJexaoiJtgNyGx5nzsh-Ucz1eyxp9FyHjRGrhhivRPqnSNY9PkVrlT1S_LPWkmLUQr4V7B52PyBO-pUCEtU8WHQ_bNeWeW6drF9PJrawH4CKzqMiUbite2xRyvituo4e48RoX9jWRUfWQFrZXcnarWHVTsVNXkJXhFqdti6AqlBIJV3gazvAg',
      'https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg',
      'https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw',
      'https://lh3.googleusercontent.com/aida/AEtjO1WJNa-Rr2H-VlTOHeDwCj3Xac21-qfxghonBmcbEUoY-pfvJO2TXLosNYooOweNzxbJITIzr73I7_VAhz-1ecSAYsPHgJ8pPBs1C64mT-IXucQA6DaONTF_ajQAmZCBzfd8hEtbl67-hqzO6ov7WIHj83Mp6P22hmWpurkg-gfrZsIOB0OUDipaYS1RfKVZz4PQ9c_jkQOFlFjq0KT83gVt86UbfYOQmj18vKUhouJKQMSQr8lyrvzSKQ',
    ],
    features: [
      { icon: 'location_on', title: 'Vía Zaragoza', description: 'A 8 minutos del C.C. Nuestro Cartago con excelente transporte.' },
      { icon: 'pool', title: 'Club House', description: 'Piscina para adultos y niños, salón de eventos y BBQ.' },
      { icon: 'security', title: 'Seguridad Privada', description: 'Portería con control sistematizado 24/7.' },
    ],
    deliveryYear: '2025 - 2026',
    createdAt: new Date().toISOString(),
  },
];

const SEED_PROPERTIES: ServerProperty[] = [
  {
    id: 'prop-001',
    name: 'Casa Tipo A · Manzana 3 Lote 12',
    projectId: 'urbanizacion-los-alamos',
    projectName: 'Urbanización Los Álamos',
    type: 'Casa',
    location: 'Cartago, Sector Norte',
    price: 195750000,
    status: 'Disponible',
    area: 65,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Hermosa casa unifamiliar con 3 alcobas, sala comedor integrada, cocina con mesón en granito, patio de ropas independiente y parqueadero. Aplica subsidio Mi Casa Ya y Comfamiliar.',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1WzmJjPEXcy05boPwamPvH-RWmZKkSpQIrpjrSpv6Q4LxVKYDdbK8PsmSECyKZdMmdzlPQh6V9yLAfEc2xGQHGsSe8I0m0UWUmXzxGu3Xl8JvkywVC4T_dAfB5eIjOkLwsyrNM0anNa6fgF3Lrwpyp5jahAzYzgrbqGfbPEn-NQxpWqM12_2hieP00HAIlF70_a7FnayH5LTZQvSg0tK8myZNUm6bQeR2Wz3mLFm2f6FToCFuYZUwCS4w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHqJ_ir118AcH2J-Cod5Xvu0dujaPr8RzDy1_XflOrw2CfA3y5L3TOpGamsWbxxafJiZwxMJDB_826lP-V1vRbSXorqzmOYlEnkE9qwKw5eOZNg0n-fFca5irr6ufQFj_S8pUSsCP9LCTCSp25J-wBTyaXJtDFKvmS2jR9NJazm6LaGgB6YmvF7FVMfCIOdL1AsaPH1S7t3I97-9LH96thKb98upLb8BUtQqQustYZIYuDqr8CNs8',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop-002',
    name: 'Casa Tipo B Ampliada · Manzana 1 Lote 5',
    projectId: 'urbanizacion-los-alamos',
    projectName: 'Urbanización Los Álamos',
    type: 'Casa',
    location: 'Cartago, Sector Norte',
    price: 218000000,
    status: 'Reservado',
    area: 78,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Casa con patio ampliado y estudio complementario. Acabados premium, ventanería acústica y diseño bioclimático.',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1VFrhV5j_MgbF9jtQowlBY98hd68y9L8YQyV0lSbPoR14J6ff6ojnEBlirBSxbreQmoinTjJfwqRIRP7SkQDTZ13KweGSe1aW9AqCAWqK3sMNQK36iq97BOS1rJLn_ksYdZm6kmDU7H3e5G8l0r6Lt9EB-fE_n2GxYS5i0VGKssGI5tbz6y9uFJ5CkFznubskU0h44YPPP8Icrq-PiJVnUzOK0hwJqjxWmQujvHcR992AtYB6uB-qwVfA',
      'https://lh3.googleusercontent.com/aida/AEtjO1VxP_eJG42s2s-PDqU7RtZp_pB5P_51FrMIZaUWR0-7OtCeK9zvvMxWJPDdH7L93LRwU9Lk62QEl6EPNx2Ma2KQLGSCalKV3pyLnR8e-aE1ljikXg4wiuR6xi8VEKCUfUyxIBykUCnQH3xJyjwxfnu1pmUzlPpAIVHAOnfFOMwIf9_gTb7NZoHSrhi2DNzg7vmlQCKlBqgLqT5qoqNefGETm2SSR38K9lKWhaFAJHcLKrkXJTaaI7qAeA',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop-003',
    name: 'Apartamento 302 · Torre 1 con Balcón',
    projectId: 'residencial-el-saman',
    projectName: 'Residencial El Samán',
    type: 'Apartamento',
    location: 'Cartago, Vía Zaragoza',
    price: 159500000,
    status: 'Disponible',
    area: 54,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Apartamento en tercer piso con ascensor, vista hacia la piscina del club house, 3 habitaciones, alcoba principal con baño privado y balcón exterior.',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1W0EFz6VMqBr_kurg6YW3huRcbip6yen7I7SDtBdHs9eFgO88uk8J68rbT9s-Y_N21I3yJexaoiJtgNyGx5nzsh-Ucz1eyxp9FyHjRGrhhivRPqnSNY9PkVrlT1S_LPWkmLUQr4V7B52PyBO-pUCEtU8WHQ_bNeWeW6drF9PJrawH4CKzqMiUbite2xRyvituo4e48RoX9jWRUfWQFrZXcnarWHVTsVNXkJXhFqdti6AqlBIJV3gazvAg',
      'https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop-004',
    name: 'Apartamento 204 · Torre 2',
    projectId: 'residencial-el-saman',
    projectName: 'Residencial El Samán',
    type: 'Apartamento',
    location: 'Cartago, Vía Zaragoza',
    price: 145000000,
    status: 'Disponible',
    area: 48,
    bedrooms: 2,
    bathrooms: 1,
    description: 'Apartamento compacto y moderno de 2 habitaciones, ideal para inversión o primera vivienda. Gran iluminación natural y cuota inicial financiada a 18 meses.',
    photos: [
      'https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw',
    ],
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prop-005',
    name: 'Lote Campestre Los Samanes N° 8',
    projectId: null,
    projectName: 'Independiente / No asociado',
    type: 'Lote',
    location: 'Cartago, Salida a Santa Ana',
    price: 135000000,
    status: 'Disponible',
    area: 280,
    bedrooms: 0,
    bathrooms: 0,
    description: 'Lote plano campestre con punto de agua y energía disponible, ideal para construcción de casa quinta o vivienda unifamiliar independiente.',
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBadwx1p3hyaLMMr5Ck9hLFXVxZFxdqoqdp7iTbLn8bDmc_Ji74VEYVZnmCXdn9OzgoFyZMc8Mf_l_T8vIEEEgF96kDMeLjLl5MmjfseY7sJ6CMgiBkvdoXPyhoiY1JiyPHJbLEoQVFZ7oAgHP9ILlohYl4zbIMA4WRY4rHFFhB9_JDSYNGIbCfqT6BbTF-9TRQnBORm_1_5oFQ9IkkzYUqno0fLkz92JyjNgkNE_1-kJRXRGbh79Y',
    ],
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

function loadProjectsStore(): ServerProject[] {
  try {
    if (fs.existsSync(PROJECTS_STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROJECTS_STORE_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading projects store, fallback to seed:', err);
  }
  saveProjectsStore(SEED_PROJECTS);
  return [...SEED_PROJECTS];
}

function saveProjectsStore(projects: ServerProject[]) {
  try {
    fs.writeFileSync(PROJECTS_STORE_FILE, JSON.stringify(projects, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving projects store:', err);
  }
}

function loadPropertiesStore(): ServerProperty[] {
  try {
    if (fs.existsSync(PROPERTIES_STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROPERTIES_STORE_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading properties store, fallback to seed:', err);
  }
  savePropertiesStore(SEED_PROPERTIES);
  return [...SEED_PROPERTIES];
}

function savePropertiesStore(properties: ServerProperty[]) {
  try {
    fs.writeFileSync(PROPERTIES_STORE_FILE, JSON.stringify(properties, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving properties store:', err);
  }
}

let activeProjects: ServerProject[] = loadProjectsStore();
let activeProperties: ServerProperty[] = loadPropertiesStore();

// --- PUBLIC APIS FOR PROJECTS & PROPERTIES ---

// 1. GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    projects: activeProjects,
    total: activeProjects.length,
  });
});

// 2. GET /api/projects/:id
app.get('/api/projects/:id', (req, res) => {
  const project = activeProjects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }
  res.json({ success: true, project });
});

// 3. GET /api/properties (con soporte de filtros)
app.get('/api/properties', (req, res) => {
  const { type, minPrice, maxPrice, zone, location, bedrooms, status, projectId, search } = req.query;

  let results = [...activeProperties];

  if (type && type !== 'all') {
    const typeStr = String(type).toLowerCase();
    results = results.filter((p) => p.type.toLowerCase() === typeStr);
  }

  if (status && status !== 'all') {
    const statusStr = String(status).toLowerCase();
    results = results.filter((p) => p.status.toLowerCase() === statusStr);
  }

  if (projectId && projectId !== 'all') {
    results = results.filter((p) => p.projectId === projectId);
  }

  if (zone && zone !== 'all') {
    const zStr = String(zone).toLowerCase();
    results = results.filter((p) => p.location.toLowerCase().includes(zStr));
  }

  if (location && location !== 'all') {
    const locStr = String(location).toLowerCase();
    results = results.filter((p) => p.location.toLowerCase().includes(locStr));
  }

  if (bedrooms && bedrooms !== 'all') {
    const beds = parseInt(String(bedrooms), 10);
    if (!isNaN(beds)) {
      results = results.filter((p) => p.bedrooms >= beds);
    }
  }

  if (minPrice) {
    const min = parseFloat(String(minPrice));
    if (!isNaN(min)) {
      results = results.filter((p) => p.price >= min);
    }
  }

  if (maxPrice) {
    const max = parseFloat(String(maxPrice));
    if (!isNaN(max)) {
      results = results.filter((p) => p.price <= max);
    }
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    properties: results,
    total: results.length,
    allCount: activeProperties.length,
  });
});

// 4. GET /api/properties/:id
app.get('/api/properties/:id', (req, res) => {
  const prop = activeProperties.find((p) => p.id === req.params.id);
  if (!prop) {
    return res.status(404).json({ error: 'Propiedad no encontrada' });
  }
  res.json({ success: true, property: prop });
});

// --- PROTECTED APIS (CRM) FOR PROJECTS ---

// POST /api/crm/projects
app.post('/api/crm/projects', verifyCrmAuth, (req, res) => {
  try {
    const {
      name,
      projectType,
      location,
      zone,
      status,
      priceRange,
      priceCOP,
      priceSMMLV,
      description,
      shortDescription,
      constructionStage,
      photos,
      heroImage,
      features,
      deliveryYear,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'El nombre y la ubicación del proyecto son obligatorios.' });
    }

    const id = (name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)).slice(0, 40);

    const newProject: ServerProject = {
      id,
      name: name.trim(),
      projectType: projectType || 'VIS',
      location: location.trim(),
      zone: zone || 'norte',
      status: status || 'Preventa',
      priceRange: priceRange || 'A convenir',
      priceCOP: priceCOP ? Number(priceCOP) : undefined,
      priceSMMLV: priceSMMLV ? Number(priceSMMLV) : undefined,
      description: description || '',
      shortDescription: shortDescription || '',
      constructionStage: constructionStage || 'En Preventa',
      photos: Array.isArray(photos) && photos.length > 0 ? photos : [heroImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      heroImage: heroImage || (Array.isArray(photos) && photos[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      features: Array.isArray(features) ? features : [],
      deliveryYear: deliveryYear || '2025',
      createdAt: new Date().toISOString(),
    };

    activeProjects.unshift(newProject);
    saveProjectsStore(activeProjects);

    res.status(201).json({ success: true, project: newProject, message: 'Proyecto creado exitosamente' });
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
});

// PUT /api/crm/projects/:id
app.put('/api/crm/projects/:id', verifyCrmAuth, (req, res) => {
  try {
    const idx = activeProjects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const current = activeProjects[idx];
    const updated: ServerProject = {
      ...current,
      ...req.body,
      id: current.id, // ID preserves
      photos: Array.isArray(req.body.photos) ? req.body.photos : current.photos,
    };

    if (req.body.heroImage) {
      updated.heroImage = req.body.heroImage;
    } else if (updated.photos && updated.photos.length > 0) {
      updated.heroImage = updated.photos[0];
    }

    activeProjects[idx] = updated;
    saveProjectsStore(activeProjects);

    // Sync project name in properties if changed
    if (req.body.name && req.body.name !== current.name) {
      activeProperties.forEach((prop) => {
        if (prop.projectId === current.id) {
          prop.projectName = req.body.name;
        }
      });
      savePropertiesStore(activeProperties);
    }

    res.json({ success: true, project: updated, message: 'Proyecto actualizado exitosamente' });
  } catch (err: any) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

// DELETE /api/crm/projects/:id
app.delete('/api/crm/projects/:id', verifyCrmAuth, (req, res) => {
  try {
    const idx = activeProjects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const removed = activeProjects.splice(idx, 1)[0];
    saveProjectsStore(activeProjects);

    // Unlink properties associated with this project
    activeProperties.forEach((prop) => {
      if (prop.projectId === removed.id) {
        prop.projectId = null;
        prop.projectName = 'Independiente / No asociado';
      }
    });
    savePropertiesStore(activeProperties);

    res.json({ success: true, message: `Proyecto ${removed.name} eliminado exitosamente` });
  } catch (err: any) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// --- PROTECTED APIS (CRM) FOR PROPERTIES ---

// POST /api/crm/properties
app.post('/api/crm/properties', verifyCrmAuth, (req, res) => {
  try {
    const {
      name,
      projectId,
      type,
      location,
      price,
      status,
      area,
      bedrooms,
      bathrooms,
      description,
      photos,
      featured,
    } = req.body;

    if (!name || !price || !type) {
      return res.status(400).json({ error: 'Nombre, tipo y precio de la propiedad son obligatorios.' });
    }

    let resolvedProjectName = 'Independiente / No asociado';
    if (projectId) {
      const parentProj = activeProjects.find((p) => p.id === projectId);
      if (parentProj) {
        resolvedProjectName = parentProj.name;
      }
    }

    const id = 'prop-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000);

    const newProperty: ServerProperty = {
      id,
      name: name.trim(),
      projectId: projectId || null,
      projectName: resolvedProjectName,
      type: type || 'Casa',
      location: location || 'Cartago, Valle del Cauca',
      price: Number(price) || 0,
      status: status || 'Disponible',
      area: Number(area) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      description: description || '',
      photos: Array.isArray(photos) && photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    activeProperties.unshift(newProperty);
    savePropertiesStore(activeProperties);

    res.status(201).json({ success: true, property: newProperty, message: 'Propiedad creada exitosamente' });
  } catch (err: any) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Error al crear propiedad' });
  }
});

// PUT /api/crm/properties/:id
app.put('/api/crm/properties/:id', verifyCrmAuth, (req, res) => {
  try {
    const idx = activeProperties.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const current = activeProperties[idx];

    let resolvedProjectName = current.projectName;
    if (req.body.projectId !== undefined) {
      if (req.body.projectId) {
        const parentProj = activeProjects.find((p) => p.id === req.body.projectId);
        resolvedProjectName = parentProj ? parentProj.name : 'Proyecto Desconocido';
      } else {
        resolvedProjectName = 'Independiente / No asociado';
      }
    }

    const updated: ServerProperty = {
      ...current,
      ...req.body,
      id: current.id,
      projectName: resolvedProjectName,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      area: req.body.area !== undefined ? Number(req.body.area) : current.area,
      bedrooms: req.body.bedrooms !== undefined ? Number(req.body.bedrooms) : current.bedrooms,
      bathrooms: req.body.bathrooms !== undefined ? Number(req.body.bathrooms) : current.bathrooms,
      photos: Array.isArray(req.body.photos) ? req.body.photos : current.photos,
    };

    activeProperties[idx] = updated;
    savePropertiesStore(activeProperties);

    res.json({ success: true, property: updated, message: 'Propiedad actualizada exitosamente' });
  } catch (err: any) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: 'Error al actualizar propiedad' });
  }
});

// DELETE /api/crm/properties/:id
app.delete('/api/crm/properties/:id', verifyCrmAuth, (req, res) => {
  try {
    const idx = activeProperties.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const removed = activeProperties.splice(idx, 1)[0];
    savePropertiesStore(activeProperties);

    res.json({ success: true, message: `Propiedad ${removed.name} eliminada exitosamente` });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Error al eliminar propiedad' });
  }
});

// Initialize Gemini Client Lazy
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Chatbot con Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Eres Mariana, la asesora virtual oficial y cordial de Marin & Salgado Construcciones S.A.S. en Cartago, Valle del Cauca, Colombia.
Tu labor es orientar a las familias interesadas en comprar vivienda de interés social (VIS) estilo premium, explicarles subsidios y guiarlos para agendar una cita o postularse.

NUESTROS PROYECTOS EN CARTAGO:
1. Urbanización Los Álamos:
   - Sector Norte, Cartago (alta valorización, conexión hacia Pereira).
   - Casas VIS unifamiliares desde 65 m² hasta 78 m².
   - 3 habitaciones, 2 baños, parqueaderos, senderos ecológicos, parque infantil.
   - Preventa Etapa 1, entrega 2025.
   - Precios desde 135 SMMLV (~$195.750.000 COP).
2. Residencial El Samán:
   - Vía Zaragoza, Cartago (a sólo 8 min del C.C. Nuestro Cartago).
   - Apartamentos VIS en conjunto cerrado de 48 m² y 54 m².
   - 2 y 3 habitaciones, 1 y 2 baños, balcón, piscina, salón social, portería 24h.
   - Precios desde 110 SMMLV (~$159.500.000 COP). Ventas abiertas, obra en marcha (Fase 1).

SUBSIDIOS Y FINANCIACIÓN VIS EN COLOMBIA:
- Mi Casa Ya: Subsidio del Gobierno Nacional de hasta 30 SMMLV ($43.500.000 COP) para grupos Sisbén A1 a C8, o 20 SMMLV ($29.000.000 COP) para C9 a D20.
- Caja de Compensación: Subsidio de hasta 30 SMMLV (Comfamiliar Risaralda, Comfandi, etc.) para hogares con ingresos hasta 2 SMMLV.
- Concurrencia de Subsidios: Se pueden sumar ambos subsidios hasta 50 SMMLV (~$72.500.000 COP) si los ingresos son menores a 2 SMMLV.
- Cobertura a la tasa FRECH: Descuento de 4% a 5% efectivo anual en los intereses del crédito hipotecario durante los primeros 7 años, bajando significativamente la cuota mensual.

DATOS CORPORATIVOS:
- Dirección: Cra 6 # 14-55, Cartago, Valle del Cauca.
- Teléfono y WhatsApp: 3226374991.
- Correo: marinysalgadoconstrucciones@gmail.com.
- Gerente de Proyectos: Carolina Salgado (más de 10 años de experiencia en VIS).

PAUTAS DE RESPUESTA:
- Habla siempre en español con tono cálido, profesional y motivador.
- Sé concisa (1-3 párrafos cortos).
- Si el usuario comparte su nombre, teléfono o correo, agradécele y confirma que los datos se han registrado para que un asesor humano lo contacte.
- Siempre ofrece la opción de simular en la calculadora interactiva de la página o escribir directo al WhatsApp 3226374991.`;

    if (ai) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || 'Con gusto te asesoro. ¿Deseas información sobre Los Álamos, El Samán o los subsidios Mi Casa Ya?';
        return res.json({ reply });
      } catch (geminiError: any) {
        console.warn('Gemini API call fallback:', geminiError?.message);
        // Fallback to intelligent local responses if API fails or quota exceeded
      }
    }

    // Intelligent local fallback if GEMINI_API_KEY is not yet active
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('alamos') || lower.includes('álamos') || lower.includes('casa')) {
      reply = '¡Excelente elección! Urbanización Los Álamos ofrece casas VIS unifamiliares de 65 m² y 78 m² en el Sector Norte de Cartago, con 3 habitaciones, 2 baños y parqueadero. Aplica subsidios Mi Casa Ya y Cajas de Compensación. ¿Te gustaría agendar una visita o simular tu cuota mensual?';
    } else if (lower.includes('saman') || lower.includes('samán') || lower.includes('apartamento')) {
      reply = 'Residencial El Samán está ubicado en la Vía Zaragoza a 8 min del CC Nuestro Cartago. Cuenta con apartamentos de 2 y 3 habitaciones (48 m² y 54 m²), piscina y zonas verdes, desde 110 SMMLV. ¡Puedes separar el tuyo con subsidios vigentes!';
    } else if (lower.includes('subsidio') || lower.includes('mi casa ya') || lower.includes('caja')) {
      reply = 'En Marin & Salgado te ayudamos a gestionar los subsidios: Mi Casa Ya (hasta 30 SMMLV según Sisbén) y Caja de Compensación (hasta 30 SMMLV). Además, con la concurrencia puedes sumar hasta 50 SMMLV ($72.500.000 COP) para tu cuota inicial. ¿En qué rango de ingresos se encuentra tu hogar?';
    } else if (lower.includes('precio') || lower.includes('tasa') || lower.includes('cuota') || lower.includes('calcular')) {
      reply = 'Puedes usar nuestra Calculadora VIS interactiva en esta página para ver tu cuota mensual estimada según las tasas actuales y el subsidio a la tasa FRECH. Los proyectos inician desde 110 SMMLV (El Samán) y 135 SMMLV (Los Álamos).';
    } else if (lower.includes('contacto') || lower.includes('telefono') || lower.includes('whatsapp') || lower.includes('donde') || lower.includes('oficina')) {
      reply = 'Nuestras oficinas están en la Cra 6 # 14-55, Cartago, Valle del Cauca. También puedes comunicarte de inmediato a nuestro WhatsApp o teléfono: 3226374991. ¡Estamos listos para atenderte!';
    } else {
      reply = '¡Hola! Con mucho gusto te oriento. En Marin & Salgado Construcciones desarrollamos Residencial El Samán y Urbanización Los Álamos en Cartago con subsidios VIS. ¿Te gustaría conocer detalles de los proyectos, simular tu crédito o agendar una llamada con un asesor?';
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

// Helper: Forward data to Google Apps Script Webhook
async function forwardToGoogleSheet(
  action: 'lead' | 'pqrs',
  data: any,
  overrideUrl?: string
): Promise<{ success: boolean; message: string; statusCode?: number; details?: any }> {
  const targetUrl = (overrideUrl || activeGoogleSheetWebhookUrl || '').trim();

  if (!targetUrl) {
    return {
      success: false,
      message: 'No hay ninguna URL de Google Apps Script configurada. Por favor ingresa la URL del Webhook generada en tu hoja de cálculo.',
    };
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return {
      success: false,
      message: 'La URL ingresada no es válida. Debe comenzar con https://',
    };
  }

  if (targetUrl.includes('docs.google.com/spreadsheets')) {
    return {
      success: false,
      message:
        'Has ingresado el enlace de visualización de la hoja de cálculo (docs.google.com) en lugar de la Aplicación Web. Para conectar el Webhook, ve en tu hoja a Extensiones > Apps Script > Implementar > Nueva implementación > Tipo: Aplicación web > Configura "Quién tiene acceso: Cualquier usuario" > Copia el enlace que termina en /exec.',
    };
  }

  try {
    const isTest = Boolean(data.isTest);
    const timestamp = data.createdAt || data.timestamp || new Date().toISOString();

    // Normalizar etiqueta en español del canal de origen
    const rawSource = (data.origen || data.source || data.canal || '').toString().toLowerCase();
    let canalLabel = 'Formulario Web de Contacto';
    if (rawSource.includes('calc')) {
      canalLabel = 'Calculadora Financiera VIS';
    } else if (rawSource.includes('chat')) {
      canalLabel = 'Chatbot Asistente Mariana';
    } else if (rawSource.includes('pqrs')) {
      canalLabel = 'Portal Web PQRS';
    } else if (rawSource.includes('crm') || rawSource.includes('manual')) {
      canalLabel = 'Gestión Comercial CRM';
    } else if (data.origen || data.source) {
      canalLabel = data.origen || data.source;
    }

    const payload: any = {
      action,
      accion: action,
      timestamp,
      fechaHora: timestamp,
      ...data,
      id: data.id || `lead-${Date.now()}`,
      idProspecto: data.id || `lead-${Date.now()}`,
      nombre: data.nombre || data.name || (isTest ? 'Prueba de Conexión CRM' : ''),
      name: data.nombre || data.name || (isTest ? 'Prueba de Conexión CRM' : ''),
      nombreCompleto: data.nombre || data.name || (isTest ? 'Prueba de Conexión CRM' : ''),
      telefono: data.telefono || data.phone || (isTest ? '3226374991' : ''),
      phone: data.telefono || data.phone || (isTest ? '3226374991' : ''),
      celular: data.telefono || data.phone || (isTest ? '3226374991' : ''),
      email: data.email || data.correo || (isTest ? 'contacto@marinysalgado.com' : ''),
      correo: data.email || data.correo || (isTest ? 'contacto@marinysalgado.com' : ''),
      correoElectronico: data.email || data.correo || (isTest ? 'contacto@marinysalgado.com' : ''),
      proyecto: data.proyecto || data.project || (isTest ? 'Urbanización Los Álamos' : 'Consulta General'),
      project: data.proyecto || data.project || (isTest ? 'Urbanización Los Álamos' : 'Consulta General'),
      subsidio: data.subsidio || data.subsidyStatus || (isTest ? 'Sisbén IV + Comfamiliar (Mi Casa Ya)' : 'No especificado'),
      subsidyStatus: data.subsidio || data.subsidyStatus || (isTest ? 'Sisbén IV + Comfamiliar (Mi Casa Ya)' : 'No especificado'),
      origen: canalLabel,
      source: canalLabel,
      canal: canalLabel,
      estado: data.estado || data.status || 'Nuevo',
      status: data.estado || data.status || 'Nuevo',
      mensaje: data.mensaje || data.message || (isTest ? 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.' : ''),
      message: data.mensaje || data.message || (isTest ? 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.' : ''),
      precioVivienda: data.precioVivienda || (data.calculatorDetails?.totalHousePrice ? `$${Number(data.calculatorDetails.totalHousePrice).toLocaleString('es-CO')} COP` : (isTest ? '$195.750.000 COP' : '')),
      subsidioTotal: data.subsidioTotal || (data.calculatorDetails?.totalSubsidies ? `$${Number(data.calculatorDetails.totalSubsidies).toLocaleString('es-CO')} COP` : (isTest ? '$72.500.000 COP' : '')),
      cuotaMensual: data.cuotaMensual || (data.calculatorDetails?.monthlyPayment ? `$${Number(data.calculatorDetails.monthlyPayment).toLocaleString('es-CO')} COP` : (isTest ? '$980.000 COP' : '')),
      plazoAnos: data.plazoAnos || data.calculatorDetails?.termYears || (isTest ? 20 : ''),
      creditoMonto: data.creditoMonto || (data.calculatorDetails?.loanAmount ? `$${Number(data.calculatorDetails.loanAmount).toLocaleString('es-CO')} COP` : (isTest ? '$123.250.000 COP' : '')),
      notas: data.notas || (Array.isArray(data.notes) ? data.notes.map((n: any) => `[${n.author}]: ${n.text}`).join(' | ') : ''),
    };

    if (action === 'pqrs') {
      const radicadoVal = data.radicado || data.radicadoCode || data.numeroRadicado || (isTest ? `PQRS-${new Date().getFullYear()}-001` : `PQRS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      payload.radicado = radicadoVal;
      payload.radicadoCode = radicadoVal;
      payload.numeroRadicado = radicadoVal;
      payload.tipo = data.tipo || data.type || data.tipoPqrs || 'Petición';
      payload.tipoPqrs = data.tipo || data.type || data.tipoPqrs || 'Petición';
      payload.origen = data.origen || data.canal || 'Portal Web PQRS';
      payload.canal = data.origen || data.canal || 'Portal Web PQRS';
      payload.diasTerminoLegal = data.diasTerminoLegal || data.legalDeadlineDays || 15;
      payload.respuestaOficial = data.respuestaOficial || data.respuesta || data.officialResponse || '';
      payload.respondidoPor = data.respondidoPor || data.funcionario || data.respondedBy || '';
      payload.fechaRespuesta = data.fechaRespuesta || data.respondedAt || '';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const responseText = await response.text();

    if (
      responseText.includes('accounts.google.com') ||
      responseText.includes('Sign in - Google Accounts') ||
      responseText.includes('ServiceLogin')
    ) {
      return {
        success: false,
        statusCode: response.status,
        message:
          'Permiso denegado por Google: En Apps Script debes configurar "Quién tiene acceso" (Who has access) en "Cualquier usuario" (Anyone) para permitir el registro sin inicio de sesión.',
      };
    }

    let jsonResult: any = null;
    try {
      jsonResult = JSON.parse(responseText);
    } catch {
      // Not JSON output
    }

    if (jsonResult && (jsonResult.status === 'error' || jsonResult.estado === 'error')) {
      return {
        success: false,
        statusCode: response.status,
        message: `Google Apps Script reportó un error: ${jsonResult.mensaje || jsonResult.message || 'Verifica que la hoja exista y tenga permisos.'}`,
      };
    }

    if (response.ok || (jsonResult && (jsonResult.status === 'success' || jsonResult.estado === 'exito'))) {
      return {
        success: true,
        statusCode: response.status,
        message: isTest
          ? '¡Fila de prueba enviada y registrada con éxito en tu Google Sheet! Revisa la pestaña "Prospectos_Leads" en tu hoja de cálculo.'
          : 'Registro guardado y escrito directamente en Google Sheets con éxito.',
        details: jsonResult,
      };
    }

    return {
      success: false,
      statusCode: response.status,
      message: `Error al conectar con Google Sheets (HTTP ${response.status}). Verifica que la URL termine en /exec y que el despliegue esté activo.`,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        message: 'Tiempo de espera agotado al conectar con Google Apps Script (más de 18s). Verifica la URL del Webhook.',
      };
    }
    console.warn('Google Sheet Webhook notification error:', err?.message);
    return {
      success: false,
      message: `Fallo de conexión con Google: ${err?.message || 'Verifica la URL del Webhook.'}`,
    };
  }
}

// 2. Auth: Iniciar Sesión en Portal CRM
app.post('/api/crm/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  const staff = STAFF_ACCOUNTS.find(
    (s) =>
      (s.username.toLowerCase() === String(username).toLowerCase().trim() ||
        s.id === String(username).trim()) &&
      s.password === String(password).trim()
  );

  if (!staff) {
    return res.status(401).json({ error: 'Credenciales inválidas. Verifique usuario o contraseña.' });
  }

  res.json({
    success: true,
    user: {
      id: staff.id,
      username: staff.username,
      name: staff.name,
      role: staff.role,
      token: staff.token,
    },
  });
});

// 3. Auth: Verificar Sesión Activa
app.get('/api/crm/auth/verify', verifyCrmAuth, (req, res) => {
  const user = (req as any).user;
  res.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      token: user.token,
    },
  });
});

// 4. API: Registrar nuevo Lead desde la Landing (Contacto, Calculadora, Chatbot)
app.post('/api/crm/lead', async (req, res) => {
  try {
    const name = req.body.nombre || req.body.name || req.body.nombreCompleto;
    const phone = req.body.telefono || req.body.phone || req.body.celular || req.body.whatsapp;
    const email = req.body.correo || req.body.email || req.body.correoElectronico;
    const project = req.body.proyecto || req.body.project || req.body.proyectoInteres;
    const source = req.body.origen || req.body.source || req.body.canal;
    const message = req.body.mensaje || req.body.message || req.body.descripcion;
    const subsidyStatus = req.body.subsidio || req.body.subsidyStatus || req.body.estadoSisben;
    const calculatorDetails = req.body.detallesCalculadora || req.body.calculatorDetails;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
    }

    const newLead: CRMLeadStore = {
      id: `lead-${Date.now()}`,
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone).trim(),
      project: String(project || 'Consulta General').trim(),
      subsidyStatus: String(subsidyStatus || 'En validación / Requiere asesoría').trim(),
      source: source || 'formulario',
      status: 'Nuevo',
      message: message ? String(message).trim() : undefined,
      calculatorDetails: calculatorDetails || undefined,
      createdAt: new Date().toISOString(),
      syncedToGoogleSheet: false,
      notes: [],
    };

    // Forward to Google Sheets Webhook with direct write
    const syncResult = await forwardToGoogleSheet('lead', {
      id: newLead.id,
      nombre: newLead.name,
      telefono: newLead.phone,
      email: newLead.email,
      proyecto: newLead.project,
      subsidio: newLead.subsidyStatus,
      origen: newLead.source,
      estado: newLead.status,
      mensaje: newLead.message || '',
      calculatorDetails: newLead.calculatorDetails,
      precioVivienda: req.body.precioVivienda || (newLead.calculatorDetails?.totalHousePrice ? `$${Number(newLead.calculatorDetails.totalHousePrice).toLocaleString('es-CO')} COP` : ''),
      subsidioTotal: req.body.subsidioTotal || (newLead.calculatorDetails?.totalSubsidies ? `$${Number(newLead.calculatorDetails.totalSubsidies).toLocaleString('es-CO')} COP` : ''),
      cuotaMensual: req.body.cuotaMensual || (newLead.calculatorDetails?.monthlyPayment ? `$${Number(newLead.calculatorDetails.monthlyPayment).toLocaleString('es-CO')} COP` : ''),
      plazoAnos: req.body.plazoAnos || newLead.calculatorDetails?.termYears || '',
      creditoMonto: req.body.creditoMonto || (newLead.calculatorDetails?.loanAmount ? `$${Number(newLead.calculatorDetails.loanAmount).toLocaleString('es-CO')} COP` : ''),
    });

    newLead.syncedToGoogleSheet = syncResult.success;
    crmLeads.unshift(newLead);
    return res.json({ success: true, lead: newLead, syncResult });
  } catch (error: any) {
    console.error('Error creating CRM lead:', error);
    res.status(500).json({ error: 'Error al registrar el lead en CRM' });
  }
});

// 5. API: Radicar nueva PQRS desde la Web Pública
app.post('/api/crm/pqrs', async (req, res) => {
  try {
    const type = req.body.tipo || req.body.type || req.body.tipoPqrs || 'Petición';
    const name = req.body.nombre || req.body.name || req.body.nombreCompleto || req.body.ciudadano;
    const phone = req.body.telefono || req.body.phone || req.body.celular || req.body.whatsapp;
    const email = req.body.correo || req.body.email || req.body.correoElectronico;
    const project = req.body.proyecto || req.body.project || req.body.proyectoRelacionado;
    const message = req.body.mensaje || req.body.message || req.body.descripcion;
    const source = req.body.origen || req.body.source || req.body.canal || 'Portal Web PQRS';

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Nombre, teléfono y descripción son requeridos' });
    }

    const radicadoSequence = Math.floor(100 + Math.random() * 900);
    const radicadoCode = `PQRS-${new Date().getFullYear()}-${radicadoSequence}`;

    const newPqrs: PQRSStore = {
      id: `pqrs-${Date.now()}`,
      radicadoCode,
      type: type || 'Petición',
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email || '').trim(),
      project: String(project || 'General').trim(),
      message: String(message).trim(),
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      legalDeadlineDays: 15,
      syncedToGoogleSheet: false,
    };

    // Forward to Google Sheets Webhook with direct write
    const syncResult = await forwardToGoogleSheet('pqrs', {
      radicado: newPqrs.radicadoCode,
      tipo: newPqrs.type,
      nombre: newPqrs.name,
      telefono: newPqrs.phone,
      email: newPqrs.email,
      proyecto: newPqrs.project,
      mensaje: newPqrs.message,
      origen: source,
      estado: newPqrs.status,
      diasTerminoLegal: 15,
    });

    newPqrs.syncedToGoogleSheet = syncResult.success;
    pqrsStore.unshift(newPqrs);

    return res.json({ success: true, pqrs: newPqrs, radicadoCode, syncResult });
  } catch (error: any) {
    console.error('Error creating PQRS:', error);
    res.status(500).json({ error: 'Error al radicar PQRS' });
  }
});

// 6. PROTECTED: Métricas & Analítica del Dashboard Principal
app.get('/api/crm/stats', verifyCrmAuth, (req, res) => {
  const totalLeads = crmLeads.length;
  const pendingPqrs = pqrsStore.filter((p) => p.status !== 'Respondida / Cerrada').length;
  const contactedLeads = crmLeads.filter(
    (l) => l.status === 'Contactado' || l.status === 'Cita Agendada'
  ).length;
  const inProgressSales = crmLeads.filter(
    (l) => l.status === 'En trámite de crédito' || l.status === 'Venta Cerrada'
  ).length;

  // By Project
  const byProject = {
    alamos: crmLeads.filter((l) => l.project.includes('Álamos') || l.project.includes('Alamos')).length,
    saman: crmLeads.filter((l) => l.project.includes('Samán') || l.project.includes('Saman')).length,
    general: crmLeads.filter((l) => !l.project.includes('Álamos') && !l.project.includes('Samán')).length,
  };

  // By Source
  const bySource = {
    formulario: crmLeads.filter((l) => l.source === 'formulario').length,
    calculadora: crmLeads.filter((l) => l.source === 'calculadora').length,
    chatbot: crmLeads.filter((l) => l.source === 'chatbot').length,
    pqrs: pqrsStore.length,
  };

  // By Status
  const byStatus: Record<string, number> = {
    Nuevo: crmLeads.filter((l) => l.status === 'Nuevo').length,
    Contactado: crmLeads.filter((l) => l.status === 'Contactado').length,
    'Cita Agendada': crmLeads.filter((l) => l.status === 'Cita Agendada').length,
    'En trámite de crédito': crmLeads.filter((l) => l.status === 'En trámite de crédito').length,
    'Venta Cerrada': crmLeads.filter((l) => l.status === 'Venta Cerrada').length,
    Descartado: crmLeads.filter((l) => l.status === 'Descartado').length,
  };

  res.json({
    kpis: {
      totalLeads,
      pendingPqrs,
      contactedLeads,
      inProgressSales,
    },
    byProject,
    bySource,
    byStatus,
    googleSheetWebhookConfigured: Boolean(activeGoogleSheetWebhookUrl),
  });
});

// 7. PROTECTED: Obtener todos los Leads del CRM
app.get('/api/crm/leads', verifyCrmAuth, (req, res) => {
  res.json({
    leads: crmLeads,
    total: crmLeads.length,
    googleSheetWebhookUrl: activeGoogleSheetWebhookUrl,
  });
});

// 8. PROTECTED: Actualizar estado de Lead
app.patch('/api/crm/lead/:id', verifyCrmAuth, async (req, res) => {
  const { id } = req.params;
  const { status, estado, message, mensaje } = req.body;
  const lead = crmLeads.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead no encontrado' });
  }
  if (status || estado) lead.status = (status || estado);
  if (message !== undefined || mensaje !== undefined) lead.message = message !== undefined ? message : mensaje;

  // Actualización directa en Google Sheets
  forwardToGoogleSheet('lead', {
    id: lead.id,
    nombre: lead.name,
    telefono: lead.phone,
    email: lead.email,
    proyecto: lead.project,
    subsidio: lead.subsidyStatus,
    origen: lead.source,
    estado: lead.status,
    mensaje: lead.message || '',
    notas: lead.notes.map((n) => `[${n.author}]: ${n.text}`).join(' | '),
  }).catch((err) => console.warn('Sync lead status update error:', err));

  res.json({ success: true, lead });
});

// 9. PROTECTED: Agregar nota de historial y seguimiento a un Lead
app.post('/api/crm/lead/:id/notes', verifyCrmAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = (req as any).user;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Texto de la nota requerido' });
  }

  const lead = crmLeads.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ error: 'Lead no encontrado' });
  }

  const newNote: CRMLeadNote = {
    id: `note-${Date.now()}`,
    author: user.name || 'Asesor Comercial',
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  lead.notes.unshift(newNote);

  // Actualización directa de notas en Google Sheets
  forwardToGoogleSheet('lead', {
    id: lead.id,
    nombre: lead.name,
    telefono: lead.phone,
    email: lead.email,
    proyecto: lead.project,
    subsidio: lead.subsidyStatus,
    origen: lead.source,
    estado: lead.status,
    mensaje: lead.message || '',
    notas: lead.notes.map((n) => `[${n.author}]: ${n.text}`).join(' | '),
  }).catch((err) => console.warn('Sync lead note error:', err));

  res.json({ success: true, note: newNote, lead });
});

// 10. PROTECTED: Obtener todas las PQRS
app.get('/api/crm/pqrs', verifyCrmAuth, (req, res) => {
  // Compute days passed and deadline indicators
  const enrichedPqrs = pqrsStore.map((item) => {
    const createdDate = new Date(item.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, item.legalDeadlineDays - daysPassed);
    const isOverdue = daysPassed > item.legalDeadlineDays && item.status !== 'Respondida / Cerrada';

    return {
      ...item,
      daysPassed,
      daysRemaining,
      isOverdue,
    };
  });

  res.json({ pqrs: enrichedPqrs, total: pqrsStore.length });
});

// 11. PROTECTED: Responder formalmente y cerrar una PQRS
app.post('/api/crm/pqrs/:id/respond', verifyCrmAuth, async (req, res) => {
  const { id } = req.params;
  const { officialResponse, status } = req.body;
  const user = (req as any).user;

  if (!officialResponse || typeof officialResponse !== 'string' || !officialResponse.trim()) {
    return res.status(400).json({ error: 'La respuesta formal es obligatoria' });
  }

  const pqrs = pqrsStore.find((p) => p.id === id);
  if (!pqrs) {
    return res.status(404).json({ error: 'PQRS no encontrada' });
  }

  pqrs.officialResponse = officialResponse.trim();
  pqrs.status = status || 'Respondida / Cerrada';
  pqrs.respondedAt = new Date().toISOString();
  pqrs.respondedBy = `${user.name} (${user.role})`;

  // Forward response update to Google Sheets if configured
  await forwardToGoogleSheet('pqrs', {
    radicado: pqrs.radicadoCode,
    estado: pqrs.status,
    respuestaOficial: pqrs.officialResponse,
    respondidoPor: pqrs.respondedBy,
    fechaRespuesta: pqrs.respondedAt,
  });

  res.json({ success: true, pqrs });
});

// 12. PROTECTED: Sincronizar con Google Sheets Webhook
app.post('/api/crm/sync-sheet', verifyCrmAuth, async (req, res) => {
  try {
    const { webhookUrl, testLead } = req.body;
    if (webhookUrl && typeof webhookUrl === 'string') {
      activeGoogleSheetWebhookUrl = webhookUrl.trim();
    }

    if (!activeGoogleSheetWebhookUrl) {
      return res.status(400).json({ error: 'Por favor ingresa la URL del Webhook de Google Sheets' });
    }

    let syncedLeadsCount = 0;
    let syncedPqrsCount = 0;

    if (testLead) {
      const targetUrl = (webhookUrl || activeGoogleSheetWebhookUrl || '').trim();
      const enrichedTestLead = {
        isTest: true,
        id: testLead.id || `lead-test-${Date.now()}`,
        nombre: testLead.nombre || testLead.name || 'Prueba de Conexión CRM',
        name: testLead.nombre || testLead.name || 'Prueba de Conexión CRM',
        telefono: testLead.telefono || testLead.phone || '3226374991',
        phone: testLead.telefono || testLead.phone || '3226374991',
        email: testLead.email || 'contacto@marinysalgado.com',
        proyecto: testLead.proyecto || testLead.project || 'Urbanización Los Álamos',
        project: testLead.proyecto || testLead.project || 'Urbanización Los Álamos',
        subsidio: testLead.subsidio || testLead.subsidyStatus || 'Sisbén IV + Comfamiliar (Mi Casa Ya)',
        subsidyStatus: testLead.subsidio || testLead.subsidyStatus || 'Sisbén IV + Comfamiliar (Mi Casa Ya)',
        origen: testLead.origen || testLead.source || 'formulario',
        source: testLead.origen || testLead.source || 'formulario',
        estado: testLead.estado || testLead.status || 'Nuevo',
        status: testLead.estado || testLead.status || 'Nuevo',
        mensaje: testLead.mensaje || testLead.message || 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.',
        message: testLead.mensaje || testLead.message || 'Fila de prueba generada desde el panel administrativo de Marín & Salgado.',
        precioVivienda: testLead.precioVivienda || '$195.750.000 COP',
        subsidioTotal: testLead.subsidioTotal || '$72.500.000 COP',
        cuotaMensual: testLead.cuotaMensual || '$980.000 COP',
        plazoAnos: testLead.plazoAnos || 20,
        creditoMonto: testLead.creditoMonto || '$123.250.000 COP',
        notas: '[Sistema]: Fila de prueba enviada para verificar conectividad con Google Sheets.',
      };

      const result = await forwardToGoogleSheet('lead', enrichedTestLead, targetUrl);
      if (result.success && targetUrl) {
        activeGoogleSheetWebhookUrl = targetUrl;
        saveSheetConfig(activeGoogleSheetWebhookUrl);
      }
      return res.json({
        success: result.success,
        message: result.message,
        statusCode: result.statusCode,
        details: result.details,
      });
    }

    // Sync unsynced leads
    for (const lead of crmLeads.filter((l) => !l.syncedToGoogleSheet)) {
      const result = await forwardToGoogleSheet('lead', {
        id: lead.id,
        nombre: lead.name,
        telefono: lead.phone,
        email: lead.email,
        proyecto: lead.project,
        subsidio: lead.subsidyStatus,
        origen: lead.source,
        estado: lead.status,
        mensaje: lead.message || '',
      });
      if (result.success) {
        lead.syncedToGoogleSheet = true;
        syncedLeadsCount++;
      }
    }

    // Sync unsynced PQRS
    for (const item of pqrsStore.filter((p) => !p.syncedToGoogleSheet)) {
      const result = await forwardToGoogleSheet('pqrs', {
        radicado: item.radicadoCode,
        tipo: item.type,
        nombre: item.name,
        telefono: item.phone,
        email: item.email,
        proyecto: item.project,
        mensaje: item.message,
        estado: item.status,
        diasTerminoLegal: 15,
      });
      if (result.success) {
        item.syncedToGoogleSheet = true;
        syncedPqrsCount++;
      }
    }

    res.json({
      success: true,
      syncedCount: syncedLeadsCount + syncedPqrsCount,
      syncedLeadsCount,
      syncedPqrsCount,
      webhookUrl: activeGoogleSheetWebhookUrl,
      message: `Se sincronizaron ${syncedLeadsCount} prospecto(s) y ${syncedPqrsCount} PQRS exitosamente con Google Sheets`,
    });
  } catch (error: any) {
    console.error('Error in /api/crm/sync-sheet:', error);
    res.status(500).json({ error: 'Error al sincronizar con Google Sheets' });
  }
});

// 13. PROTECTED: Obtener y actualizar Configuración de Google Sheet
app.get('/api/crm/sheet-config', verifyCrmAuth, (req, res) => {
  res.json({
    webhookUrl: activeGoogleSheetWebhookUrl,
    totalLeads: crmLeads.length,
    syncedLeads: crmLeads.filter((l) => l.syncedToGoogleSheet).length,
    totalPqrs: pqrsStore.length,
    syncedPqrs: pqrsStore.filter((p) => p.syncedToGoogleSheet).length,
  });
});

app.post('/api/crm/sheet-config', verifyCrmAuth, (req, res) => {
  const { webhookUrl } = req.body;
  if (typeof webhookUrl === 'string') {
    activeGoogleSheetWebhookUrl = webhookUrl.trim();
    saveSheetConfig(activeGoogleSheetWebhookUrl);
  }
  res.json({
    success: true,
    webhookUrl: activeGoogleSheetWebhookUrl,
  });
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Marin & Salgado Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
