"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { SlotFormValue } from "../_lib/types";

type ClipboardContextValue = {
  copiedSlot: SlotFormValue | null;
  copySlot: (slot: SlotFormValue) => void;
  clearClipboard: () => void;
};

const ClipboardContext = createContext<ClipboardContextValue>({
  copiedSlot: null,
  copySlot: () => {},
  clearClipboard: () => {},
});

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [copiedSlot, setCopiedSlot] = useState<SlotFormValue | null>(null);

  const copySlot = useCallback((slot: SlotFormValue) => {
    setCopiedSlot({ ...slot });
  }, []);

  const clearClipboard = useCallback(() => {
    setCopiedSlot(null);
  }, []);

  return (
    <ClipboardContext value={{ copiedSlot, copySlot, clearClipboard }}>
      {children}
    </ClipboardContext>
  );
}

export function useClipboard() {
  return useContext(ClipboardContext);
}
