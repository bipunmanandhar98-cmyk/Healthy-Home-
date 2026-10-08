import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names, with later Tailwind utilities winning over earlier ones.
 *
 * clsx handles the conditional/object/array forms; tailwind-merge is what makes
 * overriding actually work. Without it, `cn('bg-white p-4', 'bg-sand')` leaves
 * both `bg-white` and `bg-sand` in the class list and the winner is decided by
 * stylesheet order rather than by which was passed last — so a caller's override
 * silently does nothing, which is the single most common way this helper is
 * implemented wrongly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}