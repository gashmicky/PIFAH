// Regional Economic Communities (RECs) in Africa
export const REC_LIST = [
  'COMESA',    // Common Market for Eastern and Southern Africa
  'EAC',       // East African Community  
  'ECCAS',     // Economic Community of Central African States
  'ECOWAS',    // Economic Community of West African States
  'IGAD',      // Intergovernmental Authority on Development
  'SADC',      // Southern African Development Community
  'UMA',       // Arab Maghreb Union
  'CEN-SAD',   // Community of Sahel-Saharan States
] as const;

export type REC = typeof REC_LIST[number];

// Country to REC mapping
export const COUNTRY_REC_MAP: Record<string, REC[]> = {
  // COMESA members
  'Burundi': ['COMESA', 'EAC'],
  'Comoros': ['COMESA'],
  'Djibouti': ['COMESA', 'IGAD'],
  'Egypt': ['COMESA', 'CEN-SAD'],
  'Eritrea': ['COMESA', 'IGAD'],
  'Eswatini': ['COMESA', 'SADC'],
  'Ethiopia': ['COMESA', 'IGAD'],
  'Kenya': ['COMESA', 'EAC', 'IGAD'],
  'Libya': ['COMESA', 'CEN-SAD', 'UMA'],
  'Madagascar': ['COMESA', 'SADC'],
  'Malawi': ['COMESA', 'SADC'],
  'Mauritius': ['COMESA', 'SADC'],
  'Rwanda': ['COMESA', 'EAC', 'ECCAS'],
  'Seychelles': ['COMESA', 'SADC'],
  'Somalia': ['COMESA', 'IGAD'],
  'Sudan': ['COMESA', 'IGAD', 'CEN-SAD'],
  'Tunisia': ['UMA', 'CEN-SAD'],
  'Uganda': ['COMESA', 'EAC', 'IGAD'],
  'Zambia': ['COMESA', 'SADC'],
  'Zimbabwe': ['COMESA', 'SADC'],
  
  // EAC members
  'Tanzania': ['EAC', 'SADC'],
  'South Sudan': ['EAC', 'IGAD'],
  
  // ECCAS members
  'Angola': ['ECCAS', 'SADC'],
  'Cameroon': ['ECCAS', 'CEN-SAD'],
  'Central African Republic': ['ECCAS', 'CEN-SAD'],
  'Chad': ['ECCAS', 'CEN-SAD'],
  'Congo': ['ECCAS'],
  'Democratic Republic of Congo': ['ECCAS', 'SADC'],
  'Equatorial Guinea': ['ECCAS'],
  'Gabon': ['ECCAS'],
  'Sao Tome and Principe': ['ECCAS'],
  
  // ECOWAS (15 members)
  'Benin': ['ECOWAS', 'CEN-SAD'],
  'Burkina Faso': ['ECOWAS', 'CEN-SAD'],
  'Cape Verde': ['ECOWAS'],
  'Ivory Coast': ['ECOWAS', 'CEN-SAD'],
  'Gambia': ['ECOWAS', 'CEN-SAD'],
  'Ghana': ['ECOWAS', 'CEN-SAD'],
  'Guinea': ['ECOWAS', 'CEN-SAD'],
  'Guinea-Bissau': ['ECOWAS', 'CEN-SAD'],
  'Liberia': ['ECOWAS', 'CEN-SAD'],
  'Mali': ['ECOWAS', 'CEN-SAD'],
  'Niger': ['ECOWAS', 'CEN-SAD'],
  'Nigeria': ['ECOWAS', 'CEN-SAD'],
  'Senegal': ['ECOWAS', 'CEN-SAD'],
  'Sierra Leone': ['ECOWAS', 'CEN-SAD'],
  'Togo': ['ECOWAS', 'CEN-SAD'],
  
  // IGAD (8 members)
  // Already mapped above with COMESA/EAC overlaps
  
  // SADC (16 members)
  'Botswana': ['SADC'],
  'Lesotho': ['SADC'],
  'Mozambique': ['SADC'],
  'Namibia': ['SADC'],
  'South Africa': ['SADC'],
  
  // UMA (5 members)
  'Algeria': ['UMA', 'CEN-SAD'],
  'Mauritania': ['UMA', 'CEN-SAD'],
  'Morocco': ['UMA', 'CEN-SAD'],
  
  // CEN-SAD (29 members - many already mapped)
};

// REC descriptions
export const REC_INFO: Record<string, { name: string; description: string; memberCount: number }> = {
  'COMESA': {
    name: 'Common Market for Eastern and Southern Africa',
    description: 'Regional economic community for Eastern and Southern African states',
    memberCount: 21,
  },
  'EAC': {
    name: 'East African Community',
    description: 'Intergovernmental organization of East African countries',
    memberCount: 7,
  },
  'ECCAS': {
    name: 'Economic Community of Central African States',
    description: 'Regional economic bloc for Central African countries',
    memberCount: 11,
  },
  'ECOWAS': {
    name: 'Economic Community of West African States',
    description: 'Regional political and economic union of West African countries',
    memberCount: 15,
  },
  'IGAD': {
    name: 'Intergovernmental Authority on Development',
    description: 'Regional development organization in East Africa',
    memberCount: 8,
  },
  'SADC': {
    name: 'Southern African Development Community',
    description: 'Inter-governmental organization for Southern African states',
    memberCount: 16,
  },
  'UMA': {
    name: 'Arab Maghreb Union',
    description: 'Regional trade agreement among North African countries',
    memberCount: 5,
  },
  'CEN-SAD': {
    name: 'Community of Sahel-Saharan States',
    description: 'Regional organization spanning North and Central Africa',
    memberCount: 29,
  },
};

// Helper function to get RECs for a country
export function getRECsForCountry(countryName: string): REC[] {
  return COUNTRY_REC_MAP[countryName] || [];
}
