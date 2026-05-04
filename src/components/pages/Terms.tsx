export default function Terms() {
  return (
    <div>
      <div className="flex items-center gap-x-2">
        <div className="w-[35px] h-[35px]">
          <img src="./heptagonLogo.svg" alt="Heptagon" />
        </div>
        <h3 className="text-[20px] md:text-[24px]">
          Terms of Service for Heptagon
        </h3>
      </div>
      <p className="text-[14px] md:text-[16px] mt-4 flex flex-col gap-y-2">
        <span>
          By using Heptagon you agree to use it for lawful purposes only. The
          app is provided as-is. We reserve the right to terminate access for
          misuse.
        </span>
        <span>Contact: zubalana0@email.com</span>
      </p>
    </div>
  );
}
