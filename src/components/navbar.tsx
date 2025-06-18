"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import { createClient } from "../../supabase/client";
import UserProfile from "./user-profile";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, [supabase]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial render

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isTransparent = pathname === "/" && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold flex items-center gap-2"
        >
          <MapPin
            className={`w-6 h-6 transition-colors ${
              isTransparent ? "text-white" : "text-emerald-600"
            }`}
          />
          <span className={isTransparent ? "text-white" : "text-gray-900"}>
            Roam
          </span>
        </Link>
        <div className="flex gap-2 items-center h-10">
          {loading ? (
            <div className="flex gap-2">
              <div className="w-24 h-10 bg-gray-200/80 rounded-md animate-pulse" />
              <div className="w-10 h-10 bg-gray-200/80 rounded-full animate-pulse" />
            </div>
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant={isTransparent ? "outline" : "default"}>
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className={isTransparent ? "text-white hover:text-white" : ""}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant={isTransparent ? "outline" : "default"}
                  className={
                    isTransparent
                      ? "text-white border-white hover:bg-white hover:text-black"
                      : ""
                  }
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

