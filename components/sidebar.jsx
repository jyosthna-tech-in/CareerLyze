"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  PenBox,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Settings,
  Map,
} from "lucide-react";
import { Button } from "./ui/button";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resume Builder",
    href: "/resume",
    icon: FileText,
  },
  {
    name: "Mock Interview",
    href: "/interview",
    icon: GraduationCap,
  },
  {
    name: "Skill Analytics",
    href: "/skill-analytics",
    icon: PenBox,
  },
  {
    name: "Career Roadmap",
    href: "/career-roadmap",
    icon: Map,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-[calc(100vh-4rem)] bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col hidden md:flex sticky top-16 relative"
    >
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-3 my-2 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                )}
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <motion.span
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 font-semibold whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Storage Used block */}
      {!isCollapsed && (
        <div className="p-6 mb-4">
          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Storage Used
            </h4>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[45%]" />
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
