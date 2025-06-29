"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, Filter, Ticket, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2024",
    description: "Annual technology conference featuring industry leaders",
    date: "2024-03-15",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=200&width=300",
    tiers: [
      { id: 1, name: "General", price: "0.1", available: 450, total: 500 },
      { id: 2, name: "VIP", price: "0.25", available: 45, total: 50 },
    ],
    organizer: "0x1234...5678",
  },
  {
    id: 2,
    name: "Music Festival",
    description: "Three days of amazing music and entertainment",
    date: "2024-04-20",
    location: "Austin, TX",
    image: "/placeholder.svg?height=200&width=300",
    tiers: [
      { id: 1, name: "GA", price: "0.15", available: 2800, total: 3000 },
      { id: 2, name: "Premium", price: "0.35", available: 180, total: 200 },
    ],
    organizer: "0x8765...4321",
  },
  {
    id: 3,
    name: "Art Exhibition",
    description: "Contemporary art showcase featuring emerging artists",
    date: "2024-03-25",
    location: "New York, NY",
    image: "/placeholder.svg?height=200&width=300",
    tiers: [{ id: 1, name: "Standard", price: "0.05", available: 190, total: 200 }],
    organizer: "0x9876...1234",
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredEvents = mockEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">IdeaTicks</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-purple-600 font-medium">
                Events
              </Link>
              <Link href="/create" className="text-gray-700 hover:text-purple-600">
                Create Event
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-purple-600">
                Marketplace
              </Link>
              <Link href="/my-tickets" className="text-gray-700 hover:text-purple-600">
                My Tickets
              </Link>
            </nav>
            <Button className="bg-purple-600 hover:bg-purple-700">Connect Wallet</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Discover Amazing Events on IdeaTicks</h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy, sell, and trade event tickets as NFTs with complete transparency and security
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 h-12">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1,234</div>
              <div className="text-gray-600">Events Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">45,678</div>
              <div className="text-gray-600">Tickets Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,345</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Button variant="outline" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-purple-600">
                    {event.tiers.length} Tier{event.tiers.length > 1 ? "s" : ""}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.tiers.reduce((acc, tier) => acc + tier.available, 0)} tickets available
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Price Range</span>
                        <span className="text-lg font-bold text-purple-600">
                          {Math.min(...event.tiers.map((t) => Number.parseFloat(t.price)))} -{" "}
                          {Math.max(...event.tiers.map((t) => Number.parseFloat(t.price)))} ETH
                        </span>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                        <Link href={`/event/${event.id}`}>View Event</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Event?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of organizers using blockchain technology for transparent, secure ticketing
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/create">
              <TrendingUp className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Ticket className="h-6 w-6" />
                <span className="text-xl font-bold">IdeaTicks</span>
              </div>
              <p className="text-gray-400">The future of event ticketing on the blockchain</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/events" className="hover:text-white">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="hover:text-white">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-white">
                    Marketplace
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IdeaTicks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
