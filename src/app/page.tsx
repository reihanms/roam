import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { MotionDiv } from "@/components/motion-div";
import Navbar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  Award,
  Globe,
  Heart,
  Map,
  MapPin,
  MessagesSquare,
  Plane,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trips } = await supabase
    .from("trips")
    .select("id, title, destination, start_date, end_date")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <>
      <div className="min-h-screen bg-white text-gray-800">
        <Navbar />
        <Hero />

        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Your Adventure in 4 Easy Steps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We've simplified the process of finding your next travel story.
              </p>
            </div>
            <div className="relative">
              {/* Vertical Line */}
              <div
                className="absolute left-1/2 -ml-px w-0.5 h-full bg-gray-200 hidden md:block"
                aria-hidden="true"
              ></div>
              <div className="space-y-16">
                {[
                  {
                    icon: Search,
                    title: "Discover Trips & People",
                    description:
                      "Use our powerful search to find adventures that match your interests, or post your own trip to attract the right crew.",
                  },
                  {
                    icon: MessagesSquare,
                    title: "Connect & Plan",
                    description:
                      "Chat with potential travel mates in our secure messaging system to align on plans, vibes, and expectations.",
                  },
                  {
                    icon: Plane,
                    title: "Book & Go",
                    description:
                      "Once your group is set, finalize your plans and get ready for an unforgettable experience. The world is waiting!",
                  },
                  {
                    icon: Heart,
                    title: "Share & Repeat",
                    description:
                      "Leave reviews, share memories, and stay connected with your new friends. Your next journey is just around the corner.",
                  },
                ].map((step, index) => (
                  <div key={index} className="md:flex items-center w-full">
                    <div className="md:w-1/2 md:pr-8">
                      {index % 2 === 0 && (
                        <MotionDiv
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="text-center md:text-right"
                        >
                          <h3 className="text-2xl font-bold text-emerald-600 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">{step.description}</p>
                        </MotionDiv>
                      )}
                    </div>
                    <div className="relative w-16 h-16 mx-auto my-4 md:my-0 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="md:w-1/2 md:pl-8">
                      {index % 2 !== 0 && (
                        <MotionDiv
                          initial={{ opacity: 0, x: 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="text-center md:text-left"
                        >
                          <h3 className="text-2xl font-bold text-emerald-600 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">{step.description}</p>
                        </MotionDiv>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Roam Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                More Than a Platform, It's a Promise
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                We're committed to building a trusted, vibrant, and supportive
                community for travelers worldwide. Here's what sets us apart.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Safety First",
                  description:
                    "Our robust verification and review system creates a trusted environment for everyone.",
                  gradient: "from-blue-100 to-blue-50",
                },
                {
                  icon: Award,
                  title: "Quality Connections",
                  description:
                    "We focus on compatibility, helping you find companions who truly share your travel style.",
                  gradient: "from-purple-100 to-purple-50",
                },
                {
                  icon: Globe,
                  title: "Global Community",
                  description:
                    "Tap into a diverse network of passionate travelers and discover unique, user-hosted trips.",
                  gradient: "from-teal-100 to-teal-50",
                },
                {
                  icon: Users,
                  title: "Community-Driven",
                  description:
                    "From flexible planning tools to integrated chat, our features are designed for group travel.",
                  gradient: "from-orange-100 to-orange-50",
                },
                {
                  icon: Map,
                  title: "Endless Discovery",
                  description:
                    "Explore trips to every corner of the globe, from bustling cities to remote landscapes.",
                  gradient: "from-green-100 to-green-50",
                },
                {
                  icon: Heart,
                  title: "Built on Trust",
                  description:
                    "We foster a culture of respect and transparency to ensure a positive experience for all.",
                  gradient: "from-pink-100 to-pink-50",
                },
              ].map((feature, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className={`relative p-8 rounded-2xl h-full overflow-hidden bg-white shadow-lg border border-gray-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                  >
                    <div
                      className={`absolute -top-1/4 -right-1/4 w-60 h-60 bg-gradient-to-bl ${feature.gradient} rounded-full filter blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-500`}
                    ></div>
                    <div className="relative">
                      <div className="mb-4">
                        <feature.icon className="w-10 h-10 text-gray-800" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* Discover Amazing Trips Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Discover Your Next Destination
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                Search for a specific place or browse our featured trips to get
                inspired.
              </p>
              <div className="max-w-2xl mx-auto space-y-4 flex flex-col gap-2">
                <form action="/trips" method="GET">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      name="destination"
                      placeholder="Search for 'Thailand', 'Patagonia', 'Italy'..."
                      className="w-full h-14 pl-12 pr-4 rounded-full border-gray-300 focus:ring-2 focus:ring-emerald-500 text-lg"
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full px-6"
                    >
                      Search
                    </Button>
                  </div>
                </form>
                <span className="">OR</span>
                <Link href="/explore">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-gray-300 hover:bg-gray-50"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Explore Maps
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips?.map((trip, index) => (
                <MotionDiv
                  key={trip.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/dashboard/trips/${trip.id}`} className="h-full">
                    <div className="rounded-xl shadow-lg group h-full flex flex-col bg-white border border-gray-200/80 hover:border-emerald-500/50 hover:shadow-emerald-100 transition-all duration-300">
                      <div className="p-6 flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-emerald-100 rounded-full">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Destination</p>
                            <p className="font-bold text-lg text-gray-800">
                              {trip.destination}
                            </p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {trip.title}
                        </h3>
                      </div>
                      <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex justify-between items-center">
                        <Badge variant="secondary">
                          {new Date(trip.start_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}{" "}
                          -{" "}
                          {new Date(trip.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Badge>
                        <div className="flex items-center text-sm font-medium text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all duration-300">
                          <span>View Trip</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-emerald-600 text-white rounded-xl shadow-2xl shadow-emerald-200 p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Your Next Adventure is Calling
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-emerald-100 text-lg">
                Sign up today and start exploring a world of travel
                possibilities. Your community awaits.
              </p>
              <Link href={user ? "/dashboard" : "/sign-up"}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  Join Roam for Free
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

