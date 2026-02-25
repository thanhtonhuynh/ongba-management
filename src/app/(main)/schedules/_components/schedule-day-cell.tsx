"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ICONS } from "@/constants/icons";
import { useDroppable } from "@dnd-kit/react";
import { FilePasteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useClipboard } from "../_context/clipboard-context";
import type { EntryFormValue, SlotFormValue } from "../_lib/types";
import { SlotChip } from "./slot-chip";
import { SlotEditor } from "./slot-editor";

type ScheduleDayCellProps = {
  dayIndex: number;
  entryIndex: number;
  entry: EntryFormValue;
  canManage: boolean;
  dropId: string;
  onEditSlot: (slotIndex: number, slot: SlotFormValue) => void;
  onDeleteSlot: (slotIndex: number) => void;
  onAddSlot: (slot: SlotFormValue) => void;
  onNotesChange: (notes: string) => void;
};

export function ScheduleDayCell({
  dayIndex,
  entryIndex,
  entry,
  canManage,
  dropId,
  onEditSlot,
  onDeleteSlot,
  onAddSlot,
  onNotesChange,
}: ScheduleDayCellProps) {
  const { copiedSlot } = useClipboard();
  const { ref, isDropTarget } = useDroppable({ id: dropId });

  const hasSlots = entry.slots.length > 0;

  return (
    <div
      ref={ref}
      className={`flex min-h-[60px] flex-col items-center justify-center gap-1 p-1 transition-colors ${
        isDropTarget ? "bg-primary/10 ring-primary/30 ring-2" : ""
      }`}
    >
      {entry.slots.map((slot, slotIdx) => (
        <SlotChip
          key={slotIdx}
          slot={slot}
          dragId={`slot-${dayIndex}-${entryIndex}-${slotIdx}`}
          dragData={{ dayIndex, entryIndex, slotIndex: slotIdx }}
          canManage={canManage}
          onEdit={(updated) => onEditSlot(slotIdx, updated)}
          onDelete={() => onDeleteSlot(slotIdx)}
        />
      ))}

      {entry.notes && !canManage && (
        <p className="text-muted-foreground text-xs italic">{entry.notes}</p>
      )}

      {canManage && hasSlots && (
        <Textarea
          value={entry.notes ?? ""}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Cell note..."
          rows={1}
          className="min-h-6 resize-none rounded-md px-1.5 py-0.5 text-[11px]"
        />
      )}

      {canManage && (
        <div className="flex items-center gap-1">
          <SlotEditor
            onSave={onAddSlot}
            trigger={
              <Button variant="ghost" size="xs" className="h-6 text-[11px]">
                <HugeiconsIcon icon={ICONS.ADD} className="size-3" />
                Add
              </Button>
            }
          />
          {copiedSlot && (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 text-[11px]"
              onClick={() => onAddSlot({ ...copiedSlot })}
            >
              <HugeiconsIcon icon={FilePasteIcon} className="size-3" />
              Paste
            </Button>
          )}
        </div>
      )}

      {!hasSlots && !canManage && <span className="text-muted-foreground text-xs">—</span>}
    </div>
  );
}
