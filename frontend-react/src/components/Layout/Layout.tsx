// src/components/Layout/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { OfflineBanner } from '../UI/OfflineBanner';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false, noFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8]">
      <Header />
      <OfflineBanner />
      <main
        id="main-content"
        className={`flex-1 ${fullWidth ? '' : 'max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6'}`}
        role="main"
      >
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
};
