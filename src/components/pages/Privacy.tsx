export default function Privacy() {
  return (
    <div className="p-[20px] lg:p-[40px]">
        <div className="flex items-center gap-x-2 ">
            <div className="w-[35px] h-[35px]">
                <img src="./heptagonLogo.svg" alt="Heptagon" />
            </div>
            <h3 className="text-[20px] md:text-[24px]">Privacy Policy for Heptagon</h3>
        </div>
      <p className="text-[14px] md:text-[16px] mt-4 flex flex-col gap-y-2">
        <span>Last updated: May 4, 2026</span> 
        <span>We collect your name, email, and Google
        Calendar data (read-only) solely to provide the app's functionality. We
        do not sell or share your data with third parties. Google Calendar data
        is used only to display your events within the app. You can disconnect
        Google Calendar or delete your account at any time.</span> 
        <span>Contact: zubalana0@email.com</span>
      </p>
    </div>
  );
}
