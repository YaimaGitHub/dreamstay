import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

interface RoomFeaturesProps {
  features: string[]
}

const RoomFeatures = ({ features }: RoomFeaturesProps) => {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">Lo que ofrece esta habitación</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="p-4 flex items-start">
            <div className="mr-3 text-terracotta">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p>{feature}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RoomFeatures
