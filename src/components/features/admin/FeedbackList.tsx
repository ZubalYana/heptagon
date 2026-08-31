import type Feedback from "../../../interfaces/Feedback";
import { Trash2 } from "lucide-react";
import ActionConfirmation from "../../modals/ActionConfirmation";
import { useState } from "react";
import apiClient from "../../../helpers/apiClient";
import Alert from "../../ui/Alert";

interface FeedbacksListProps {
  feedbacks: Feedback[] | null;
  onFeedbackDeleted: (feedbackId: string) => void;
}

export default function FeedbacksList({
  feedbacks,
  onFeedbackDeleted,
}: FeedbacksListProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deletingFeedbackPreview, setDeletingFeedbackPreview] = useState("");
  const [feedbackId, setFeedbackId] = useState("");
  const [alert, setAlert] = useState<{
    shown: boolean;
    type: "success" | "info" | "error";
    text: string;
  }>({ shown: false, type: "success", text: "" });

  function onAlertClose() {
    setAlert({ shown: false, type: "success", text: "" });
  }

  function onDeleteFeedback() {
    apiClient
      .delete(`/feedback/delete/${feedbackId}`)
      .then(() => {
        setIsConfirmationOpen(false);
        onFeedbackDeleted(feedbackId);
        setDeletingFeedbackPreview("");
        setFeedbackId("");
        setAlert({
          shown: true,
          type: "success",
          text: "Feedback deleted successfully!",
        });
      })
      .catch((err) => {
        setAlert({
          shown: true,
          type: "error",
          text: "Failed to delete feedback. See error in console.",
        });
        console.log(err.message);
      });
  }

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
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[110px]">Name</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[150px]">Email</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] flex-1">Feedback</span>
        <span className="text-[11px] tracking-widest uppercase text-[#444] w-[90px] text-right">Date</span>
      </div>
      {feedbacks.map((feedback, index) => (
        <div
          key={feedback._id}
          className="w-full px-4 py-3 flex items-center gap-4 rounded-lg border border-[#2a2a2a] bg-[#1B1B1B] hover:border-[#39FF14]/40 hover:bg-[#1f1f1f] transition-all duration-200 group"
        >
          <span className="text-[12px] text-[#333] w-6 font-mono group-hover:text-[#39FF14]/50 transition-colors duration-200 pt-0.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="w-[110px] text-[14px] font-medium text-white truncate">
            {feedback.userName}
          </h3>
          <div className="w-px self-stretch bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />
          <p className="w-[150px] text-[13px] text-[#888] truncate font-light">
            {feedback.userEmail}
          </p>
          <div className="w-px self-stretch bg-[#2a2a2a] group-hover:bg-[#39FF14]/20 transition-colors duration-200" />
          <p className="flex-1 text-[13px] text-[#888] font-light leading-relaxed line-clamp-2">
            {feedback.feedbackText}
          </p>
          <p className="w-[90px] text-[11px] text-[#444] font-mono text-right pt-0.5 shrink-0">
            {new Date(feedback.submitionDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <Trash2
            className="text-red-400 w-[15px] h-[15px] hover:scale-[1.2] hover:shadow cursor-pointer transition-all duration-300 shrink-0"
            strokeWidth={1.5}
            onClick={() => {
              setDeletingFeedbackPreview(feedback.userEmail);
              setFeedbackId(feedback._id);
              setIsConfirmationOpen(true);
            }}
          />
        </div>
      ))}
      <p className="text-[11px] text-[#333] tracking-widest uppercase px-4 pt-2">
        {feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} total
      </p>

      {isConfirmationOpen && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setIsConfirmationOpen(false)}
        >
          <ActionConfirmation
            confirmationText={`Are you sure you want to delete feedback from ${deletingFeedbackPreview}?`}
            onClose={() => setIsConfirmationOpen(false)}
            buttonText="Delete permanently"
            onConfirm={() => onDeleteFeedback()}
          />
        </div>
      )}

      {alert.shown && (
        <Alert
          type={alert.type}
          text={alert.text}
          onClose={() => onAlertClose()}
        />
      )}
    </div>
  );
}
