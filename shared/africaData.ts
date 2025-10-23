export interface Country {
  id: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  region: 'North' | 'West' | 'East' | 'Central' | 'South';
  gdp?: number;
  languages?: string[];
}

export const africaCountries: Country[] = [
  { id: 'dz', name: 'Algeria', capital: 'Algiers', population: 44700000, area: 2381741, region: 'North', gdp: 195 },
  { id: 'ao', name: 'Angola', capital: 'Luanda', population: 35588000, area: 1246700, region: 'Central', gdp: 94 },
  { id: 'bj', name: 'Benin', capital: 'Porto-Novo', population: 13353000, area: 112622, region: 'West', gdp: 17 },
  { id: 'bw', name: 'Botswana', capital: 'Gaborone', population: 2630000, area: 581730, region: 'South', gdp: 18 },
  { id: 'bf', name: 'Burkina Faso', capital: 'Ouagadougou', population: 22673000, area: 272967, region: 'West', gdp: 19 },
  { id: 'bi', name: 'Burundi', capital: 'Gitega', population: 12889000, area: 27834, region: 'East', gdp: 3 },
  { id: 'cm', name: 'Cameroon', capital: 'Yaoundé', population: 28088000, area: 475442, region: 'Central', gdp: 45 },
  { id: 'cv', name: 'Cape Verde', capital: 'Praia', population: 594000, area: 4033, region: 'West', gdp: 2 },
  { id: 'cf', name: 'Central African Republic', capital: 'Bangui', population: 5579000, area: 622984, region: 'Central', gdp: 2 },
  { id: 'td', name: 'Chad', capital: "N'Djamena", population: 17723000, area: 1284000, region: 'Central', gdp: 11 },
  { id: 'km', name: 'Comoros', capital: 'Moroni', population: 907000, area: 1862, region: 'East', gdp: 1 },
  { id: 'cg', name: 'Congo', capital: 'Brazzaville', population: 5970000, area: 342000, region: 'Central', gdp: 11 },
  { id: 'cd', name: 'DR Congo', capital: 'Kinshasa', population: 99010000, area: 2344858, region: 'Central', gdp: 55 },
  { id: 'ci', name: "Côte d'Ivoire", capital: 'Yamoussoukro', population: 28088000, area: 322463, region: 'West', gdp: 70 },
  { id: 'dj', name: 'Djibouti', capital: 'Djibouti', population: 1120000, area: 23200, region: 'East', gdp: 4 },
  { id: 'eg', name: 'Egypt', capital: 'Cairo', population: 111000000, area: 1002450, region: 'North', gdp: 469 },
  { id: 'gq', name: 'Equatorial Guinea', capital: 'Malabo', population: 1674000, area: 28051, region: 'Central', gdp: 10 },
  { id: 'er', name: 'Eritrea', capital: 'Asmara', population: 3684000, area: 117600, region: 'East', gdp: 2 },
  { id: 'sz', name: 'Eswatini', capital: 'Mbabane', population: 1210000, area: 17364, region: 'South', gdp: 4 },
  { id: 'et', name: 'Ethiopia', capital: 'Addis Ababa', population: 123379000, area: 1104300, region: 'East', gdp: 126 },
  { id: 'ga', name: 'Gabon', capital: 'Libreville', population: 2388000, area: 267668, region: 'Central', gdp: 19 },
  { id: 'gm', name: 'Gambia', capital: 'Banjul', population: 2706000, area: 10689, region: 'West', gdp: 2 },
  { id: 'gh', name: 'Ghana', capital: 'Accra', population: 34121000, area: 238533, region: 'West', gdp: 77 },
  { id: 'gn', name: 'Guinea', capital: 'Conakry', population: 14191000, area: 245857, region: 'West', gdp: 16 },
  { id: 'gw', name: 'Guinea-Bissau', capital: 'Bissau', population: 2106000, area: 36125, region: 'West', gdp: 2 },
  { id: 'ke', name: 'Kenya', capital: 'Nairobi', population: 55100000, area: 580367, region: 'East', gdp: 115 },
  { id: 'ls', name: 'Lesotho', capital: 'Maseru', population: 2306000, area: 30355, region: 'South', gdp: 2 },
  { id: 'lr', name: 'Liberia', capital: 'Monrovia', population: 5418000, area: 111369, region: 'West', gdp: 4 },
  { id: 'ly', name: 'Libya', capital: 'Tripoli', population: 6888000, area: 1759540, region: 'North', gdp: 25 },
  { id: 'mg', name: 'Madagascar', capital: 'Antananarivo', population: 30325000, area: 587041, region: 'East', gdp: 15 },
  { id: 'mw', name: 'Malawi', capital: 'Lilongwe', population: 20931000, area: 118484, region: 'East', gdp: 13 },
  { id: 'ml', name: 'Mali', capital: 'Bamako', population: 22594000, area: 1240192, region: 'West', gdp: 19 },
  { id: 'mr', name: 'Mauritania', capital: 'Nouakchott', population: 4862000, area: 1030700, region: 'West', gdp: 9 },
  { id: 'mu', name: 'Mauritius', capital: 'Port Louis', population: 1300000, area: 2040, region: 'East', gdp: 12 },
  { id: 'ma', name: 'Morocco', capital: 'Rabat', population: 37840000, area: 446550, region: 'North', gdp: 134 },
  { id: 'mz', name: 'Mozambique', capital: 'Maputo', population: 33897000, area: 801590, region: 'East', gdp: 16 },
  { id: 'na', name: 'Namibia', capital: 'Windhoek', population: 2604000, area: 825615, region: 'South', gdp: 11 },
  { id: 'ne', name: 'Niger', capital: 'Niamey', population: 26207000, area: 1267000, region: 'West', gdp: 16 },
  { id: 'ng', name: 'Nigeria', capital: 'Abuja', population: 223804000, area: 923768, region: 'West', gdp: 477 },
  { id: 'rw', name: 'Rwanda', capital: 'Kigali', population: 13776000, area: 26338, region: 'East', gdp: 13 },
  { id: 'st', name: 'São Tomé and Príncipe', capital: 'São Tomé', population: 231000, area: 964, region: 'Central', gdp: 1 },
  { id: 'sn', name: 'Senegal', capital: 'Dakar', population: 17740000, area: 196722, region: 'West', gdp: 28 },
  { id: 'sc', name: 'Seychelles', capital: 'Victoria', population: 107000, area: 452, region: 'East', gdp: 2 },
  { id: 'sl', name: 'Sierra Leone', capital: 'Freetown', population: 8606000, area: 71740, region: 'West', gdp: 4 },
  { id: 'so', name: 'Somalia', capital: 'Mogadishu', population: 18143000, area: 637657, region: 'East', gdp: 8 },
  { id: 'za', name: 'South Africa', capital: 'Pretoria', population: 60604000, area: 1221037, region: 'South', gdp: 380 },
  { id: 'ss', name: 'South Sudan', capital: 'Juba', population: 11088000, area: 644329, region: 'East', gdp: 3 },
  { id: 'sd', name: 'Sudan', capital: 'Khartoum', population: 48109000, area: 1886068, region: 'North', gdp: 35 },
  { id: 'tz', name: 'Tanzania', capital: 'Dodoma', population: 65498000, area: 947303, region: 'East', gdp: 75 },
  { id: 'tg', name: 'Togo', capital: 'Lomé', population: 8848000, area: 56785, region: 'West', gdp: 8 },
  { id: 'tn', name: 'Tunisia', capital: 'Tunis', population: 12458000, area: 163610, region: 'North', gdp: 47 },
  { id: 'ug', name: 'Uganda', capital: 'Kampala', population: 48582000, area: 241550, region: 'East', gdp: 45 },
  { id: 'zm', name: 'Zambia', capital: 'Lusaka', population: 20017000, area: 752612, region: 'South', gdp: 22 },
  { id: 'zw', name: 'Zimbabwe', capital: 'Harare', population: 16320000, area: 390757, region: 'South', gdp: 28 },
];

export const regionColors = {
  North: 'hsl(200 70% 45%)',
  West: 'hsl(150 55% 45%)',
  East: 'hsl(280 60% 50%)',
  Central: 'hsl(30 65% 50%)',
  South: 'hsl(340 65% 50%)',
};
