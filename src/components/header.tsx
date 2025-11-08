"use client";

import { cn } from "~/lib/utils";
import { useScroll } from "~/hooks/use-scroll";
import { GithubLogo, NotionLogo } from "./svgs";
import { Button } from "./ui/button";
import Link from "next/link";
import { useLanguage } from "~/providers/language-provider";
import { useTranslations } from "next-intl";

export default function Header() {
  const scrolled = useScroll();
  const { locale, setLocale } = useLanguage();
  const t = useTranslations("header");

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "si" : "en");
  };

  return (
    <header
      className={cn(
        "py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50",
        scrolled &&
          "bg-background/50 md:bg-transparent md:backdrop-blur-none backdrop-blur-sm"
      )}
    >
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <Button
        onClick={toggleLanguage}
        variant="outline"
        size="sm"
        className="text-sm font-medium"
      >
        {locale === "en" ? "සිං" : "EN"}
      </Button>
    </header>
  );
}
