import { Phone, Mail, ArrowUpRight, Heart } from "lucide-react";
import scrollToSection from "../../helpers/scroll";

export default function LandingFooter() {
  const nav = [
    { title: "Home", id: "home" },
    { title: "Usage", id: "usage" },
    { title: "Updates", id: "updates" },
    { title: "FAQ", id: "faq" },
  ];

  return (
    <div id="get-in-touch" className="w-full border-t border-[#00FF26]/15">
      <div className="w-full flex flex-col lg:flex-row justify-between gap-y-10 lg:gap-x-12 p-[20px] lg:p-[40px]">
        <div className="w-full lg:max-w-[440px]">
          <h2 className="uppercase text-[24px] lg:text-[28px] font-semibold leading-tight flex gap-x-2 items-center">
            <img
              src="/heptagonLogo.svg"
              alt="Heptagon Logo"
              className="w-[35px] h-[35px]"
            />
            Get in touch
          </h2>
          <p className="text-[14px] font-normal text-[#F5F5F5]/70 mt-3">
            Feel free to contact me with any questions, suggestions, bug
            reports, or collaboration proposals — I'm always open to new ideas!
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-y-8 gap-x-12 lg:gap-x-16">
          <div className="flex flex-col gap-y-3">
            <h4 className="text-[11px] uppercase tracking-wide text-[#00FF26]/70">
              Navigation
            </h4>
            {nav.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className="cursor-pointer text-[13px] uppercase tracking-wide text-white/60 hover:text-[#00FF26] transition-colors duration-200 text-left"
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-y-3">
            <h4 className="text-[11px] uppercase tracking-wide text-[#00FF26]/70">
              Start planning
            </h4>
            <a
              href="/auth"
              className="cursor-pointer text-[13px] uppercase tracking-wide text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              Sign up
            </a>
            <a
              href="/auth"
              className="cursor-pointer text-[13px] uppercase tracking-wide text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              Log in
            </a>
          </div>

          <div className="flex flex-col gap-y-3">
            <h4 className="text-[11px] uppercase tracking-wide text-[#00FF26]/70">
              Contact dev
            </h4>
            <a
              href="https://t.me/yanavesq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 cursor-pointer text-[13px] text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              <Phone size={15} />
              <span>+380 97 205 87 86</span>
            </a>
            <a
              href="mailto:zubalana0@gmail.com"
              className="flex items-center gap-x-2 cursor-pointer text-[13px] text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              <Mail size={15} />
              <span>zubalana0@gmail.com</span>
            </a>
            <a
              href="https://portfolio-2026-eta-olive.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 cursor-pointer text-[13px] text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              <img
                src="/Portfolio_LogoWhite.svg"
                alt="Portfolio logo"
                className="w-[15px] h-[15px]"
              />
              <span>Portfolio</span>
              <ArrowUpRight size={13} className="text-[#00FF26]/70" />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-y-2 px-[20px] lg:px-[40px] py-4 border-t border-white/5">
        <p className="text-[12px] text-white/30">
          <a href="/privacy">© {new Date().getFullYear()} Heptagon.</a> Built by
          Yana.
        </p>
        <p className="text-[12px] text-white/30 flex items-center">
          Made with{" "}
          <span className="text-[#00FF26]/70 mx-1">
            <Heart size={12} />
          </span>{" "}
          and a lot of coffee.
        </p>
      </div>
    </div>
  );
}
