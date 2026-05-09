import type Feedback from "../../interfaces/Feedback";

interface FeedbacksListProps {
  feedbacks: Feedback[] | null;
}

export default function FeedbacksList({ feedbacks }: FeedbacksListProps) {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <p className="text-[13px] text-[#444] tracking-widest uppercase">
          No feedbacks found
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="w-full flex items-center gap-4 px-4">
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-6">#</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[140px]">Name</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[180px]">Email</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] flex-1">Feedback</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[90px] text-right">Date</span>
      </div>
      {feedbacks.map((feedback, index) => (
        <div
          key={index}
          className="w-full px-4 py-3 flex items-start gap-4 rounded-lg border border-[#2a2a2a] bg-[#1B1B1B] hover:border-[#39FF14]/40 hover:bg-[#1f1f1f] transition-all duration-200 group"
        >
          <span className="text-[12px] text-[#333] w-6 font-mono group-hover:text-[#39FF14]/50 transition-colors duration-200 pt-0.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="w-[140px] text-[14px] font-medium text-white truncate">
            {String(feedback.userName)}
          </h3>
          <div className="w-px self-stretch bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />
          <p className="w-[180px] text-[13px] text-[#888] truncate font-light">
            {String(feedback.userEmail)}
          </p>
          <div className="w-px self-stretch bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />
          <p className="flex-1 text-[13px] text-[#888] font-light leading-relaxed line-clamp-2">
            {String(feedback.feedbackText)}
          </p>
          <p className="w-[90px] text-[11px] text-[#444] font-mono text-right pt-0.5 shrink-0">
            {new Date(feedback.submittionDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14]/0 group-hover:bg-[#39FF14] transition-all duration-200 shadow-[0_0_6px_#39FF14] mt-1 shrink-0" />
        </div>
      ))}
      <p className="text-[11px] text-[#333] tracking-widest uppercase px-4 pt-2">
        {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} total
      </p>
    </div>
  );
}