"use client"

import { Wifi, Car, Utensils, Tv, Wind, Waves, Coffee, Dumbbell, Gamepad2, Baby, PawPrint, Cigarette, Shield, Thermometer, Snowflake, Flame, Shirt, UtensilsCrossed, Bath, Bed, Home, TreePine, Mountain, Sun, Moon, Star, Heart, CheckCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RoomAmenitiesProps {
  features: string[]
}

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase()
  
  if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi
  if (lowerFeature.includes('parking') || lowerFeature.includes('estacionamiento')) return Car
  if (lowerFeature.includes('cocina') || lowerFeature.includes('kitchen')) return Utensils
  if (lowerFeature.includes('tv') || lowerFeature.includes('televisión')) return Tv
  if (lowerFeature.includes('aire') || lowerFeature.includes('ac') || lowerFeature.includes('climatizado')) return Wind
  if (lowerFeature.includes('piscina') || lowerFeature.includes('pool')) return Waves
  if (lowerFeature.includes('café') || lowerFeature.includes('coffee')) return Coffee
  if (lowerFeature.includes('gym') || lowerFeature.includes('gimnasio')) return Dumbbell
  if (lowerFeature.includes('juegos') || lowerFeature.includes('games')) return Gamepad2
  if (lowerFeature.includes('bebé') || lowerFeature.includes('baby')) return Baby
  if (lowerFeature.includes('mascotas') || lowerFeature.includes('pets')) return PawPrint
  if (lowerFeature.includes('fumar') || lowerFeature.includes('smoking')) return Cigarette
  if (lowerFeature.includes('seguridad') || lowerFeature.includes('security')) return Shield
  if (lowerFeature.includes('calefacción') || lowerFeature.includes('heating')) return Flame
  if (lowerFeature.includes('refrigeración') || lowerFeature.includes('cooling')) return Snowflake
  if (lowerFeature.includes('lavadora') || lowerFeature.includes('laundry')) return Shirt
  if (lowerFeature.includes('restaurante') || lowerFeature.includes('dining')) return UtensilsCrossed
  if (lowerFeature.includes('baño') || lowerFeature.includes('bathroom')) return Bath
  if (lowerFeature.includes('cama') || lowerFeature.includes('bed')) return Bed
  if (lowerFeature.includes('jardín') || lowerFeature.includes('garden')) return TreePine
  if (lowerFeature.includes('vista') || lowerFeature.includes('view')) return Mountain
  if (lowerFeature.includes('terraza') || lowerFeature.includes('balcón')) return Sun
  
  return CheckCircle
}

const getFeatureColor = (index: number) => {
  const colors = [
    'from-orange-500 to-orange-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600',
    'from-cyan-500 to-cyan-600'
  ]
  return colors[index % colors.length]
}

const RoomAmenities = ({ features }: RoomAmenitiesProps) => {
  if (!features || features.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay características especificadas para este alojamiento.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const IconComponent = getFeatureIcon(feature)
          const colorClass = getFeatureColor(index)
          
          return (
            <Card 
              key={index} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-gray-50"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-r ${colorClass} rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {feature}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Resumen de características */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2">
              <Star className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Resumen de comodidades</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 8).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/80 text-gray-700 hover:bg-white transition-colors duration-200 shadow-sm"
              >
                {feature}
              </Badge>
            ))}
            {features.length > 8 && (
              <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                +{features.length - 8} más
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomAmenities