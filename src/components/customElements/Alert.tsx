import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  text: string;
  className?: string;
  onClose: () => void;
}

const alertConfig = {
  success: {
    Icon: CheckCircle,
    colorStyles: 'border-[#00FF26] text-[#00FF26] shadow-[0_0_12px_rgba(0,255,38,0.15)]',
  },
  error: {
    Icon: AlertTriangle,
    colorStyles: 'border-red-500 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  },
  info: {
    Icon: Info,
    colorStyles: 'border-[#00D0FF] text-[#00D0FF] shadow-[0_0_12px_rgba(0,208,255,0.15)]',
  },
};

export default function Alert({ type, text, className = '', onClose }: AlertProps) {
  const { Icon, colorStyles } = alertConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        fixed top-6 left-1/2 z-50 w-[90%] max-w-sm
        flex items-start sm:items-center gap-3 px-4 py-3 rounded-lg
        bg-[#1a1a1a] border
        ${colorStyles}
        ${className}
      `}
    >
      <Icon size={20} className="shrink-0 mt-0.5 sm:mt-0" />
      <p className="text-white text-sm font-medium leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}