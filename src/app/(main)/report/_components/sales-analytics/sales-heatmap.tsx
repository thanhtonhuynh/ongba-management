"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatPriceWithDollar } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/types/datetime";
import { HeatmapCell, HeatmapData } from "@/utils/sales-analytics";

type SalesHeatmapProps = {
  data: HeatmapData;
};

const INTENSITY_CLASSES = [
  "bg-neutral-200", // 0 - no sales or no report
  "bg-blue-300", // 1
  "bg-blue-500", // 2
  "bg-blue-700", // 3
  "bg-blue-900", // 4
];

export function SalesHeatmap({ data }: SalesHeatmapProps) {
  const { cells, months } = data;

  // Calculate how many columns (weeks) we need
  // If the max is 0 (no data), we still want at least 1 week column
  const maxWeekIndex =
    cells.length > 0 ? Math.max(...cells.map((c) => c.weekIndex)) : 0;
  const totalWeeks = maxWeekIndex + 1;

  // Create a grid: 7 rows (days) x totalWeeks columns
  // Each cell is either a HeatmapCell or null (for dates outside the year)
  // Initialize with nulls
  const grid: (HeatmapCell | null)[][] = Array.from({ length: 7 }, () =>
    Array(totalWeeks).fill(null),
  );

  for (const cell of cells) {
    grid[cell.dayOfWeek][cell.weekIndex] = cell;
  }

  return (
    <div className="overflow-x-auto p-3">
      {/* Month labels */}
      <div className="mb-1 flex">
        {/* Spacer for weekday labels column */}
        <div className="w-6 shrink-0" />
        <div className="flex gap-1">
          {Array.from({ length: totalWeeks }, (_, weekIdx) => {
            // Check if any month starts at this weekIdx
            const month = months.find((m) => m.weekStart === weekIdx);

            if (!month) {
              return <div key={weekIdx} className="w-3" />;
            }
            return (
              <div key={weekIdx} className="w-3 text-xs">
                {month.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex">
        {/* Weekday labels */}
        <div className="flex shrink-0 flex-col gap-1 pr-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-3 w-5 items-center justify-end text-[10px]"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid of cells */}
        <div className="flex gap-1">
          {Array.from({ length: totalWeeks }, (_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const cell = grid[dayIdx][weekIdx];

                // If no cell (date outside year), render empty
                if (!cell) {
                  return (
                    <div
                      key={dayIdx}
                      className="size-3 rounded-xs bg-transparent"
                    />
                  );
                }

                return (
                  <Tooltip key={cell.dateStr}>
                    <TooltipTrigger
                      render={
                        <div
                          className={cn(
                            "size-3 cursor-pointer rounded-xs transition-transform hover:scale-125",
                            INTENSITY_CLASSES[cell.intensity],
                            cell.intensity === 0 && "border",
                          )}
                        />
                      }
                    />

                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="bg-popover text-popover-foreground pointer-events-none border shadow-xl"
                    >
                      <p className="font-medium">{cell.formattedDate}</p>
                      {cell.hasReport ? (
                        <p className="text-primary">
                          <span className="text-sm font-medium">
                            {formatPriceWithDollar(cell.totalSales / 100)}
                          </span>{" "}
                          Total Sales
                        </p>
                      ) : (
                        <p className="text-muted-foreground">No report</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
