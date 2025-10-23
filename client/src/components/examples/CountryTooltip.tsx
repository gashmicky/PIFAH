import { CountryTooltip } from "../CountryTooltip";

export default function CountryTooltipExample() {
  const mockCountry = {
    id: 'za',
    name: 'South Africa',
    capital: 'Pretoria',
    population: 60604000,
    area: 1221037,
    region: 'South' as const,
  };

  return (
    <div className="relative h-64">
      <CountryTooltip country={mockCountry} x={100} y={100} />
    </div>
  );
}
