import React, { useEffect, useState } from "react";

type ErrorToastProps = {
  message: string;
  timeout?: number;
};

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  const [showToast, setShowToast] = useState(true);

  const handleClose = () => {
    setShowToast(false);
  };

  return showToast ? (
    <div className="bg-red-500 text-white p-6 rounded-md">
      <p>{message}</p>
      <button
        className="absolute top-0 right-0 text-white"
        onClick={handleClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  ) : null;
};

export default ErrorToast;
