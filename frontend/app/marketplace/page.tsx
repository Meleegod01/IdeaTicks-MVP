"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock marketplace listings
const mockListings = [
  {
    id: 1,
    tokenId: 123,
    eventName: "Tech Conference 2024",
    tierName: "VIP Pass",
    originalPrice: "0.25",
    currentPrice: "0.28",
    seller: "0x1234...5678",
    eventDate: "2024-03-15",
    image: "/placeholder.svg?height=200&width=300",
    priceChange: 12,
    listed: "2024-02-10",
  },
  {
    id: 2,
    tokenId: 456,
    eventName: "Music Festival",
    tierName: "General Admission",
    originalPrice: "0.15",
    currentPrice: "0.18",
    seller: "0x8765...4321",
    eventDate: "2024-04-20",
    image: "/placeholder.svg?height=200&width=300",
    priceChange: 20,
    listed: "2024-02-12",
  },
  {
    id: 3,
    tokenId: 789,
    eventName: "Art Exhibition",
    tierName: "Standard",
    originalPrice: "0.05",
    currentPrice: "0.045",
    seller: "0x9876...1234",
    eventDate: "2024-03-25",
    image: "/placeholder.svg?height=200&width=300",
    priceChange: -10,
    listed: "2024-02-08",
  },
  {
    id: 4,
    tokenId: 101,
    eventName: "Tech Conference 2024",
    tierName: "General Admission",
    originalPrice: "0.1",
    currentPrice: "0.12",
    seller: "0x5555...9999",
    eventDate: "2024-03-15",
    image: "/placeholder.svg?height=200&width=300",
    priceChange: 20,
    listed: "2024-02-11",
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  const filteredListings = mockListings
    .filter(
      (listing) =>
        listing.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.tierName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.currentPrice) - Number.parseFloat(b.currentPrice)
        case "price-high":
          return Number.parseFloat(b.currentPrice) - Number.parseFloat(a.currentPrice)
        case "newest":
          return new Date(b.listed).getTime() - new Date(a.listed).getTime()
        case "oldest":
          return new Date(a.listed).getTime() - new Date(b.listed).getTime()
        default:
          return 0
      }
    })

  const handlePurchase = (listing: (typeof mockListings)[0]) => {
    console.log("Purchasing ticket:", listing)
    alert(`Would purchase ${listing.tierName} ticket for ${listing.currentPrice} ETH`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Ticket Marketplace</h1>
            </div>
            <Button asChild>
              <Link href="/my-tickets">My Tickets</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">1,234</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-1">567</div>
              <div className="text-sm text-gray-600">Sold This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-1">0.15</div>
              <div className="text-sm text-gray-600">Avg Price (ETH)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">89</div>
              <div className="text-sm text-gray-600">Events Listed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search events or ticket types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.eventName}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-3 right-3 ${
                    listing.priceChange > 0 ? "bg-green-500" : listing.priceChange < 0 ? "bg-red-500" : "bg-gray-500"
                  }`}
                >
                  {listing.priceChange > 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                  {listing.priceChange < 0 && <TrendingDown className="h-3 w-3 mr-1" />}
                  {listing.priceChange > 0 ? "+" : ""}
                  {listing.priceChange}%
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{listing.eventName}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mb-2">
                    {listing.tierName}
                  </Badge>
                  <div className="text-sm text-gray-600">Token #{listing.tokenId}</div>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Original Price</span>
                    <span className="text-sm">{listing.originalPrice} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Price</span>
                    <span className="text-lg font-bold text-purple-600">{listing.currentPrice} ETH</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div>Event: {new Date(listing.eventDate).toLocaleDateString()}</div>
                  <div>Seller: {listing.seller}</div>
                  <div>Listed: {new Date(listing.listed).toLocaleDateString()}</div>
                </div>

                <Button onClick={() => handlePurchase(listing)} className="w-full bg-purple-600 hover:bg-purple-700">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
