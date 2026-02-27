"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ICONS } from "@/constants/icons";
import { useDroppable } from "@dnd-kit/react";
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
        isDropTarget ? "bg-primary/10 ring-primary/30 rounded-xl ring-2" : ""
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

      {entry.note && !canManage && (
        <p className="text-muted-foreground text-xs italic">{entry.note}</p>
      )}

      {canManage && hasSlots && (
        <Textarea
          value={entry.note ?? ""}
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
              <Button variant="accent" size="icon-xs">
                <HugeiconsIcon icon={ICONS.ADD} />
                <span className="sr-only">Add</span>
              </Button>
            }
          />
          {copiedSlot && (
            <Button variant="accent" size="icon-xs" onClick={() => onAddSlot({ ...copiedSlot })}>
              <HugeiconsIcon icon={ICONS.FILE_PASTE} />
              <span className="sr-only">Paste</span>
            </Button>
          )}
        </div>
      )}

      {!hasSlots && !canManage && <span className="text-muted-foreground text-xs">—</span>}
    </div>
  );
}
