"use client";

import { createTripAction } from "@/app/actions";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";
import dynamic from "next/dynamic";

const LocationSearch = dynamic(
  () =>
    import("@/components/ui/location-search").then((mod) => mod.LocationSearch),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function CreateTripPage() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-background min-h-screen">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
            <p className="text-muted-foreground">
              Share your travel plans and find companions for your next
              adventure.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Fill in the details about your upcoming trip to attract the
                right travel companions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                ref={formRef}
                action={createTripAction}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Trip Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Backpacking through Southeast Asia"
                      required
                    />
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <LocationSearch
                      onLocationSelect={({ coordinates }) => {
                        if (formRef.current) {
                          (
                            formRef.current.elements.namedItem(
                              "longitude"
                            ) as HTMLInputElement
                          ).value = coordinates[1].toString();
                          (
                            formRef.current.elements.namedItem(
                              "latitude"
                            ) as HTMLInputElement
                          ).value = coordinates[0].toString();
                        }
                      }}
                    />
                    <input type="hidden" name="longitude" />
                    <input type="hidden" name="latitude" />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        required
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <Label>Budget Estimate (USD)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="budget_min"
                          className="text-sm text-muted-foreground"
                        >
                          Minimum Budget
                        </Label>
                        <Input
                          id="budget_min"
                          name="budget_min"
                          type="number"
                          placeholder="500"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="budget_max"
                          className="text-sm text-muted-foreground"
                        >
                          Maximum Budget
                        </Label>
                        <Input
                          id="budget_max"
                          name="budget_max"
                          type="number"
                          placeholder="2000"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Max Participants */}
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">
                      Maximum Participants
                    </Label>
                    <Select name="max_participants" defaultValue="4">
                      <SelectTrigger>
                        <SelectValue placeholder="Select max participants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5">5 people</SelectItem>
                        <SelectItem value="6">6 people</SelectItem>
                        <SelectItem value="8">8 people</SelectItem>
                        <SelectItem value="10">10 people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Trip Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your trip plans, what you're looking for in travel companions, activities you want to do, etc."
                      rows={6}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Trip
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

