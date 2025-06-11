import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomFeaturesProps {
  features: string[]
  className?: string
}

const RoomFeatures = ({ features, className }: RoomFeaturesProps) => {
  // Asegurarse de que features sea un array
  const safeFeatures = Array.isArray(features) ? features : []

  if (safeFeatures.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold">Lo que ofrece este lugar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {safeFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomFeatures
