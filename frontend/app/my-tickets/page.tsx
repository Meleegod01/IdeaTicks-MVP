"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Ticket, DollarSign, ArrowLeft, QrCode } from "lucide-react"
import Link from "next/link"

// Mock user tickets
const mockTickets = [
  {
    id: 1,
    tokenId: 123,
    eventName: "Tech Conference 2024",
    tierName: "VIP Pass",
    originalPrice: "0.25",
    purchasePrice: "0.25",
    eventDate: "2024-03-15",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=200&width=300",
    status: "upcoming",
    qrCode: "QR123456789",
    benefits: ["VIP lounge access", "Priority seating", "Meet & greet"],
  },
  {
    id: 2,
    tokenId: 456,
    eventName: "Music Festival",
    tierName: "General Admission",
    originalPrice: "0.15",
    purchasePrice: "0.18",
    eventDate: "2024-04-20",
    location: "Austin, TX",
    image: "/placeholder.svg?height=200&width=300",
    status: "upcoming",
    qrCode: "QR987654321",
    benefits: ["Festival access", "Welcome kit"],
  },
  {
    id: 3,
    tokenId: 789,
    eventName: "Art Exhibition",
    tierName: "Standard",
    originalPrice: "0.05",
    purchasePrice: "0.05",
    eventDate: "2024-02-10",
    location: "New York, NY",
    image: "/placeholder.svg?height=200&width=300",
    status: "attended",
    qrCode: "QR555666777",
    benefits: ["Exhibition access"],
  },
]

// Mock listed tickets
const mockListedTickets = [
  {
    id: 4,
    tokenId: 101,
    eventName: "Tech Conference 2024",
    tierName: "General Admission",
    originalPrice: "0.1",
    listPrice: "0.12",
    eventDate: "2024-03-15",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=200&width=300",
    listedDate: "2024-02-11",
    views: 23,
    interested: 5,
  },
]

export default function MyTicketsPage() {
  const [listingPrice, setListingPrice] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<(typeof mockTickets)[0] | null>(null)

  const handleListTicket = (ticket: (typeof mockTickets)[0]) => {
    console.log("Listing ticket:", ticket, "for", listingPrice, "ETH")
    alert(`Would list ${ticket.tierName} ticket for ${listingPrice} ETH`)
    setListingPrice("")
  }

  const handleDelistTicket = (ticketId: number) => {
    console.log("Delisting ticket:", ticketId)
    alert("Ticket would be delisted from marketplace")
  }

  const upcomingTickets = mockTickets.filter((t) => t.status === "upcoming")
  const pastTickets = mockTickets.filter((t) => t.status === "attended")

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
              <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
            </div>
            <Button asChild>
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">{mockTickets.length}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-1">{upcomingTickets.length}</div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-1">{mockListedTickets.length}</div>
              <div className="text-sm text-gray-600">Listed for Sale</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">{pastTickets.length}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="listed">Listed Tickets</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.eventName}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-500">Upcoming</Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{ticket.eventName}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mb-2">
                        {ticket.tierName}
                      </Badge>
                      <div className="text-sm text-gray-600">Token #{ticket.tokenId}</div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {ticket.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Paid {ticket.purchasePrice} ETH
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            View Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{ticket.eventName}</DialogTitle>
                            <DialogDescription>
                              {ticket.tierName} - Token #{ticket.tokenId}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">QR Code: {ticket.qrCode}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Event Details</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Date: {new Date(ticket.eventDate).toLocaleDateString()}</div>
                                <div>Location: {ticket.location}</div>
                                <div>Tier: {ticket.tierName}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Benefits</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {ticket.benefits.map((benefit, index) => (
                                  <li key={index}>• {benefit}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <Ticket className="h-4 w-4 mr-2" />
                            List for Sale
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>List Ticket for Sale</DialogTitle>
                            <DialogDescription>Set your selling price for this ticket</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="price">Selling Price (ETH)</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.001"
                                value={listingPrice}
                                onChange={(e) => setListingPrice(e.target.value)}
                                placeholder="0.15"
                              />
                              <p className="text-sm text-gray-500">Original price: {ticket.originalPrice} ETH</p>
                              <p className="text-sm text-gray-500">
                                Max allowed: {(Number.parseFloat(ticket.originalPrice) * 1.2).toFixed(3)} ETH (20% above
                                original)
                              </p>
                            </div>
                            <Button
                              onClick={() => handleListTicket(ticket)}
                              disabled={!listingPrice}
                              className="w-full"
                            >
                              List Ticket
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Listed Tickets */}
          <TabsContent value="listed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockListedTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.eventName}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-blue-500">Listed</Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{ticket.eventName}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mb-2">
                        {ticket.tierName}
                      </Badge>
                      <div className="text-sm text-gray-600">Token #{ticket.tokenId}</div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Original Price</span>
                        <span className="text-sm">{ticket.originalPrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Listed Price</span>
                        <span className="text-lg font-bold text-purple-600">{ticket.listPrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Listed Date</span>
                        <span className="text-sm">{new Date(ticket.listedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{ticket.views}</div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{ticket.interested}</div>
                        <div className="text-xs text-gray-600">Interested</div>
                      </div>
                    </div>

                    <Button onClick={() => handleDelistTicket(ticket.id)} variant="outline" className="w-full">
                      Remove Listing
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockListedTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets listed</h3>
                <p className="text-gray-600">List your tickets on the marketplace to sell them</p>
              </div>
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden opacity-75">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.eventName}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-gray-500">Attended</Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{ticket.eventName}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mb-2">
                        {ticket.tierName}
                      </Badge>
                      <div className="text-sm text-gray-600">Token #{ticket.tokenId}</div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {ticket.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Paid {ticket.purchasePrice} ETH
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Event Completed
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pastTickets.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                <p className="text-gray-600">Your attended events will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
