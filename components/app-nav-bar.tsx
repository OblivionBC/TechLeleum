"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function AppNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUser(user);
    };

    checkAuth();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  /**
   * Retrieves the user's display name from metadata, falls back to email part, or "User".
   */
  const getUserDisplayName = () => {
    if (!user) return "User";
    // Checks for full_name, name, or the display_name from the public.youth table 
    // (if mapped to user_metadata) or derives from email.
    return user.user_metadata?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  };

  const getInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isActive = (path: string) => pathname === path;
  const routes = isLoggedIn === false ? [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ] : [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/mentors", label: "Mentors" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="w-full bg-[#823A00] relative after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[4px] after:bg-gradient-to-r after:from-orange-400 after:via-pink-500 after:to-purple-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <Link 
          href="/"
          className={`
            text-2xl font-semibold transition
            ${isActive("/") ? "text-white" : "text-[#FBE9C6] hover:text-white"}
          `}
        >
          Tech Lelum
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-12">
            {routes.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={`
                      pb-1 transition relative text-lg
                      ${isActive(item.href) ? "text-white" : "text-[#FBE9C6] hover:text-white"}
                    `}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute left-0 right-0 -bottom-[3px] h-[3px] bg-[#F6C85A] rounded-full"></span>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {isLoggedIn === false && (
            <>
              <Link
                href="/mentors"
                className="
                  px-5 py-2.5 rounded-xl text-white 
                  bg-[#C86A00] border border-[#FFB84D]
                  text-lg font-medium hover:bg-[#D97A10] transition
                "
              >
                Mentors
              </Link>
              <Link
                href="/youth-login"
                className="
                  px-5 py-2.5 rounded-xl text-white 
                  bg-[#C86A00] border border-[#FFB84D]
                  text-lg font-medium hover:bg-[#D97A10] transition
                "
              >
                Youth Login
              </Link>
            </>
          )}
          {isLoggedIn === true && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    flex items-center justify-center
                    w-10 h-10 rounded-full
                    bg-[#C86A00] border border-[#FFB84D]
                    text-white font-semibold
                    hover:bg-[#D97A10] transition
                    focus:outline-none focus:ring-2 focus:ring-[#FFB84D] focus:ring-offset-2
                  "
                  aria-label="User menu"
                >
                  {getInitials()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">

                <div className="px-3 py-2 space-y-0.5">
                  <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p> 
                  {(
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  )}
                </div>

                <DropdownMenuSeparator />

                {/* LOGOUT ITEM */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}