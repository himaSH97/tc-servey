"use client";

import { motion } from "motion/react";

const benefits = [
  {
    icon: "💰",
    title: "Set Your Own Prices",
    description: "You're in complete control of what you charge. No fixed rates.",
  },
  {
    icon: "🤝",
    title: "No Middlemen",
    description: "Direct connection between tourists and service providers.",
  },
  {
    icon: "📈",
    title: "Keep More Earnings",
    description: "Fair commission structure means more money in your pocket.",
  },
  {
    icon: "⏰",
    title: "Be Your Own Boss",
    description: "Flexible schedule - work when you want, where you want.",
  },
  {
    icon: "⭐",
    title: "Build Your Reputation",
    description: "Ratings and reviews help you grow your business and attract more tourists.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    description: "Safe, in-app payment system protects both you and your customers.",
  },
];

export default function Benefits() {
  return (
    <div id="benefits-section" className="py-14 sm:px-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-3">
            Why Choose Tour connect?
          </h3>
          <p className="text-muted-foreground">
            Empowering tour guides and drivers with the tools they need to succeed
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-muted/40 border border-border rounded-lg hover:border-[#e5ff00] transition-colors duration-200"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

