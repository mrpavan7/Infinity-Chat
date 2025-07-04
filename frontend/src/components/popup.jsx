import { useEffect, useState } from "react";

// Props: visible (boolean), onClose (function), children/message
const Popup = ({ visible = false, onClose, children }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Auto-close after 3 seconds (increased for better UX)
      const autoClose = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 2000);
      return () => clearTimeout(autoClose);
    } else {
      setShow(false);
    }
  }, [visible, onClose]); // Removed onClose from dependencies

  return (
    <div
      className={`absolute top-5 max-sm:top-26 left-0 right-0 mx-auto flex items-center justify-center w-fit max-w-md transition-all duration-500 ease-out z-50
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      <div className="text-white text-sm px-6 py-3 rounded-lg shadow-lg">
        <p className="text-center font-medium">{children || "Popup message"}</p>
      </div>
    </div>
  );
};

export default Popup;
