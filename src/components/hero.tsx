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

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center gap-6 ">
        <div className="scale-25 w-fit -m-[12.5%]">
          <Logo />
        </div>

        <div className="flex items-center gap-4 rounded-full border border-border px-4 py-1 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400" />
          </span>
          <p className="uppercase text-sm font-medium">
            {t("availableIn")} {"2026"}
          </p>
        </div>
      </div>

      <About />
      <People count={waitlistPeople} />
      <Countdown period={new Date("2026-06-30")} />

      <Benefits />
      <div className="flex flex-col items-center justify-center gap-2 max-w-2xl mt-4">
        <h2 className="text-4xl font-bold text-foreground my-2">
          {isSuccess ? t("successTitle") : t("defaultTitle")}
        </h2>
        <p className="text-base text-muted-foreground text-center max-w-md">
          {isSuccess ? t("successDescription") : t("defaultDescription")}
        </p>

        {!isSuccess && (
          <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-border max-w-md my-6">
            <p className="text-sm text-muted-foreground text-center">
              {t("feedbackMessage")}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-md mb-[250px]">
        <Form onSuccessChange={setIsSuccess} />
      </div>
    </div>
  );
}
