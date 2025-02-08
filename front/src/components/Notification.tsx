"use client";

import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";

type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  message: string;
  type: NotificationType;
  onDismiss: () => void;
}

const Notification = ({ message, type, onDismiss }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for animation to finish
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600";
      case "error":
        return "bg-red-500 border-red-600";
      case "info":
        return "bg-blue-500 border-blue-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${getTypeStyles()} flex items-center justify-between rounded-lg border px-4 py-3 text-white shadow-lg`}
      >
        <span className="mr-4">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="hover:text-gray-200"
        >
          <RxCross1 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
