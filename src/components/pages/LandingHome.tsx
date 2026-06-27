import PrimaryButton from "../customElements/PrimaryButton";
import { UserRoundPlus, Search } from "lucide-react";
import OutlineButton from "../customElements/OutlineButton";
import scrollToSection from "../../helpers/scroll";

export default function LandingHome() {
  const nav = [
    { title: "Usage", id: "usage" },
    { title: "Updates", id: "updates" },
    { title: "FAQ", id: "faq" },
    { title: "Get in touch", id: "get-in-touch" },
  ];

  return (
    <div id="home" className="w-full h-screen flex flex-col p-[20px] lg:p-[40px]">
      <div className="w-full flex items-center justify-between mb-6 lg:mb-12">
        <div className="flex gap-x-2 items-center">
          <img
            src="/heptagonLogo.svg"
            alt="Heptagon Logo"
            className="w-[35px] h-[35px]"
          />
          <h2 className="text-[20px] font-medium">Heptagon</h2>
        </div>
        <div className="flex gap-x-6">
          {nav.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.id)}
              className="cursor-pointer text-[13px] uppercase tracking-wide text-white/60 hover:text-[#00FF26] transition-colors duration-200"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center min-h-0">
        <div className="w-full flex flex-col lg:flex-row items-center gap-y-10 lg:gap-x-12">
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="uppercase text-[28px] lg:text-[32px] font-semibold leading-tight">
              Your time has a structure, too.
            </h2>
            <p className="text-[16px] font-normal text-[#F5F5F5]/70 mt-4 max-w-[560px]">
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