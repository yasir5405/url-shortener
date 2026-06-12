"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DiaTextReveal } from "../ui/dia-text-reveal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={cn(
        "w-full h-14 px-60 fixed top-0 left-0 z-10 flex items-center justify-between transition-all duration-200 ease-linear border border-transparent",
        scrolled &&
          "bg-linear-to-b from-white/60 via-white/40 to-white/20 backdrop-blur-md border-b border-neutral-200",
      )}
    >
      <Link href={"/"} className="font-bold text-xl">
        <DiaTextReveal
          className="text-xl font-semibold tracking-tight"
          text="ShoreLine"
          colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
        />
      </Link>

      <div className="h-full w-fit flex items-center justify-center gap-2">
        <Button
          size={"lg"}
          variant={"outline"}
          className="px-4 py-4 text-sm font-normal"
        >
          Log in
        </Button>

        <Button size={"lg"} className="px-4 py-4 text-sm font-normal">
          Sign up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
