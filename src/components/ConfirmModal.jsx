import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="tactical-panel glow-border-strong max-w-md w-full mx-4 animate-fadeIn">
        <div className="p-6">
          <div className="tactical-panel-header mb-4">{title}</div>
          <p className="text-sm text-tactical-text-primary mb-6 leading-relaxed">{message}</p>

          <div className="flex space-x-3 justify-end">
            <button
              onClick={onCancel}
              className="btn-tactical px-4 py-2"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`btn-tactical px-4 py-2 ${
                isDangerous ? 'btn-tactical-danger' : 'btn-tactical-success'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
