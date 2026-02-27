"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { minutesToTimeInput, timeToMinutes, type SlotFormValue } from "../_lib/types";

type SlotEditorProps = {
  initial?: SlotFormValue;
  onSave: (slot: SlotFormValue) => void;
  trigger: React.ReactElement;
};

export function SlotEditor({ initial, onSave, trigger }: SlotEditorProps) {
  const defaultSlot = initial ?? { startMinutes: 9 * 60, endMinutes: 17 * 60 };
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(minutesToTimeInput(defaultSlot.startMinutes));
  const [endTime, setEndTime] = useState(minutesToTimeInput(defaultSlot.endMinutes));
  const [note, setNote] = useState(initial?.note ?? "");

  function resetFields() {
    const slot = initial ?? { startMinutes: 9 * 60, endMinutes: 17 * 60 };
    setStartTime(minutesToTimeInput(slot.startMinutes));
    setEndTime(minutesToTimeInput(slot.endMinutes));
    setNote(initial?.note ?? "");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) resetFields();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    if (start >= end) {
      toast.error("End time must be after start time.");
      return;
    }
    onSave({ startMinutes: start, endMinutes: end, note: note || undefined });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent className="w-64" align="start">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Start</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Host stand"
              rows={2}
              className="resize-none text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="xs">
              {initial ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
