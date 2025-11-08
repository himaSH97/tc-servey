"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function Benefits() {
  const t = useTranslations("benefits");

  const benefits = [
    {
      icon: "💰",
      titleKey: "items.pricing.title",
      descriptionKey: "items.pricing.description",
    },
    {
      icon: "🤝",
      titleKey: "items.noMiddlemen.title",
      descriptionKey: "items.noMiddlemen.description",
    },
    {
      icon: "📈",
      titleKey: "items.earnings.title",
      descriptionKey: "items.earnings.description",
    },
    {
      icon: "⏰",
      titleKey: "items.flexible.title",
      descriptionKey: "items.flexible.description",
    },
    {
      icon: "⭐",
      titleKey: "items.reputation.title",
      descriptionKey: "items.reputation.description",
    },
    {
      icon: "🔒",
      titleKey: "items.payments.title",
      descriptionKey: "items.payments.description",
    },
  ];
  return (
    <div id="benefits-section" className="py-4 sm:px-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {t("title")}
          </h3>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-muted/40 border border-border rounded-lg hover:border-[#e5ff00] transition-colors duration-200"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {t(benefit.titleKey as any)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(benefit.descriptionKey as any)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
