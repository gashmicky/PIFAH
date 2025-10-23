// Regional Economic Communities (RECs) in Africa
export const REC_REGIONS = {
  "ECOWAS": {
    name: "Economic Community of West African States",
    acronym: "ECOWAS",
    countries: ["Benin", "Burkina Faso", "Cape Verde", "Ivory Coast", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Liberia", "Mali", "Niger", "Nigeria", "Senegal", "Sierra Leone", "Togo"],
    color: "hsl(210, 75%, 60%)",
  },
  "EAC": {
    name: "East African Community",
    acronym: "EAC",
    countries: ["Burundi", "Kenya", "Rwanda", "South Sudan", "Tanzania", "Uganda"],
    color: "hsl(150, 65%, 55%)",
  },
  "SADC": {
    name: "Southern African Development Community",
    acronym: "SADC",
    countries: ["Angola", "Botswana", "Comoros", "Democratic Republic of the Congo", "Eswatini", "Lesotho", "Madagascar", "Malawi", "Mauritius", "Mozambique", "Namibia", "Seychelles", "South Africa", "Tanzania", "Zambia", "Zimbabwe"],
    color: "hsl(280, 65%, 60%)",
  },
  "COMESA": {
    name: "Common Market for Eastern and Southern Africa",
    acronym: "COMESA",
    countries: ["Burundi", "Comoros", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Eritrea", "Eswatini", "Ethiopia", "Kenya", "Libya", "Madagascar", "Malawi", "Mauritius", "Rwanda", "Seychelles", "Somalia", "Sudan", "Tunisia", "Uganda", "Zambia", "Zimbabwe"],
    color: "hsl(30, 75%, 58%)",
  },
  "IGAD": {
    name: "Intergovernmental Authority on Development",
    acronym: "IGAD",
    countries: ["Djibouti", "Eritrea", "Ethiopia", "Kenya", "Somalia", "South Sudan", "Sudan", "Uganda"],
    color: "hsl(340, 70%, 62%)",
  },
  "ECCAS": {
    name: "Economic Community of Central African States",
    acronym: "ECCAS",
    countries: ["Angola", "Burundi", "Cameroon", "Central African Republic", "Chad", "Democratic Republic of the Congo", "Republic of the Congo", "Equatorial Guinea", "Gabon", "Rwanda", "São Tomé and Príncipe"],
    color: "hsl(180, 65%, 55%)",
  },
  "AMU": {
    name: "Arab Maghreb Union",
    acronym: "AMU",
    countries: ["Algeria", "Libya", "Mauritania", "Morocco", "Tunisia"],
    color: "hsl(45, 75%, 58%)",
  },
  "CEN-SAD": {
    name: "Community of Sahel-Saharan States",
    acronym: "CEN-SAD",
    countries: ["Benin", "Burkina Faso", "Central African Republic", "Chad", "Comoros", "Ivory Coast", "Djibouti", "Egypt", "Eritrea", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Liberia", "Libya", "Mali", "Mauritania", "Morocco", "Niger", "Nigeria", "Senegal", "Sierra Leone", "Somalia", "Sudan", "Togo", "Tunisia"],
    color: "hsl(260, 60%, 60%)",
  },
} as const;

export type RECName = keyof typeof REC_REGIONS;

export const REC_LIST: RECName[] = [
  "ECOWAS",
  "EAC",
  "SADC",
  "COMESA",
  "IGAD",
  "ECCAS",
  "AMU",
  "CEN-SAD",
];

// Helper function to get REC for a country
export function getCountryREC(countryName: string): RECName | null {
  for (const recName of REC_LIST) {
    if (REC_REGIONS[recName].countries.includes(countryName)) {
      return recName;
    }
  }
  return null;
}
