"use client";

import { useState, useCallback, createContext, useContext } from "react";
import type { ReactNode } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  isOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface AdminLayoutClientProps {
  children: ReactNode;
}

export const AdminLayoutClient = ({ children }: AdminLayoutClientProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
