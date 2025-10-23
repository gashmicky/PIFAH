import { useState } from "react";
import { AfricaMap } from "../AfricaMap";

export default function AfricaMapExample() {
  const [searchQuery] = useState("");
  const [viewMode] = useState<'default' | 'region'>('region');

  return (
    <div className="h-screen">
      <AfricaMap
        onCountryClick={(country) => console.log("Clicked:", country.name)}
        searchQuery={searchQuery}
        viewMode={viewMode}
      />
    </div>
  );
}
