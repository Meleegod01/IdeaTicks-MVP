"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket, Share2 } from "lucide-react"
import Link from "next/link"

// Mock event data
const mockEvent = {
  id: 1,
  name: "Tech Conference 2024",
  description:
    "Join us for the most anticipated technology conference of the year! Featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities with industry professionals. This three-day event will cover the latest trends in AI, blockchain, cloud computing, and more.",
  longDescription:
    "This comprehensive conference brings together thought leaders, innovators, and professionals from across the technology sector. Attendees will have access to over 50 sessions, hands-on workshops, and exclusive networking events. Whether you're a developer, entrepreneur, or tech enthusiast, this event offers valuable insights and connections to advance your career.",
  date: "2024-03-15",
  endDate: "2024-03-17",
  location: "San Francisco Convention Center, CA",
  image: "/placeholder.svg?height=400&width=800",
  organizer: "0x1234...5678",
  organizerName: "TechEvents Inc.",
  bookingStart: "2024-02-01T09:00:00",
  bookingEnd: "2024-03-14T23:59:59",
  royaltyBps: 500,
  purchaseLimit: 10,
  resellLimitBps: 2000,
  tiers: [
    {
      id: 1,
      name: "General Admission",
      price: "0.1",
      available: 450,
      total: 500,
      description: "Access to all main sessions, exhibition hall, and networking areas",
      benefits: ["All main sessions", "Exhibition access", "Welcome kit", "Lunch included"],
    },
    {
      id: 2,
      name: "VIP Pass",
      price: "0.25",
      available: 45,
      total: 50,
      description: "Premium experience with exclusive access and perks",
      benefits: [
        "All General benefits",
        "VIP lounge access",
        "Priority seating",
        "Meet & greet with speakers",
        "Premium swag bag",
      ],
    },
  ],
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [userMintedAmount] = useState(0) // Mock user's current minted amount

  const handlePurchase = async () => {
    if (!selectedTier) return

    const tier = mockEvent.tiers.find((t) => t.id === selectedTier)
    if (!tier) return

    const totalPrice = Number.parseFloat(tier.price) * quantity
    console.log(`Purchasing ${quantity} tickets for tier ${tier.name} at ${totalPrice} ETH`)
    alert(`Would purchase ${quantity} ${tier.name} tickets for ${totalPrice} ETH`)
  }

  const isBookingActive = () => {
    const now = new Date()
    const start = new Date(mockEvent.bookingStart)
    const end = new Date(mockEvent.bookingEnd)
    return now >= start && now <= end
  }

  const getBookingStatus = () => {
    const now = new Date()
    const start = new Date(mockEvent.bookingStart)
    const end = new Date(mockEvent.bookingEnd)

    if (now < start) return "upcoming"
    if (now > end) return "ended"
    return "active"
  }

  const selectedTierData = selectedTier ? mockEvent.tiers.find((t) => t.id === selectedTier) : null
  const canPurchase = selectedTierData && userMintedAmount + quantity <= mockEvent.purchaseLimit

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={mockEvent.image || "/placeholder.svg"}
                alt={mockEvent.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{mockEvent.name}</CardTitle>
                    <CardDescription className="text-lg">{mockEvent.description}</CardDescription>
                  </div>
                  <Badge variant={getBookingStatus() === "active" ? "default" : "secondary"} className="ml-4">
                    {getBookingStatus() === "active"
                      ? "Booking Open"
                      : getBookingStatus() === "upcoming"
                        ? "Booking Soon"
                        : "Booking Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">
                        {new Date(mockEvent.date).toLocaleDateString()} -{" "}
                        {new Date(mockEvent.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">3 days</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">{mockEvent.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">
                        {mockEvent.tiers.reduce((acc, tier) => acc + tier.available, 0)} tickets available
                      </p>
                      <p className="text-sm">of {mockEvent.tiers.reduce((acc, tier) => acc + tier.total, 0)} total</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">Booking until</p>
                      <p className="text-sm">{new Date(mockEvent.bookingEnd).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed">{mockEvent.longDescription}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Organizer</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">{mockEvent.organizerName}</p>
                      <p className="text-sm text-gray-500">{mockEvent.organizer}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ticket Purchase */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
                <CardDescription>Choose your ticket tier and quantity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tier Selection */}
                <div className="space-y-4">
                  {mockEvent.tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTier === tier.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <span className="text-lg font-bold text-purple-600">{tier.price} ETH</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{tier.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available</span>
                          <span>
                            {tier.available} of {tier.total}
                          </span>
                        </div>
                        <Progress value={((tier.total - tier.available) / tier.total) * 100} className="h-2" />
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Includes:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity Selection */}
                {selectedTier && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={Math.min(selectedTierData?.available || 0, mockEvent.purchaseLimit - userMintedAmount)}
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      />
                      <p className="text-xs text-gray-500">
                        Max {mockEvent.purchaseLimit - userMintedAmount} tickets per wallet
                      </p>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{(Number.parseFloat(selectedTierData?.price || "0") * quantity).toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Gas fee</span>
                        <span>~0.005 ETH</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>
                          {(Number.parseFloat(selectedTierData?.price || "0") * quantity + 0.005).toFixed(4)} ETH
                        </span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePurchase}
                      disabled={!isBookingActive() || !canPurchase}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      {!isBookingActive()
                        ? getBookingStatus() === "upcoming"
                          ? "Booking Not Started"
                          : "Booking Ended"
                        : !canPurchase
                          ? "Purchase Limit Exceeded"
                          : `Purchase ${quantity} Ticket${quantity > 1 ? "s" : ""}`}
                    </Button>

                    {!isBookingActive() && (
                      <p className="text-sm text-gray-500 text-center">
                        {getBookingStatus() === "upcoming"
                          ? `Booking starts ${new Date(mockEvent.bookingStart).toLocaleDateString()}`
                          : "Booking has ended for this event"}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Royalty</span>
                  <span>{mockEvent.royaltyBps / 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Limit</span>
                  <span>{mockEvent.purchaseLimit} per wallet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resell Limit</span>
                  <span>+{mockEvent.resellLimitBps / 100}% max</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Tickets</span>
                  <span>{userMintedAmount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
