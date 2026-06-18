import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const MiniModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" }}>
      <div className="absolute inset-0 bg-white bg-opacity-20" onClick={onClose}></div>
      <div className="mx-[15px] sm:mx-auto relative bg-white p-8  shadow-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default MiniModal;
