"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash, Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

interface FeatureManagerProps {
  features: string[]
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>
}

const FeatureManager = ({ features, setFeatures }: FeatureManagerProps) => {
  const [featureTitle, setFeatureTitle] = useState("")
  const [featureDescription, setFeatureDescription] = useState("")
  const form = useFormContext()

  const addFeature = () => {
    if (featureTitle.trim()) {
      // Formato: Título\nDescripción
      const featureText = featureDescription.trim()
        ? `${featureTitle.trim()}\n${featureDescription.trim()}`
        : featureTitle.trim()

      const updatedFeatures = [...features, featureText]
      setFeatures(updatedFeatures)
      form.setValue("features", updatedFeatures)
      setFeatureTitle("")
      setFeatureDescription("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index)
    setFeatures(updatedFeatures)
    form.setValue("features", updatedFeatures)
  }

  // Función para mostrar el título de una característica (primera línea)
  const getFeatureTitle = (feature: string) => {
    return feature.split("\n")[0] || feature
  }

  // Función para mostrar la descripción de una característica (resto de líneas)
  const getFeatureDescription = (feature: string) => {
    const parts = feature.split("\n")
    return parts.length > 1 ? parts.slice(1).join(" ") : ""
  }

  return (
    <div>
      <Label htmlFor="feature-title">Lo que ofrece esta habitación</Label>
      <div className="mt-2 space-y-3">
        <Input
          id="feature-title"
          value={featureTitle}
          onChange={(e) => setFeatureTitle(e.target.value)}
          placeholder="Título (ej: Cama king size)"
          className="w-full"
        />
        <Textarea
          id="feature-description"
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
          placeholder="Descripción (ej: Cama de alta calidad con ropa de cama premium)"
          className="w-full"
          rows={2}
        />
        <Button type="button" onClick={addFeature} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar característica
        </Button>
      </div>
      {features.length === 0 && (
        <p className="text-sm text-destructive mt-2">Agregue al menos una característica que ofrece esta habitación</p>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Características agregadas:</h3>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="bg-muted p-3 rounded-lg flex items-start justify-between">
              <div>
                <p className="font-medium">{getFeatureTitle(feature)}</p>
                {getFeatureDescription(feature) && (
                  <p className="text-sm text-muted-foreground">{getFeatureDescription(feature)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="ml-2 text-destructive hover:bg-destructive/10 p-1 rounded"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureManager
