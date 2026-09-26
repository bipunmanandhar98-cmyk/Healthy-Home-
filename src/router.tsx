import { useEffect } from 'react';
import { BrowserRouter as Router, Routes as RRoutes, Route as RRoute, Navigate as RNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  // Only jump to top on a real page change. Rewriting the hash to jump to a
  // section on the same page must not scroll the user back to the top.
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}
export const BrowserRouter = Router;
export const Routes = RRoutes;
export const Route = RRoute;
export const Navigate = RNavigate;