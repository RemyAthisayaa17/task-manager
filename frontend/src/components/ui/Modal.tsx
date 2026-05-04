import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      
      {/* IMPORTANT: stop propagation ONLY on modal box */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header (NO X BUTTON as per your rule) */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {title}
        </h2>

        {children}

        {/* Only Cancel allowed */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};