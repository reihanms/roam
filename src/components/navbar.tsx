"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import UserProfile from "./user-profile";

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
          <Image
            src={isTransparent ? "/logo-white.png" : "/logo.png"}
            alt="Roam logo"
            width={60}
            height={60}
          />
        </Link>
        <div className="hidden md:flex gap-2 items-center">
          <Link href="/how-it-works" passHref>
            <Button
              variant="link"
              className={
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-slate-700"
              }
            >
              How it works
            </Button>
          </Link>
          <Link href="/explore" passHref>
            <Button
              variant="link"
              className={
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-slate-700"
              }
            >
              Explore
            </Button>
          </Link>
          <Link href="/trips" passHref>
            <Button
              variant="link"
              className={
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-slate-700"
              }
            >
              Trips
            </Button>
          </Link>
        </div>
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
              <UserProfile isTransparent={isTransparent} />
            </>
          ) : (
            <>
              <Link href="/sign-in" passHref>
                <Button
                  variant="ghost"
                  className={
                    isTransparent
                      ? "text-white hover:bg-white/10 hover:text-white"
                      : ""
                  }
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button
                  variant={isTransparent ? "outline" : "default"}
                  className={isTransparent ? "bg-white/10 text-white" : ""}
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

