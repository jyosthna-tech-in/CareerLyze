"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Removed "as const" for JavaScript compatibility
const themes = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    activeColor: "text-yellow-500",
    hoverBg: "hover:bg-yellow-500/10",
    activeBg: "bg-yellow-500/15",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    activeColor: "text-blue-400",
    hoverBg: "hover:bg-blue-500/10",
    activeBg: "bg-blue-500/15",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    activeColor: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    activeBg: "bg-emerald-500/15",
  },
];

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-xl opacity-50"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`
            relative h-10 w-10 rounded-xl 
            border border-border/50
            transition-all duration-300 ease-out
            hover:scale-105 hover:border-border/80
            hover:shadow-lg
            ${isDark ? "hover:shadow-blue-500/20 hover:bg-blue-500/5" : "hover:shadow-yellow-500/20 hover:bg-yellow-500/5"}
            ${isOpen ? "scale-105 border-border/80 bg-secondary/50 shadow-lg" : ""}
          `}
        >
          {/* Sun Icon - Light Mode */}
          <Sun
            className={`
              absolute h-[1.15rem] w-[1.15rem]
              text-yellow-500
              transition-all duration-500 ease-out
              ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
            `}
          />

          {/* Moon Icon - Dark Mode */}
          <Moon
            className={`
              absolute h-[1.15rem] w-[1.15rem]
              text-blue-400
              transition-all duration-500 ease-out
              ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
            `}
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-48 p-2
          rounded-2xl
          border border-border/50
          bg-card/95 backdrop-blur-xl
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="px-3 py-1.5 mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Appearance
          </p>
        </div>

        {/* Divider */}
        <div className="mx-2 mb-2 h-px bg-border/40" />

        {/* Theme Options */}
        {themes.map(
          ({ value, label, icon: Icon, activeColor, hoverBg, activeBg }) => {
            const isActive = theme === value;

            return (
              <DropdownMenuItem
                key={value}
                onClick={() => setTheme(value)}
                className={`
                  flex cursor-pointer items-center gap-3
                  rounded-xl px-3 py-2.5 mb-0.5
                  text-sm font-medium
                  outline-none select-none
                  transition-all duration-200 ease-out
                  ${hoverBg}
                  hover:shadow-md
                  ${
                    isActive
                      ? `${activeBg} ${activeColor} shadow-sm`
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {/* Icon Container */}
                <span
                  className={`
                    flex h-7 w-7 items-center justify-center rounded-lg
                    transition-all duration-200
                    ${isActive ? `${activeBg} shadow-inner` : "bg-secondary/50"}
                  `}
                >
                  <Icon
                    className={`
                      h-3.5 w-3.5 transition-all duration-200
                      ${isActive ? activeColor : "text-muted-foreground"}
                    `}
                  />
                </span>

                <span className="flex-1">{label}</span>

                {/* Active Checkmark */}
                {isActive && (
                  <Check
                    className={`
                      h-3.5 w-3.5 ml-auto
                      transition-all duration-200
                      ${activeColor}
                    `}
                  />
                )}
              </DropdownMenuItem>
            );
          }
        )}

        {/* Footer */}
        <div className="mt-1 px-3 pt-2 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            {theme === "system"
              ? "Following system preference"
              : `${theme === "light" ? "☀️" : "🌙"} ${theme} mode active`}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}