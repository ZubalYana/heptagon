import { useState } from "react";
import PrimaryButton from "../customElements/PrimaryButton";
import { UserRoundPlus, Search, Menu, X } from "lucide-react";
import OutlineButton from "../customElements/OutlineButton";
import { AnimatePresence, motion } from "framer-motion";
import scrollToSection from "../../helpers/scroll";

export default function LandingHome() {
  const nav = [
    { title: "Usage", id: "usage" },
    { title: "Updates", id: "updates" },
    { title: "FAQ", id: "faq" },
    { title: "Get in touch", id: "get-in-touch" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <div
      id="home"
      className="relative w-full h-screen flex flex-col overflow-hidden p-[20px] lg:p-[40px]"
    >
      <div className="absolute inset-0">
        <div className="absolute top-[-15%] left-[-10%] w-[420px] h-[420px] lg:w-[600px] lg:h-[600px] rounded-full bg-[#00FF26]/8 blur-[100px] lg:blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[420px] h-[420px] lg:w-[600px] lg:h-[600px] rounded-full bg-[#00FF26]/[0.06] blur-[100px] lg:blur-[140px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative z-10 w-full flex items-center justify-between mb-6 lg:mb-12">
        <div className="flex gap-x-2 items-center">
          <img
            src="/heptagonLogo.svg"
            alt="Heptagon Logo"
            className="w-[35px] h-[35px]"
          />
          <h2 className="text-[20px] font-medium">Heptagon</h2>
        </div>

        <div className="hidden lg:flex gap-x-6">
          {nav.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item.id)}
              className="cursor-pointer text-[13px] uppercase tracking-wide text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              {item.title}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="lg:hidden cursor-pointer text-white/70 hover:text-[#00FF26] transition-colors duration-200"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden absolute top-[78px] left-[20px] right-[20px] z-20 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md p-4 flex flex-col gap-y-1"
          >
            {nav.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.id)}
                className="cursor-pointer text-[14px] uppercase tracking-wide text-white/70 hover:text-[#00FF26] transition-colors duration-200 text-left py-3 px-2 border-b border-white/5 last:border-none"
              >
                {item.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 w-full flex items-center justify-center min-h-0">
        <div className="w-full flex flex-col lg:flex-row items-center gap-y-10 lg:gap-x-12">
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="uppercase text-[28px] lg:text-[32px] font-semibold leading-tight">
              Your time has a structure, too.
            </h2>
            <p className="text-[14px] lg:text-[16px] font-normal text-[#F5F5F5]/70 mt-4 max-w-[560px]">
              A to-do list isn't always enough — and overengineering your week
              isn't the fix either. Heptagon sits in between: structured, but
              simple.
            </p>
            <p className="text-[14px] font-normal text-[#F5F5F5]/40 mt-3">
              Built by a student juggling school, work, and everything in
              between.
            </p>
            <div className="flex gap-x-6 mt-8">
              <OutlineButton onClick={() => scrollToSection("usage")}>
                <div className="flex gap-x-2 text-[16px]">
                  <Search />
                  Explore
                </div>
              </OutlineButton>
              <a href="/auth">
                <PrimaryButton>
                  <div className="flex gap-x-2 text-[16px]">
                    <UserRoundPlus />
                    Sign up
                  </div>
                </PrimaryButton>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}