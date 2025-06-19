"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

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
                href="/how-it-works"
                className="inline-flex items-center px-8 py-4 text-white bg-transparent border border-emerald-400 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg font-medium"
              >
                How It Works
              </Link>
            </motion.div>

            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5" />
                <span>Verified travelers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5" />
                <span>Safe & secure</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

