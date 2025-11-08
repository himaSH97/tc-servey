"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";

interface FormProps {
  onSuccessChange?: (success: boolean) => void;
}

export default function WaitlistForm({ onSuccessChange }: FormProps) {
  const t = useTranslations("form");
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    userType: "",
    userTypeOther: "",
    interested: "",
    features: [] as string[],
    featuresOther: "",
    willingToPay: "",
    feeStructure: "",
    feeStructureOther: "",
    comfortableAmount: "",
    likelihood: "",
    additionalComments: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Step 1: Email validation
    if (step === 1) {
      if (!formData.email || !isValidEmail(formData.email)) {
        toast.error(t("errors.invalidEmail"));
        return;
      }
      setStep(2);
      return;
    }

    // Step 2: Name validation
    if (step === 2) {
      if (!formData.name.trim()) {
        toast.error(t("errors.nameRequired"));
        return;
      }
      setStep(3);
      return;
    }

    // Step 3: User type validation
    if (step === 3) {
      if (!formData.userType) {
        toast.error(t("errors.userTypeRequired"));
        return;
      }
      if (formData.userType === "Other" && !formData.userTypeOther.trim()) {
        toast.error(t("errors.specifyRole"));
        return;
      }
      setStep(4);
      return;
    }

    // Step 4: Interest validation
    if (step === 4) {
      if (!formData.interested) {
        toast.error(t("errors.interestRequired"));
        return;
      }
      setStep(5);
      return;
    }

    // Step 5: Features validation
    if (step === 5) {
      if (formData.features.length === 0) {
        toast.error(t("errors.featuresRequired"));
        return;
      }
      setStep(6);
      return;
    }

    // Step 6: Willing to pay validation
    if (step === 6) {
      if (!formData.willingToPay) {
        toast.error(t("errors.optionRequired"));
        return;
      }
      setStep(7);
      return;
    }

    // Step 7: Fee structure validation (conditional)
    if (step === 7) {
      if (
        formData.willingToPay === "Yes" ||
        formData.willingToPay === "Maybe"
      ) {
        if (!formData.feeStructure) {
          toast.error(t("errors.feeStructureRequired"));
          return;
        }
        if (
          formData.feeStructure === "Other" &&
          !formData.feeStructureOther.trim()
        ) {
          toast.error(t("errors.specifyFeeStructure"));
          return;
        }
      }
      setStep(8);
      return;
    }

    // Step 8: Comfortable amount validation (conditional)
    if (step === 8) {
      if (
        formData.willingToPay === "Yes" ||
        formData.willingToPay === "Maybe"
      ) {
        if (!formData.comfortableAmount.trim()) {
          toast.error(t("errors.amountRequired"));
          return;
        }
      }
      setStep(9);
      return;
    }

    // Step 9: Likelihood validation
    if (step === 9) {
      if (!formData.likelihood) {
        toast.error(t("errors.likelihoodRequired"));
        return;
      }
      setStep(10);
      return;
    }

    // Step 10: Final submission (additional comments are optional)
    try {
      setLoading(true);

      const promise = new Promise((resolve, reject) => {
        fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((notionResponse) => {
            if (!notionResponse) return;

            if (!notionResponse.ok) {
              if (notionResponse.status === 429) {
                reject("Rate limited");
              } else {
                reject("Notion insertion failed");
              }
            } else {
              resolve({ name: formData.name });
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: t("toast.loading"),
        success: (data) => {
          setFormData({
            email: "",
            name: "",
            userType: "",
            userTypeOther: "",
            interested: "",
            features: [],
            featuresOther: "",
            willingToPay: "",
            feeStructure: "",
            feeStructureOther: "",
            comfortableAmount: "",
            likelihood: "",
            additionalComments: "",
          });
          setSuccess(true);
          onSuccessChange?.(true);
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: [
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffff00",
                "#ff00ff",
                "#00ffff",
              ],
            });
          }, 100);
          return t("toast.success");
        },
        error: (error) => {
          if (error === "Rate limited") {
            return t("toast.errorRateLimit");
          }
          if (error === "Email sending failed") {
            return t("toast.errorEmail");
          }
          if (error === "Notion insertion failed") {
            return t("toast.errorNotion");
          }
          return t("toast.errorGeneral");
        },
      });

      promise.finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      email: "",
      name: "",
      userType: "",
      userTypeOther: "",
      interested: "",
      features: [],
      featuresOther: "",
      willingToPay: "",
      feeStructure: "",
      feeStructureOther: "",
      comfortableAmount: "",
      likelihood: "",
      additionalComments: "",
    });
    setSuccess(false);
    onSuccessChange?.(false);
  };

  const renderStep = () => {
    const inputClass =
      "w-full bg-background border border-border text-foreground px-3 sm:px-4 py-2.5 sm:py-3 rounded-[12] focus:outline-1 transition-all duration-200 focus:outline-offset-4 focus:outline-[#e5ff00] text-sm sm:text-base";
    const radioClass =
      "flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 border border-border rounded-[12] hover:border-[#e5ff00] transition-colors duration-200 cursor-pointer text-sm sm:text-base";
    const buttonClass =
      "w-full font-semibold bg-[#e5ff00] text-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-[12] hover:bg-opacity-90 transition-opacity duration-200 disabled:opacity-50 text-sm sm:text-base";

    switch (step) {
      case 1:
        return (
          <motion.div
            key="email-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step1.title")}
            </h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("step1.placeholder")}
              className={inputClass}
              disabled={loading}
              required
            />
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="name-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">{t("step2.title")}</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("step2.placeholder")}
              className={inputClass}
              disabled={loading}
              required
            />
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="usertype-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">{t("step3.title")}</h3>
            <div className="space-y-2">
              {[
                { value: "Driver with a tourist vehicle", key: "driver" },
                { value: "Tour guide", key: "guide" },
                { value: "Both", key: "both" },
              ].map((option) => (
                <label key={option.value} className={radioClass}>
                  <input
                    type="radio"
                    name="userType"
                    value={option.value}
                    checked={formData.userType === option.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{t(`step3.options.${option.key}` as any)}</span>
                </label>
              ))}
              <label className={radioClass}>
                <input
                  type="radio"
                  name="userType"
                  value="Other"
                  checked={formData.userType === "Other"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#e5ff00]"
                />
                <span>{t("step3.options.other")}</span>
              </label>
              {formData.userType === "Other" && (
                <input
                  type="text"
                  name="userTypeOther"
                  value={formData.userTypeOther}
                  onChange={handleChange}
                  placeholder={t("step3.placeholderOther")}
                  className={inputClass}
                />
              )}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="interested-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step4.title")}
            </h3>
            <div className="space-y-2">
              {[
                { value: "Yes, definitely", key: "yes" },
                { value: "Maybe, depends on the details", key: "maybe" },
                { value: "Not interested", key: "no" },
              ].map((option) => (
                <label key={option.value} className={radioClass}>
                  <input
                    type="radio"
                    name="interested"
                    value={option.value}
                    checked={formData.interested === option.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{t(`step4.options.${option.key}` as any)}</span>
                </label>
              ))}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="features-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step5.title")}
            </h3>
            <div className="space-y-2">
              {[
                { value: "Tourist ride bookings", key: "rides" },
                { value: "Tour guide bookings", key: "tours" },
                { value: "Real-time trip requests", key: "realtime" },
                { value: "Ability to set my own prices", key: "pricing" },
                { value: "Ratings and reviews", key: "ratings" },
                { value: "Secure in-app payments", key: "payments" },
              ].map((feature) => (
                <label key={feature.value} className={radioClass}>
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature.value)}
                    onChange={() => handleCheckboxChange(feature.value)}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{t(`step5.options.${feature.key}` as any)}</span>
                </label>
              ))}
              <label className={radioClass}>
                <input
                  type="checkbox"
                  checked={formData.features.includes("Other")}
                  onChange={() => handleCheckboxChange("Other")}
                  className="w-4 h-4 text-[#e5ff00]"
                />
                <span>{t("step5.options.other")}</span>
              </label>
              {formData.features.includes("Other") && (
                <input
                  type="text"
                  name="featuresOther"
                  value={formData.featuresOther}
                  onChange={handleChange}
                  placeholder={t("step3.placeholderOther")}
                  className={inputClass}
                />
              )}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="willing-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step6.title")}
            </h3>
            <div className="space-y-2">
              {[
                { value: "Yes", key: "yes" },
                { value: "Maybe, depends on the fee", key: "maybe" },
                { value: "No", key: "no" },
              ].map((option) => (
                <label key={option.value} className={radioClass}>
                  <input
                    type="radio"
                    name="willingToPay"
                    value={option.value}
                    checked={formData.willingToPay === option.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{t(`step6.options.${option.key}` as any)}</span>
                </label>
              ))}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 7:
        // Skip to step 9 if user is not willing to pay
        if (formData.willingToPay === "No") {
          setTimeout(() => setStep(9), 0);
          return null;
        }
        return (
          <motion.div
            key="feestructure-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step7.title")}
            </h3>
            <div className="space-y-2">
              {[
                { value: "Flat fee per booking (e.g., Rs. 500)", key: "flat" },
                { value: "Percentage of the booking value (e.g., 10%)", key: "percentage" },
                { value: "Monthly subscription", key: "subscription" },
              ].map((option) => (
                <label key={option.value} className={radioClass}>
                  <input
                    type="radio"
                    name="feeStructure"
                    value={option.value}
                    checked={formData.feeStructure === option.value}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{t(`step7.options.${option.key}` as any)}</span>
                </label>
              ))}
              <label className={radioClass}>
                <input
                  type="radio"
                  name="feeStructure"
                  value="Other"
                  checked={formData.feeStructure === "Other"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#e5ff00]"
                />
                <span>{t("step7.options.other")}</span>
              </label>
              {formData.feeStructure === "Other" && (
                <input
                  type="text"
                  name="feeStructureOther"
                  value={formData.feeStructureOther}
                  onChange={handleChange}
                  placeholder={t("step3.placeholderOther")}
                  className={inputClass}
                />
              )}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 8:
        // Skip to step 9 if user is not willing to pay
        if (formData.willingToPay === "No") {
          setTimeout(() => setStep(9), 0);
          return null;
        }
        return (
          <motion.div
            key="amount-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step8.title")}
            </h3>
            <input
              type="text"
              name="comfortableAmount"
              value={formData.comfortableAmount}
              onChange={handleChange}
              placeholder={t("step8.placeholder")}
              className={inputClass}
              disabled={loading}
            />
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 9:
        return (
          <motion.div
            key="likelihood-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step9.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("step9.subtitle")}
            </p>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className={radioClass}>
                  <input
                    type="radio"
                    name="likelihood"
                    value={num.toString()}
                    checked={formData.likelihood === num.toString()}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e5ff00]"
                  />
                  <span>{num}</span>
                </label>
              ))}
            </div>
            <button type="submit" className={buttonClass} disabled={loading}>
              {t("continue")}
            </button>
          </motion.div>
        );

      case 10:
        return (
          <motion.div
            key="comments-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold">
              {t("step10.title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("step10.subtitle")}</p>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              placeholder={t("step10.placeholder")}
              className={inputClass + " min-h-[120px] resize-none"}
              disabled={loading}
            />
            <button type="submit" className={buttonClass} disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <title>Loading spinner</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("submitting")}
                </span>
              ) : (
                t("submit")
              )}
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full relative" style={{ willChange: "auto" }}>
      {success ? (
        <motion.div
          className="p-4 sm:p-6 flex flex-col justify-center items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-base sm:text-lg">
            {t("success.message")}
          </p>
          <button
            onClick={resetForm}
            className="bg-[#e5ff00] text-black px-4 sm:px-6 py-2 rounded-[12] font-semibold hover:bg-opacity-90 transition-all text-sm sm:text-base"
            type="button"
          >
            {t("success.button")}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-4 flex justify-between items-center text-xs sm:text-sm text-muted-foreground">
            <span>{t("step")} {step} {t("of")} 10</span>
            <div className="flex space-x-0.5 sm:space-x-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-4 sm:w-6 rounded-full transition-all ${
                    i < step ? "bg-[#e5ff00]" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </form>
      )}
    </div>
  );
}
