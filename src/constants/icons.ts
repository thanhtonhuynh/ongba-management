// Centralized icons for the app

import { Add01Icon, Delete01Icon, Invoice02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const ICONS = {
    ADD: Add01Icon,
    DELETE: Delete01Icon,
    EDIT: PencilEdit01Icon,
    EXPENSE: Invoice02Icon,
} as const satisfies Record<string, IconSvgElement>;