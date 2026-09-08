import { Project, ServiceItem } from '../types';

export const SMMLV_CURRENT = 1450000; // SMMLV aproximado Colombia (actual)

export const PROJECTS: Project[] = [
  {
    id: 'urbanizacion-los-alamos',
    name: 'Urbanización Los Álamos',
    location: 'Cartago, Sector Norte - Valle del Cauca',
    zone: 'norte',
    type: 'casa',
    typeName: 'Casa VIS Unifamiliar',
    priceSMMLV: 135,
    priceCOP: 195750000,
    areaMin: 65,
    areaMax: 78,
    bedrooms: '3 Habitaciones',
    bathrooms: '2 Baños',
    parking: 'Privado y Comunal',
    stage: 'En Preventa // Etapa 1',
    deliveryYear: '2025',
    statusText: 'Proyecto VIS',
    heroImage: 'https://lh3.googleusercontent.com/aida/AEtjO1WzmJjPEXcy05boPwamPvH-RWmZKkSpQIrpjrSpv6Q4LxVKYDdbK8PsmSECyKZdMmdzlPQh6V9yLAfEc2xGQHGsSe8I0m0UWUmXzxGu3Xl8JvkywVC4T_dAfB5eIjOkLwsyrNM0anNa6fgF3Lrwpyp5jahAzYzgrbqGfbPEn-NQxpWqM12_2hieP00HAIlF70_a7FnayH5LTZQvSg0tK8myZNUm6bQeR2Wz3mLFm2f6FToCFuYZUwCS4w',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHqJ_ir118AcH2J-Cod5Xvu0dujaPr8RzDy1_XflOrw2CfA3y5L3TOpGamsWbxxafJiZwxMJDB_826lP-V1vRbSXorqzmOYlEnkE9qwKw5eOZNg0n-fFca5irr6ufQFj_S8pUSsCP9LCTCSp25J-wBTyaXJtDFKvmS2jR9NJazm6LaGgB6YmvF7FVMfCIOdL1AsaPH1S7t3I97-9LH96thKb98upLb8BUtQqQustYZIYuDqr8CNs8',
      'https://lh3.googleusercontent.com/aida/AEtjO1VFrhV5j_MgbF9jtQowlBY98hd68y9L8YQyV0lSbPoR14J6ff6ojnEBlirBSxbreQmoinTjJfwqRIRP7SkQDTZ13KweGSe1aW9AqCAWqK3sMNQK36iq97BOS1rJLn_ksYdZm6kmDU7H3e5G8l0r6Lt9EB-fE_n2GxYS5i0VGKssGI5tbz6y9uFJ5CkFznubskU0h44YPPP8Icrq-PiJVnUzOK0hwJqjxWmQujvHcR992AtYB6uB-qwVfA',
      'https://lh3.googleusercontent.com/aida/AEtjO1VxP_eJG42s2s-PDqU7RtZp_pB5P_51FrMIZaUWR0-7OtCeK9zvvMxWJPDdH7L93LRwU9Lk62QEl6EPNx2Ma2KQLGSCalKV3pyLnR8e-aE1ljikXg4wiuR6xi8VEKCUfUyxIBykUCnQH3xJyjwxfnu1pmUzlPpAIVHAOnfFOMwIf9_gTb7NZoHSrhi2DNzg7vmlQCKlBqgLqT5qoqNefGETm2SSR38K9lKWhaFAJHcLKrkXJTaaI7qAeA'
    ],
    description: 'Urbanización Los Álamos combina armonía natural y arquitectura contemporánea en el Sector Norte de Cartago. Casas unifamiliares y bifamiliares diseñadas con amplios espacios, ventilación cruzada e iluminación natural, pensadas para el bienestar y la proyección de tu familia aplicando a subsidios VIS.',
    shortDescription: 'Casas unifamiliares con acabados premium y diseño sismorresistente en el sector de mayor valorización.',
    features: [
      {
        icon: 'location_on',
        title: 'Sector Norte de Alta Valorización',
        description: 'Vías pavimentadas y conexión expedita hacia Pereira y centro de Cartago.'
      },
      {
        icon: 'park',
        title: 'Zonas Verdes y Parques',
        description: 'Senderos ecológicos, parque biosaludable y juegos infantiles seguros.'
      },
      {
        icon: 'directions_car',
        title: 'Parqueaderos y Accesos',
        description: 'Parqueaderos privados y comunales con bahías de acceso amplio.'
      },
      {
        icon: 'verified',
        title: 'Aplica Subsidio Mi Casa Ya',
        description: 'Aplica a subsidios del gobierno nacional y cajas de compensación familiar.'
      }
    ],
    floorPlans: [
      {
        id: 'plan-alamos-65',
        title: 'Casa Tipo A - 65 m²',
        area: '65 m²',
        rooms: '3 Habitaciones',
        baths: '2 Baños',
        image: 'https://lh3.googleusercontent.com/aida/AEtjO1V_SyP-2BMzwEiJ7yhRUCie_y6GoPLlqXSkqBCflX__oRKRIYb5sldUjVOiJTQA0c-AaoJNw9mUJK_9601DJxGXOMsi5z2XQrWTMiYT7VYiXiD2OVRv2whjRfi0BQKNu8YxnX0whHLmO9Vdj082fze_R52xF4iJMNfhoCfyL9ANoXsFDKmuCHUroq-GXVx0x6pX5wXUeBTYSocRKJYdm2tVhqcL7DhatQFGWR8rv502FG1rybYttFwvmQ',
        type: '3D',
        description: 'Sala-comedor integrada, cocina abierta, patio de ropas independiente y alcoba principal con baño privado.'
      },
      {
        id: 'plan-alamos-78',
        title: 'Casa Tipo B (Con Patio Ampliado) - 78 m²',
        area: '78 m²',
        rooms: '3 Habitaciones + Estudio',
        baths: '2 Baños',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBadwx1p3hyaLMMr5Ck9hLFXVxZFxdqoqdp7iTbLn8bDmc_Ji74VEYVZnmCXdn9OzgoFyZMc8Mf_l_T8vIEEEgF96kDMeLjLl5MmjfseY7sJ6CMgiBkvdoXPyhoiY1JiyPHJbLEoQVFZ7oAgHP9ILlohYl4zbIMA4WRY4rHFFhB9_JDSYNGIbCfqT6BbTF-9TRQnBORm_1_5oFQ9IkkzYUqno0fLkz92JyjNgkNE_1-kJRXRGbh79Y',
        type: '2D',
        description: 'Diseño arquitectónico con posibilidad de ampliación futura y estudio o sala de TV adicional.'
      }
    ]
  },
  {
    id: 'residencial-el-saman',
    name: 'Residencial El Samán',
    location: 'Cartago, Vía Zaragoza - Valle del Cauca',
    zone: 'zaragoza',
    type: 'apartamento',
    typeName: 'Apartamento VIS en Conjunto Cerrado',
    priceSMMLV: 110,
    priceCOP: 159500000,
    areaMin: 48,
    areaMax: 54,
    bedrooms: '2 y 3 Habitaciones',
    bathrooms: '1 y 2 Baños',
    parking: 'Bahía comunal asignada',
    stage: 'Lanzamiento // Etapa 2',
    deliveryYear: '2025 - 2026',
    statusText: 'Proyecto VIS',
    heroImage: 'https://lh3.googleusercontent.com/aida/AEtjO1W0EFz6VMqBr_kurg6YW3huRcbip6yen7I7SDtBdHs9eFgO88uk8J68rbT9s-Y_N21I3yJexaoiJtgNyGx5nzsh-Ucz1eyxp9FyHjRGrhhivRPqnSNY9PkVrlT1S_LPWkmLUQr4V7B52PyBO-pUCEtU8WHQ_bNeWeW6drF9PJrawH4CKzqMiUbite2xRyvituo4e48RoX9jWRUfWQFrZXcnarWHVTsVNXkJXhFqdti6AqlBIJV3gazvAg',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida/AEtjO1Xkm-EjabtJIXey9IG_0bEyvEUAoyl_6sgjztSSYqdgys9TucJGrxc7pMyMabIZudZ_aisUvo1s0jZum47FyImHAlPzdTftWrdpsGOvuZB5pBAuQChQycmgOsSrL2qN_Spb05HzU0_-7u3eNwUAao0fISweXtFzjaGKMEXa2Gfs0UsE8UhPyQJiIQcUdDQPCEXkmLo3z_PumjExND44r6tE2EC5LjwL5dWl0yVV6uGIE97nD0K7fq10Hg',
      'https://lh3.googleusercontent.com/aida/AEtjO1Uhw2n63djxQP4w06fDSFzqLjqk8_9pEOl3eZsXRF8jYCWk8931bdfAFmwNxzp--tYzjnuthnuTmy9Eti6bfyGRmFPe9_s-WqSjknUpCQr2NHqLVim11-fEAgtZ8gg7CfZZ7IGOuel6NIXb6SZvfNerFfJNs37EXtlGpRAdf1BasripI4nO2hRmLa_4uQlcjsAwpMXRp6PblfmgkVxRE7SY6uf5O8zgvPJ0vAqOBDdEkDWeN8D-piFegw',
      'https://lh3.googleusercontent.com/aida/AEtjO1WJNa-Rr2H-VlTOHeDwCj3Xac21-qfxghonBmcbEUoY-pfvJO2TXLosNYooOweNzxbJITIzr73I7_VAhz-1ecSAYsPHgJ8pPBs1C64mT-IXucQA6DaONTF_ajQAmZCBzfd8hEtbl67-hqzO6ov7WIHj83Mp6P22hmWpurkg-gfrZsIOB0OUDipaYS1RfKVZz4PQ9c_jkQOFlFjq0KT83gVt86UbfYOQmj18vKUhouJKQMSQr8lyrvzSKQ'
    ],
    description: 'Residencial El Samán representa una oportunidad única para consolidar el sueño de tener vivienda propia en Cartago. Ubicado sobre la estratégica Vía Zaragoza a sólo 8 minutos del C.C. Nuestro Cartago, este conjunto ofrece apartamentos con excelente distribución, ascensor por torre, salón social y zonas recreativas.',
    shortDescription: 'Apartamentos modernos de 2 y 3 alcobas con balcón y club house en conjunto cerrado.',
    features: [
      {
        icon: 'location_on',
        title: 'Ubicación Privilegiada Vía Zaragoza',
        description: 'A sólo 8 minutos del C.C. Nuestro Cartago, colegios y transporte constante.'
      },
      {
        icon: 'pool',
        title: 'Club House y Amenidades',
        description: 'Piscina para adultos y niños, salón de eventos y zonas BBQ.'
      },
      {
        icon: 'security',
        title: 'Seguridad 24/7',
        description: 'Portería con control de acceso automatizado y cerramiento perimetral.'
      },
      {
        icon: 'savings',
        title: 'Subsidio Concurrente',
        description: 'Aplica a subsidios combinados de hasta 50 SMMLV para mayor ahorro.'
      }
    ],
    floorPlans: [
      {
        id: 'plan-saman-54',
        title: 'Apartamento Tipo A - 54 m²',
        area: '54 m²',
        rooms: '3 Habitaciones',
        baths: '2 Baños',
        image: 'https://lh3.googleusercontent.com/aida/AEtjO1V_SyP-2BMzwEiJ7yhRUCie_y6GoPLlqXSkqBCflX__oRKRIYb5sldUjVOiJTQA0c-AaoJNw9mUJK_9601DJxGXOMsi5z2XQrWTMiYT7VYiXiD2OVRv2whjRfi0BQKNu8YxnX0whHLmO9Vdj082fze_R52xF4iJMNfhoCfyL9ANoXsFDKmuCHUroq-GXVx0x6pX5wXUeBTYSocRKJYdm2tVhqcL7DhatQFGWR8rv502FG1rybYttFwvmQ',
        type: '3D',
        description: 'Sala-comedor con balcón panorámico, alcoba principal con baño privado y vestier, dos alcobas auxiliares y cocina integral.'
      },
      {
        id: 'plan-saman-48',
        title: 'Apartamento Tipo B - 48 m²',
        area: '48 m²',
        rooms: '2 Habitaciones',
        baths: '1 Baño',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBadwx1p3hyaLMMr5Ck9hLFXVxZFxdqoqdp7iTbLn8bDmc_Ji74VEYVZnmCXdn9OzgoFyZMc8Mf_l_T8vIEEEgF96kDMeLjLl5MmjfseY7sJ6CMgiBkvdoXPyhoiY1JiyPHJbLEoQVFZ7oAgHP9ILlohYl4zbIMA4WRY4rHFFhB9_JDSYNGIbCfqT6BbTF-9TRQnBORm_1_5oFQ9IkkzYUqno0fLkz92JyjNgkNE_1-kJRXRGbh79Y',
        type: '2D',
        description: 'Espacio compacto y altamente eficiente con sala-comedor, cocina, zona de ropas independiente y dos alcobas iluminadas.'
      }
    ]
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'modal-diseno',
    title: 'Diseño Arquitectónico y Planificación',
    category: 'Diseño Especializado',
    shortDesc: 'Creamos espacios funcionales y estéticos adaptados al clima y normativas de Cartago y el Valle del Cauca.',
    fullDesc: 'Diseño conceptual, planos 2D, modelado 3D, cálculos estructurales según norma NSR-10, diseño bioclimático para confort térmico y gestión completa de licencias de construcción ante curadurías urbanas.',
    icon: 'architecture',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XaH7MhQG8OkFyexlCDB8RNHRX8jQjBCbsZn9OtsKYLyXjZFRyXR3nHd9_EGp4W4faV0adu_Hk18inMW-yr0jdptBrZujqd9OQnN-Rdy9jODD5wB5MjJLu2f-aCoYEljDMxcawC0dRb_Kv2BLSC2zjb7kUmvw095hNKQ_8kHVC-dJhW9rgNHLtviDi9zF39wButzwtS_m8J4yVYCMoZPoUc8Szzp8VOgc9YzYtR6GcMkwrkFxgAH0Bw',
    deliverables: [
      'Planos arquitectónicos y técnicos completos',
      'Modelado 3D y recorridos virtuales hiperrealistas',
      'Trámite de licencias de construcción ante Curaduría',
      'Presupuesto de obra y optimización de materiales'
    ]
  },
  {
    id: 'modal-construccion',
    title: 'Construcción de Obra y Servicios Públicos',
    category: 'Infraestructura & Obra Civil',
    shortDesc: 'Ejecutamos proyectos de vivienda, urbanismo e instalación de redes con los más altos estándares técnicos.',
    fullDesc: 'Construcción de estructuras sismorresistentes, urbanismo, pavimentación, instalación de redes hidrosanitarias, redes eléctricas e iluminación pública, con rigurosa interventoría y cumplimiento de cronograma.',
    icon: 'construction',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1UNLwC2EuOFxrbTirx89daJfyGDO4SmZuhRK2ZfaNl9u4oZ3bnFvJ-R4XglW9TIzl4B0UKxpiY_mIKVSlCy9jxw22oZWKU9dm7U5sFL5nTwf8rl4EwhpKq29ON_A_3RTP0c1Mi8pDRHg3gKViZY41elz-BepMB_uh6MWKW6zzzi8i5bQqg5Uj7oAwtCS_Gj5vdUOVkSUalhVzcQNXxIs7THsLFfi78tWysRLSBmnNRtNEFc4Mi3oVKw',
    deliverables: [
      'Cumplimiento estricto de norma sismorresistente NSR-10',
      'Redes de acueducto, alcantarillado y energía certificadas',
      'Supervisión técnica e interventoría permanente',
      'Personal calificado y pólizas de estabilidad de obra'
    ]
  },
  {
    id: 'modal-remodelacion',
    title: 'Remodelaciones y Adecuaciones Espaciales',
    category: 'Renovación Integral',
    shortDesc: 'Renovamos cocinas, baños, fachadas y áreas sociales para valorizar tu inmueble y mejorar tu confort.',
    fullDesc: 'Transformación integral de viviendas con carpintería arquitectónica, pintura de alta resistencia, modernización de pisos cerámicos o porcelanatos, cielos falsos en drywall y optimización lumínica LED.',
    icon: 'handyman',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WxVA0JKBEnNMLbvyYBTI6Mwzl4ieHcx-DDCChQz9TlPw-ki3cSslARHyhmj1oL5UgsK4Qhb4UHgFPruiDv84dwNgF028Y3aJ93ZCe69yQ_Z_R5ta9tJw_Xhl8KhzyZGtxVy244EertuipOryHPBo1FG35okUVirv6Hl_NQGNLyLSlgTi3Oimrnt8GO2lNkZITz_tulsiS764AGYyQp7IkzLrH3lzFedsfZeIMMNlD28dfIVaFDXGC3',
    deliverables: [
      'Valorización inmediata y estética contemporánea',
      'Asesoría en selección de materiales y acabados',
      'Tiempos pactados por contrato sin sobrecostos',
      'Garantía por escrito sobre mano de obra y acabados'
    ]
  }
];

export const TESTIMONIALS = [
  {
    name: 'Familia Rodríguez',
    role: 'Propietarios en Residencial El Samán',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Uss7zoze9zav-n_xL1fufhMOz3UVxxDEynu5WddQlWpJmYXZ4BBDgZ8Jy3r_HKXj5AI1KNOyQHok1htZvRSUeWMxYwvpIIsLELBazheHBqAKOeAnEKclyjPU82DfrwYgVx7tbxO3A7bHP4or-99CorcML2jTjvIejCgSmQxbtIqnugO4vIvMwNeczM--BW2gug7nRY27V0pg-mCy1uFbGkFo-CR42Z_oz7vu3ETpp_eMcP1QPuc5n6jQ',
    comment: 'Excelente atención y cumplimiento de plazos. Logramos adquirir nuestro apartamento aplicando el subsidio Mi Casa Ya y la caja de compensación gracias a la orientación paso a paso de Marin & Salgado.'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Comprador en Urbanización Los Álamos',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UDIVroci7nlIdVJRspNK42hwV6gjf2asAiIYX5M21LxSBaICL2lN0G3i9NIJXQzPv6OBL6J_4t0IxmjwM9m371jcXY_BG6cMka_Za1dAv3Aipi0FcyT_jbEuFi5QBCmjH8pp5gWYFKnuX3eCCObeARX65L3lUrlEaS1Qha5Mmp3SSsoLyf4nMVT443Q3VoczZHeCrJGUVOntR_VGfwFqYZnJLNQlILJwWpGEgFbsAN5ja2zqRwXg5lEw',
    comment: 'La amplitud de las casas y la solidez de la construcción superó nuestras expectativas. Es difícil encontrar proyectos VIS con acabados y diseño de esta categoría en Cartago.'
  },
  {
    name: 'Martha Lucía Jaramillo',
    role: 'Propietaria e Inversionista',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1VHgND7D9nM1JOj5zWJ3oqhv6LExwcU2tmCad-ylRQbnHEBpgf8mLMowpTsRoCkg1lK6gP5KzseJycXLyBbW-5H92VU_H3_Z6_rth8xmAVelhsb8iaRyvjNtv6bRT9Z4X25U8TEzfXwAFUWHCdqbEUa5g2bn1MPRfqONWWQ8dGN9HPuIz228xQz6cWJZbD8rA09L5S0U4ibeWFFuAK2ZGhKZfb8z2oSw6SYNeWwwY1gH8UnaiU82Wbvow',
    comment: 'Recomendados al 100%. Son profesionales serios que entienden los trámites bancarios y subsidios. La asesoría comercial de Carolina Salgado y su equipo fue impecable.'
  }
];

export const COMPANY_INFO = {
  name: 'Marin & Salgado Construcciones S.A.S.',
  nit: '901.458.712-3',
  address: 'Cra 6 # 14-55, Cartago, Valle del Cauca, Colombia',
  phone: '3226374991',
  phoneFormatted: '+57 322 637 4991',
  whatsappUrl: 'https://wa.me/573226374991?text=Hola%20Marin%20%26%20Salgado,%20deseo%20informaci%C3%B3n%20sobre%20sus%20proyectos%20VIS%20en%20Cartago',
  email: 'marinysalgadoconstrucciones@gmail.com',
  city: 'Cartago',
  department: 'Valle del Cauca',
  country: 'Colombia',
  hours: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
  experienceYears: '15+',
  familiesCount: '1000+',
  leadership: {
    name: 'Carolina Salgado',
    role: 'Gerente de Proyectos & Fundadora',
    bio: 'Más de 10 años liderando el desarrollo de viviendas de interés social (VIS) de alta calidad en el Norte del Valle y Eje Cafetero. Comprometida con brindar soluciones habitacionales transparentes, sismorresistentes y con la mejor asesoría en subsidios gubernamentales.',
  },
};
