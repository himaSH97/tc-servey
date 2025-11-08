"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import Countdown from "./countdown";
import People from "./people";
import { Logo } from "./svgs";
import Form from "./form";

export default function Hero({ waitlistPeople }: { waitlistPeople: number }) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [isSuccess, setIsSuccess] = useState(false);

  const scrollToBenefits = () => {
    const benefitsSection = document.getElementById("benefits-section");
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center gap-6 mb-6">
        <Logo />
        <div className="flex items-center gap-4 rounded-full border border-border px-4 py-1 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400" />
          </span>
          <p className="uppercase text-sm font-medium">
            available in Mid {"2026"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 max-w-2xl">
        <h2 className="text-4xl font-bold text-foreground">
          {isSuccess ? "You're on the waitlist" : "Join Tour connect"}
        </h2>
        <p className="text-base text-muted-foreground text-center max-w-md">
          {isSuccess
            ? "You've successfully secured your spot. We'll hit you up the moment it's your turn to dive in"
            : "Be among the first to experience Tour connect - the platform connecting tour guides and drivers with tourists. Join the waitlist to get notified when we launch."}
        </p>
        {!isSuccess && (
          <motion.button
            onClick={scrollToBenefits}
            className="mt-4 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
            whileHover={{ y: 5 }}
            transition={{ duration: 0.3 }}
            type="button"
            aria-label="Scroll to see what we offer"
          >
            <span className="text-sm font-medium">See what we offer</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </motion.button>
        )}
        {!isSuccess && (
          <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-border max-w-md">
            <p className="text-sm text-muted-foreground text-center">
              We want to build something you'll love! Share your thoughts and
              help us understand what features matter most to you.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md">
        <Form onSuccessChange={setIsSuccess} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <People count={waitlistPeople} />
      </div>
      <Countdown period={new Date("2026-06-30")} />
    </div>
  );
}
