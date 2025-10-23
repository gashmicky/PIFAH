import { CountryDetailsPanel } from "../CountryDetailsPanel";

export default function CountryDetailsPanelExample() {
  const mockCountry = {
    id: 'ng',
    name: 'Nigeria',
    capital: 'Abuja',
    population: 223804000,
    area: 923768,
    region: 'West' as const,
    gdp: 477,
  };

  return (
    <CountryDetailsPanel
      country={mockCountry}
      onClose={() => console.log("Close panel")}
    />
  );
}
