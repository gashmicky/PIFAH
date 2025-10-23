import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <Card className="p-2 backdrop-blur-md bg-card/95 flex flex-col gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        data-testid="button-zoom-in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        data-testid="button-zoom-out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        data-testid="button-reset-zoom"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}
