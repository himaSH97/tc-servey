"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="flex flex-col justify-center items-center gap-4 pb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
