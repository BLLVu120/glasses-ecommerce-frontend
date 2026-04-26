import React from 'react';

interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`absolute inset-y-0 right-0 z-20 w-full md:w-[60%] bg-white dark:bg-[#1a262d] shadow-2xl flex flex-col h-full transition-all duration-300 ease-in-out border-l border-slate-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DrawerOverlay;
