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
        <span>Last updated: July 16, 2026</span>
        <span>
          We collect your name and email to create and manage your account.
        </span>
        <span>
          With your permission, we read your Google Calendar events
          (read-only access) to display them alongside your tasks and weekly
          plan inside Heptagon. This data is fetched in real time and is
          never stored on our servers — it is not saved to our database and
          is discarded as soon as it has been displayed to you. We do not
          request write access, so Heptagon never creates, edits, or deletes
          anything on your Google Calendar.
        </span>
        <span>
          Your account data (name, email, and the tasks you create within
          Heptagon) is retained for as long as your account remains active.
          You can disconnect Google Calendar or delete your account at any
          time, which permanently removes this data.
        </span>
        <span>We do not sell or share your data with third parties.</span>
        <span>Contact: zubalana0@email.com</span>
      </p>
    </div>
  );
}