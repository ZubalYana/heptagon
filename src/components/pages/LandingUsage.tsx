import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingUsage() {
  const slides = [
    {
      img: "/HeptagonLandingScreen1.jpg",
      title: "Just start planning.",
      description:
        "I believe planning should stay minimal, so we can focus on actually doing things. That's why the app keeps it simple: click on a day, list your tasks with priority levels, and break them down into subtasks.",
    },
    {
      img: "/HeptagonLandingScreen2.jpg",
      title: "Track your progress.",
      description:
        "Before building the app, I'd long been curious about dopamine and motivation. I learned that visualizing what you've already achieved genuinely helps — that's why every day (and soon, every week) gets its own clean progress bar.",
    },
    {
      img: "/HeptagonLandingScreen3.jpg",
      title: "Connect & customize.",
      description:
        "I wanted the app to fit as many workflows as possible, so I'm actively expanding what you can customize. Right now, you can connect Google Calendar to see events alongside your tasks, and choose whether optional tasks count toward progress.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToIndex = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0.4 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0.4 }),
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-[20px] lg:p-[40px]">
      <h2 className="uppercase text-[24px] lg:text-[28px] font-semibold leading-tight shrink-0">
        How to use it?
      </h2>

      <div className="w-full max-w-[1100px] flex-1 min-h-0 flex items-center gap-x-3 lg:gap-x-6 mt-6 lg:mt-8">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="self-center shrink-0 cursor-pointer p-2 lg:p-3 rounded-full border border-white/15 text-white/50 hover:text-[#00FF26] hover:border-[#00FF26] transition-colors duration-200"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="relative flex-1 h-full rounded-2xl overflow-hidden border border-white/10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={slides[index].img}
                alt={slides[index].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 text-center lg:text-left">
                <h3 className="text-white text-[20px] lg:text-[24px] font-medium">
                  {slides[index].title}
                </h3>
                <p className="text-white/75 text-[14px] lg:text-[15px] mt-2 max-w-[560px] mx-auto lg:mx-0">
                  {slides[index].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 lg:right-6 flex gap-x-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-[6px] rounded-full cursor-pointer transition-all duration-300 ${
                  i === index ? "w-[24px] bg-[#00FF26]" : "w-[6px] bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={next}
          aria-label="Next slide"
          className="self-center shrink-0 cursor-pointer p-2 lg:p-3 rounded-full border border-white/15 text-white/50 hover:text-[#00FF26] hover:border-[#00FF26] transition-colors duration-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}