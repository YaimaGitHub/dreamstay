"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RoomFilters from "@/components/rooms/RoomFilters"
import RoomGrid from "@/components/rooms/RoomGrid"
import { useRoomStore } from "@/contexts/RoomStoreContext"

const RoomsList = () => {
  const { rooms } = useRoomStore()
  const [priceRange, setPriceRange] = useState<number[]>([50, 200])
  const [roomType, setRoomType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showUnavailable, setShowUnavailable] = useState<boolean>(false)

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
    const matchesType = roomType === "all" || room.type === roomType
    const matchesSearch =
      searchTerm === "" ||
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAvailability = showUnavailable ? true : room.isAvailable

    return matchesPrice && matchesType && matchesSearch && matchesAvailability
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <RoomFilters
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          roomType={roomType}
          setRoomType={setRoomType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          showUnavailable={showUnavailable}
          setShowUnavailable={setShowUnavailable}
        />
        <RoomGrid rooms={filteredRooms} />
      </main>
      <Footer />
    </div>
  )
}

export default RoomsList
