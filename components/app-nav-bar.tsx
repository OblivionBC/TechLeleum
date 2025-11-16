"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/navigation-menu";

export default function AppNavBar() {
  const pathname = usePathname();

  
  const isActive = (path: string) => pathname === path;

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
          Indigenous Youth Code
        </Link>

        
        <NavigationMenu>
          <NavigationMenuList className="flex gap-12">

            {[
              { href: "/", label: "Home" },
              { href: "/lessons", label: "Lessons" },
              { href: "/mentors", label: "Mentors" },
              { href: "/about", label: "About" },
            ].map((item) => (
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

                    {/* ⭐ Active underline */}
                    {isActive(item.href) && (
                      <span className="absolute left-0 right-0 -bottom-[3px] h-[3px] bg-[#F6C85A] rounded-full"></span>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

          </NavigationMenuList>
        </NavigationMenu>

        
        <Link
          href="/mentor-portal"
          className="
            px-5 py-2.5 rounded-xl text-white 
            bg-[#C86A00] border border-[#FFB84D]
            text-lg font-medium hover:bg-[#D97A10] transition
          "
        >
          Mentor Portal
        </Link>
      </div>
    </header>
  );
}