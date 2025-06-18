"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  MapPin,
  Users,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, #1f2937, #111827, #3b82f6, #16a34a, #1f2937)",
          backgroundSize: "400% 100%",
        }}
      />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl sm:text-6xl font-bold text-white mb-8 tracking-tight"
              variants={itemVariants}
            >
              Find Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                Travel
              </span>{" "}
              Companion
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Connect with like-minded travelers, discover amazing trips, and
              create unforgettable memories together. Your next adventure is
              just a click away.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 text-lg font-medium"
              >
                Start Exploring
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center px-8 py-4 text-gray-800 bg-white rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-lg font-medium"
              >
                How It Works
              </Link>
            </motion.div>

            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Verified travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Safe & secure</span>
              </div>
            </motion.div>

            {/* Quick stats */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Travelers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">25K+</div>
                <div className="text-sm text-gray-600">Connections Made</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

