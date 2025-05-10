"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash, Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface FeatureManagerProps {
  features: string[]
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>
}

const FeatureManager = ({ features, setFeatures }: FeatureManagerProps) => {
  const [newFeature, setNewFeature] = useState("")
  const form = useFormContext()

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()]
      setFeatures(updatedFeatures)
      form.setValue("features", updatedFeatures)
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index)
    setFeatures(updatedFeatures)
    form.setValue("features", updatedFeatures)
  }

  return (
    <div>
      <Label htmlFor="feature">Características</Label>
      <div className="mt-2 flex space-x-2">
        <Input
          id="feature"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Ej: WiFi gratis"
          className="flex-1"
        />
        <Button type="button" onClick={addFeature} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
      {features.length === 0 && <p className="text-sm text-destructive mt-2">Agregue al menos una característica</p>}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Características agregadas:</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center">
              <span className="text-sm">{feature}</span>
              <button type="button" onClick={() => removeFeature(index)} className="ml-2 text-destructive">
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureManager
