"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" prefetch className="text-xl font-bold">
            <Image src="/logo.png" alt="Roam logo" width={50} height={50} />
          </Link>
          <div className="hidden md:flex gap-2 items-center">
            <Link href="/explore" passHref>
              <Button variant="link" className="text-slate-700">
                Explore
              </Button>
            </Link>
            <Link href="/trips" passHref>
              <Button variant="link" className="text-slate-700">
                Trips
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

