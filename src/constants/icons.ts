// Centralized icons for the app

import { Add01Icon, ArrowRight01Icon, BalanceScaleIcon, Calendar03Icon, CashIcon, Clock01Icon, CoinsDollarIcon, Delete01Icon, DivideSignCircleIcon, Invoice02Icon, MoneyBag02Icon, PencilEdit01Icon, RecordIcon, SmartPhone01Icon, Store01Icon, TaskAdd01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const ICONS = {
    ADD: Add01Icon,
    ARROW_RIGHT: ArrowRight01Icon,
    CALENDAR: Calendar03Icon,
    CASH_DIFFERENCE: BalanceScaleIcon,
    CASH_OUT: CashIcon,
    DELETE: Delete01Icon,
    DOT: RecordIcon,
    EDIT: PencilEdit01Icon,
    EXPENSE: Invoice02Icon,
    PER_HOUR: DivideSignCircleIcon,
    REPORT_ADD: TaskAdd01Icon,
    SALES_IN_STORE: Store01Icon,
    SALES_ONLINE: SmartPhone01Icon,
    SALES_TOTAL: MoneyBag02Icon,
    TOTAL_TIPS: CoinsDollarIcon,
    TOTAL_HOURS: Clock01Icon,
} as const satisfies Record<string, IconSvgElement>;