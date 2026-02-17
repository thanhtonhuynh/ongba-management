// Centralized icons for the app

import { Add01Icon, ArrowRight01Icon, Calendar03Icon, Clock01Icon, CoinsDollarIcon, Delete01Icon, Invoice02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const ICONS = {
    ADD: Add01Icon,
    ARROW_RIGHT: ArrowRight01Icon,
    CALENDAR: Calendar03Icon,
    CLOCK: Clock01Icon,
    COINS: CoinsDollarIcon,
    DELETE: Delete01Icon,
    EDIT: PencilEdit01Icon,
    EXPENSE: Invoice02Icon,
} as const satisfies Record<string, IconSvgElement>;