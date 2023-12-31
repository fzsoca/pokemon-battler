import React, { useEffect, useState } from "react";

type ErrorToastProps = {
  message: string;
  timeout?: number;
};

const ErrorToast: React.FC<ErrorToastProps> = ({ message, timeout = 5 }) => {
  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout]);

  return showToast ? (
    <div className="bg-red-500 text-white p-4 rounded-md">
      <p>{message}</p>
    </div>
  ) : null;
};

export default ErrorToast;
