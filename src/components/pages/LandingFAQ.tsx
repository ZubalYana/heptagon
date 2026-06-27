import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function LandingFAQ() {
  const faq = [
    {
      question: "Is Heptagon free?",
      answer:
        "Absolutely! The application is completely free, along with all of its functionality.",
    },
    {
      question: "Can I still use it without Google Calendar?",
      answer:
        "Sure thing. Google Calendar is just a useful feature, which you're free to opt out of.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "Of course — I do my best to keep the application responsive across all devices.",
    },
    {
      question: "Who developed the application?",
      answer:
        "Short answer: me. Longer one: I'm Yana, an aspiring software engineer. The project started as something built solely for me and my friends, but I'm now expanding it for everyone.",
    },
    {
      question: "Can I request a feature or ask another question?",
      answer: "I'd love to hear from you! My contacts are in the footer.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="w-full lg:max-h-screen flex flex-col items-center p-[20px] lg:p-[40px]">
      <h2 className="uppercase text-[24px] lg:text-[28px] font-semibold leading-tight shrink-0">
        FAQ
      </h2>

      <div className="w-full max-w-[700px] flex-1 min-h-0 flex flex-col justify-center gap-y-3 mt-8 lg:mt-12">
        {faq.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-x-4 p-4 lg:p-5 cursor-pointer text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] lg:text-[16px] font-medium text-white">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="shrink-0 text-white/50"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-[14px] text-[#F5F5F5]/60 leading-relaxed px-4 lg:px-5 pb-4 lg:pb-5">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}