export default function Privacy() {
  return (
    <div className="p-[20px] lg:p-[40px]">
      <div className="flex items-center gap-x-2 ">
        <div className="w-[35px] h-[35px]">
          <img src="./heptagonLogo.svg" alt="Heptagon" />
        </div>
        <h3 className="text-[20px] md:text-[24px]">
          Privacy Policy for Heptagon
        </h3>
      </div>
      <p className="text-[14px] md:text-[16px] mt-4 flex flex-col gap-y-2">
        <span>Last updated: August 8, 2026</span>
        <span>
          We collect your name and email to create and manage your account.
        </span>
        <span>
          With your permission, we read your Google Calendar events (read-only
          access) to display them alongside your tasks and weekly plan inside
          Heptagon. This data is fetched in real time and is never stored on our
          servers — it is not saved to our database and is discarded as soon as
          it has been displayed to you. We do not request write access, so
          Heptagon never creates, edits, or deletes anything on your Google
          Calendar.
        </span>
        <span>
          Your account data (name, email, and the tasks you create within
          Heptagon) is retained for as long as your account remains active. You
          can disconnect Google Calendar or delete your account at any time,
          which permanently removes this data.
        </span>
        <span>
          Data protection: All data is transmitted using HTTPS/TLS encryption.
          The OAuth tokens that allow Heptagon to access your Google Calendar
          are encrypted at rest in our database and are never exposed to the
          client or logged. Access to these tokens is restricted to the backend
          service that performs the calendar sync — no other system or employee
          can view them. You can revoke this access at any time from your Google
          Account permissions page or by disconnecting Calendar within Heptagon,
          which deletes the stored tokens immediately.
        </span>
        <span>We do not sell or share your data with third parties.</span>
        <span>Contact: zubalana0@email.com</span>
      </p>
    </div>
  );
}
