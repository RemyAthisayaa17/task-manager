import { ReactNode } from "react";

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, subtitle, onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onMouseDown={(e) => {
        // ONLY backdrop click closes modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-lg"
        onMouseDown={(e) => e.stopPropagation()} // hard stop propagation fix
      >
        <div className="p-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};