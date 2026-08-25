export default function AuthBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-[-10%] left-[-15%] w-[380px] h-[380px] lg:w-[560px] lg:h-[560px] rounded-full bg-[#00FF26]/[0.07] blur-[100px] lg:blur-[130px]" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[380px] h-[380px] lg:w-[560px] lg:h-[560px] rounded-full bg-[#00FF26]/[0.05] blur-[100px] lg:blur-[130px]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}