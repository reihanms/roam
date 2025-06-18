import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  MapPin,
  Users,
  MessageCircle,
  Shield,
  Star,
  Calendar,
  Globe,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Roam Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with fellow travelers in three simple steps and start your
              next adventure together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Discover Trips",
                description:
                  "Browse amazing trips or create your own adventure",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Find Companions",
                description:
                  "Connect with verified travelers who share your interests",
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Chat & Plan",
                description: "Coordinate details in real-time group chats",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Travel Together",
                description: "Create unforgettable memories with new friends",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <div className="text-emerald-600">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Roam</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Travel safely and confidently with our trusted community of
              verified travelers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Verified Profiles",
                description:
                  "All travelers go through our verification process for your safety and peace of mind.",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Review System",
                description:
                  "Read reviews from previous trips to make informed decisions about your travel companions.",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Flexible Planning",
                description:
                  "Create trips with flexible dates and budgets to find the perfect match for your schedule.",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Real-time Chat",
                description:
                  "Stay connected with your travel group through our built-in messaging system.",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Global Destinations",
                description:
                  "Discover trips to destinations worldwide, from popular hotspots to hidden gems.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Driven",
                description:
                  "Join a community of passionate travelers who love exploring the world together.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-emerald-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Travelers Say</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              Join thousands of travelers who have found their perfect travel
              companions through Roam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "I found the most amazing travel companions for my Southeast Asia trip. We're still friends and planning our next adventure!",
                author: "Sarah M.",
                location: "Thailand Trip",
              },
              {
                quote:
                  "Roam made it so easy to find people who shared my love for hiking. Our group trip to Patagonia was incredible.",
                author: "Mike R.",
                location: "Patagonia Adventure",
              },
              {
                quote:
                  "As a solo female traveler, I felt so much safer traveling with the verified companions I met through Roam.",
                author: "Emma L.",
                location: "Europe Backpacking",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 border-white/20 text-white"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-emerald-100 text-sm">
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Discovery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Discover Amazing Trips</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Find your perfect travel companions and join exciting adventures
              around the world.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form action="/trips" method="GET" className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="destination"
                    placeholder="Search destinations..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/trips"
                className="inline-flex items-center px-6 py-3 text-emerald-600 bg-white border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                Browse All Trips
              </a>
              <a
                href="/explore"
                className="inline-flex items-center px-6 py-3 text-emerald-600 bg-white border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                <MapPin className="mr-2 w-4 h-4" />
                Explore Map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of travelers and discover your next unforgettable
            journey. Your perfect travel companion is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium"
            >
              Start Your Journey
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-8 py-4 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-lg font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

