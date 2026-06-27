"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { WaitlistModal } from "../components/waitlist-modal";

interface ReserveContextValue {
  isOpen: boolean;
  openReserve: () => void;
  closeReserve: () => void;
}

const ReserveContext = createContext<ReserveContextValue | null>(null);

export function ReserveProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openReserve = useCallback(() => setIsOpen(true), []);
  const closeReserve = useCallback(() => setIsOpen(false), []);

  const value = useMemo<ReserveContextValue>(
    () => ({ isOpen, openReserve, closeReserve }),
    [isOpen, openReserve, closeReserve]
  );

  return (
    <ReserveContext.Provider value={value}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeReserve} />
    </ReserveContext.Provider>
  );
}

export function useReserve(): ReserveContextValue {
  const context = useContext(ReserveContext);
  if (!context) {
    throw new Error("useReserve must be used within ReserveProvider");
  }
  return context;
}
