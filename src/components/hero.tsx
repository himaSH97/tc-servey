"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import Countdown from "./countdown";
import People from "./people";
import { Logo } from "./svgs";
import Form from "./form";
import About from "./about";
import Benefits from "./benefits";

export default function Hero({ waitlistPeople }: { waitlistPeople: number }) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("hero");

  const scrollToForm = () => {
    const formElement = document.getElementById("waitlist-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full px-2 sm:px-4">
      <div className="flex flex-col items-center justify-center gap-6 w-full">
        <div className="scale-25 w-fit -mt-[100px] -mb-[80px] flex items-center justify-center">
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 rounded-full border border-border px-3 sm:px-4 py-1 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400" />
          </span>
          <p className="uppercase text-xs sm:text-sm font-medium">
            {t("availableIn")} {"2026"}
          </p>
        </div>

        <motion.button
          onClick={scrollToForm}
          className="bg-[#e5ff00] text-black font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-opacity-90 transition-all duration-200 text-xs sm:text-sm shadow-[0_0_15px_rgba(229,255,0,0.5)] hover:shadow-[0_0_25px_rgba(229,255,0,0.8)] animate-pulse-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("joinWaitlist") || "Join the Waitlist"}
        </motion.button>
      </div>

      <About />
      <People count={waitlistPeople} />
      <Countdown period={new Date("2026-06-30")} />

      <Benefits />
      <div
        id="waitlist-form"
        className="flex flex-col items-center justify-center gap-2 w-full max-w-2xl mt-4 px-4 scroll-mt-20"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground my-2 text-center">
          {isSuccess ? t("successTitle") : t("defaultTitle")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md px-2">
          {isSuccess ? t("successDescription") : t("defaultDescription")}
        </p>

        {!isSuccess && (
          <div className="mt-2 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border w-full max-w-md my-6">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              {t("feedbackMessage")}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md mb-[250px] px-4 shadow-[0_0_15px_rgba(229,255,0,0.5)] hover:shadow-[0_0_25px_rgba(229,255,0,0.8)] animate-pulse-glow p-6 rounded-xl">
        <Form onSuccessChange={setIsSuccess} />
      </div>
    </div>
  );
}
