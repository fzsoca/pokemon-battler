import Link from "next/link";
import React, { ReactNode } from "react";
import ErrorToast from "./ErrorToast";

type MainLayoutProps = {
  children: ReactNode;
  error?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, error }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white py-4 px-6">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/leaderboard">Leaderboard</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto py-6 px-4">
          {/* Content */}
          {children}
        </main>
      </div>
      {error && (
        <div className="fixed bottom-0 right-0 m-4">
          <ErrorToast message={error} />
        </div>
      )}
    </>
  );
};

export default MainLayout;
