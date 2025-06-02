"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TourismTypeSelectorProps {
  onTourismTypeChange: (type: "national" | "international") => void
  currentType: "national" | "international"
}

const TourismTypeSelector = ({ onTourismTypeChange, currentType }: TourismTypeSelectorProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Tipo de Turismo</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            variant={currentType === "national" ? "default" : "outline"}
            size="sm"
            onClick={() => onTourismTypeChange("national")}
          >
            Nacional
          </Button>
          <Button
            variant={currentType === "international" ? "default" : "outline"}
            size="sm"
            onClick={() => onTourismTypeChange("international")}
          >
            Internacional
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TourismTypeSelector
