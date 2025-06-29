"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Tier {
  id: string
  name: string
  price: string
  maxSupply: string
  description: string
}

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    bookingStartDate: "",
    bookingEndDate: "",
    royaltyBps: "500", // 5%
    purchaseLimit: "10",
    resellLimitBps: "2000", // 20%
  })

  const [tiers, setTiers] = useState<Tier[]>([
    { id: "1", name: "General Admission", price: "0.1", maxSupply: "1000", description: "Standard entry ticket" },
  ])

  const [platformFee, setPlatformFee] = useState("0.01") // Mock platform fee

  const addTier = () => {
    const newTier: Tier = {
      id: Date.now().toString(),
      name: "",
      price: "",
      maxSupply: "",
      description: "",
    }
    setTiers([...tiers, newTier])
  }

  const removeTier = (id: string) => {
    setTiers(tiers.filter((tier) => tier.id !== id))
  }

  const updateTier = (id: string, field: keyof Tier, value: string) => {
    setTiers(tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)))
  }

  const calculateTotalSupply = () => {
    return tiers.reduce((total, tier) => total + Number.parseInt(tier.maxSupply || "0"), 0)
  }

  const calculatePlatformFee = () => {
    const totalSupply = calculateTotalSupply()
    const baseFee = 0.01 // Mock base fee
    const feePerTicket = 0.001 // Mock fee per ticket
    return baseFee + feePerTicket * totalSupply
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would interact with the EventFactory contract
    console.log("Creating event:", { eventData, tiers })
    alert("Event creation would be submitted to the blockchain here!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    placeholder="Enter event name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    placeholder="Event location"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Event Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Event End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={eventData.endDate}
                    onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Period */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Period</CardTitle>
              <CardDescription>Set when tickets can be purchased</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bookingStart">Booking Start</Label>
                  <Input
                    id="bookingStart"
                    type="datetime-local"
                    value={eventData.bookingStartDate}
                    onChange={(e) => setEventData({ ...eventData, bookingStartDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookingEnd">Booking End</Label>
                  <Input
                    id="bookingEnd"
                    type="datetime-local"
                    value={eventData.bookingEndDate}
                    onChange={(e) => setEventData({ ...eventData, bookingEndDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ticket Tiers
                <Button type="button" onClick={addTier} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </CardTitle>
              <CardDescription>Create different ticket types with varying prices and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tiers.map((tier, index) => (
                <div key={tier.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Tier {index + 1}</Badge>
                    {tiers.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTier(tier.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tier Name</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                        placeholder="e.g., VIP, General Admission"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (ETH)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={tier.price}
                        onChange={(e) => updateTier(tier.id, "price", e.target.value)}
                        placeholder="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Supply</Label>
                      <Input
                        type="number"
                        value={tier.maxSupply}
                        onChange={(e) => updateTier(tier.id, "maxSupply", e.target.value)}
                        placeholder="1000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={tier.description}
                        onChange={(e) => updateTier(tier.id, "description", e.target.value)}
                        placeholder="Brief description of this tier"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure royalties, purchase limits, and resale restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="royalty">Royalty (basis points)</Label>
                  <Input
                    id="royalty"
                    type="number"
                    value={eventData.royaltyBps}
                    onChange={(e) => setEventData({ ...eventData, royaltyBps: e.target.value })}
                    placeholder="500"
                  />
                  <p className="text-sm text-gray-500">500 = 5%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseLimit">Purchase Limit</Label>
                  <Input
                    id="purchaseLimit"
                    type="number"
                    value={eventData.purchaseLimit}
                    onChange={(e) => setEventData({ ...eventData, purchaseLimit: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resellLimit">Resell Limit (basis points)</Label>
                  <Input
                    id="resellLimit"
                    type="number"
                    value={eventData.resellLimitBps}
                    onChange={(e) => setEventData({ ...eventData, resellLimitBps: e.target.value })}
                    placeholder="2000"
                  />
                  <p className="text-sm text-gray-500">2000 = 20% above original</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Tickets</p>
                  <p className="text-2xl font-bold">{calculateTotalSupply().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Fee</p>
                  <p className="text-2xl font-bold">{calculatePlatformFee().toFixed(4)} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiers</p>
                  <p className="text-2xl font-bold">{tiers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Create Event ({calculatePlatformFee().toFixed(4)} ETH)
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
