export default function LandingUpdates() {
  const upcomingUpdates = [
    {
      status: "In progress",
      title: "Week progress bar",
      description:
        "Day progress bars are great, but I noticed a pattern: a single bad day tends to make people lose motivation for the rest of the week. That's why I'm building weekly scores next — they'll also let you compare how different weeks went against each other.",
    },
    {
      status: "Next up",
      title: "Recurring tasks",
      description:
        "Let's be honest: most of our days look pretty similar. Manually adding tasks like \"wash the dishes\" or \"walk the dog\" every single day is tedious and unnecessary. The next update focuses on fixing exactly that, with recurring tasks done right.",
    },
    {
      status: "Long-term",
      title: "A note of competition",
      description:
        "I love competing, especially with friends. The idea is to expand profiles with leaderboards and a way to share your productivity stats with people you know. It's a long-term feature though, so it'll take a bit longer to land — stay tuned.",
    },
  ];

  return (
    <div className="w-full lg:max-h-screen flex flex-col items-center p-[20px] lg:p-[40px]">
      <h2 className="uppercase text-[24px] lg:text-[28px] font-semibold leading-tight text-center shrink-0">
        What to expect in upcoming updates?
      </h2>

<div className="w-full max-w-[1100px] flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 items-start content-center gap-4 lg:gap-6 mt-8 lg:mt-12">        {upcomingUpdates.map((update, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-7 overflow-hidden hover:border-[#00FF26]/30 transition-colors duration-300"
          >
            <span className="absolute -top-2 right-4 text-[64px] lg:text-[80px] font-bold text-white/[0.04] leading-none select-none">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="self-start text-[11px] uppercase tracking-wide text-[#00FF26]/80 border border-[#00FF26]/30 rounded-full px-3 py-1">
              {update.status}
            </span>

            <h3 className="text-white text-[18px] lg:text-[20px] font-medium mt-4">
              {update.title}
            </h3>

            <p className="text-[#F5F5F5]/60 text-[14px] mt-3 leading-relaxed">
              {update.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}