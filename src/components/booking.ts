/* Booking context and the URL helpers for service pages.
 *
 * WHY THIS IS ITS OWN FILE
 * `chrome.tsx` holds the site chrome as React components (TopBar, Navbar,
 * Footer, BookingProvider). The booking context and the two URL builders are
 * plain values and functions, not components, and they are imported on their own
 * by ~10 pages. Keeping them here rather than in `chrome.tsx` means each file
 * exports only one kind of thing: this one has no components at all, and
 * `chrome.tsx` has no non-component exports.
 *
 * That separation is what lets React Fast Refresh work. A module that mixes
 * component and non-component exports is invalidated wholesale on every edit,
 * so a change to, say, the Navbar would also force every page that imports
 * `useBooking` to re-render and lose state. It is a dev-experience concern only
 * — the production bundle is identical either way.
 */

import { createContext, useContext } from 'react';
import { slugify } from '../data/content';

export type BookingPreset = { treatment?: string; center?: string };

export type BookingState = {
  open: boolean;
  openBooking: (preset?: BookingPreset) => void;
  closeBooking: () => void;
  preset: BookingPreset;
};

export const BookingCtx = createContext<BookingState>({
  open: false,
  openBooking: () => {},
  closeBooking: () => {},
  preset: {},
});

/** Opens the booking modal, optionally preselecting a service and/or branch. */
export const useBooking = () => useContext(BookingCtx);

/** Detail page for one of the three main services. */
export const serviceUrl = (id: string) => `/services/${id}`;

/** Detail page for one sub-service, addressed by its human-readable name. */
export const subServiceUrl = (parentId: string, name: string) => `/services/${parentId}/${slugify(name)}`;