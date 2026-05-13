import { X } from "lucide-react";

interface ActionConfirmationProps {
  onClose?: () => void;
  confirmationText: String;
  buttonText: String;
  onConfirm: () => void;
}
export default function ActionConfirmation({
  onClose,
  confirmationText,
  buttonText,
  onConfirm,
}: ActionConfirmationProps) {
  return (
    <div
      className="w-[90%] md:w-[60%] lg:w-[40%] bg-[#1F1F1F] rounded-xl p-5 flex flex-col relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <X
        className="w-[18px] h-[18px] absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        onClick={() => onClose?.()}
      />
      <h3 className="text-[20px] font-medium mb-6 text-white">
        {confirmationText}
      </h3>

      <div className="flex items-center gap-x-4">
        <button
        className={[
          "flex justify-center items-center gap-2 mt-4",
          "px-4 py-2 rounded-lg",
          "font-medium text-[14px]",
          "bg-transparent border transition-all duration-200 ease-in-out",
          "border-gray-500/30 text-gray-500 cursor-pointer",
          "hover:bg-gray-500/10 hover:border-gray-500 hover:-translate-y-px",
          "focus:outline-none focus:ring-2 focus:ring-gray-500/40 focus:bg-red-gray/10",
          "active:scale-[0.98] active:translate-y-0",
        ].join(" ")}
        onClick={()=>onClose?.()}
      >
        Cancel
      </button>
      <button
        className={[
          "flex justify-center items-center gap-2 mt-4",
          "px-4 py-2 rounded-lg",
          "font-medium text-[14px]",
          "bg-transparent border transition-all duration-200 ease-in-out",
          "border-red-500/30 text-red-500 cursor-pointer",
          "hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:-translate-y-px",
          "focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:bg-red-500/10",
          "active:scale-[0.98] active:translate-y-0",
        ].join(" ")}
        onClick={()=>onConfirm()}
      >
        {buttonText}
      </button>
      </div>
    </div>
  );
}
