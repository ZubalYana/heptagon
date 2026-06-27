import LandingHome from "./LandingHome";
import LandingUsage from "./LandingUsage";
import LandingUpdates from "./LandingUpdates";
import LandingFAQ from "./LandingFAQ";
import LandingFooter from "./LandingFooter";

export default function Landing() {
  return (
    <div className="w-full flex flex-col items-center">
      <LandingHome/>
      <LandingUsage/>
      <LandingUpdates/>
      <LandingFAQ/>
      <LandingFooter/>
    </div>
  );
}