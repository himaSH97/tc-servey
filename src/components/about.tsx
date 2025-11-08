"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  return (
    <div className="w-full py-5 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {t("whatIs.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl px-2">
            {t("whatIs.description")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
