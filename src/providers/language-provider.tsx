"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IntlProvider } from "next-intl";
import enMessages from "../locales/en.json";
import siMessages from "../locales/si.json";

type Locale = "en" | "si";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const messagesMap = {
  en: enMessages,
  si: siMessages,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "si")) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (isClient) {
      localStorage.setItem("locale", newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <IntlProvider 
        locale={locale} 
        messages={messagesMap[locale]}
        timeZone="Asia/Colombo"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

