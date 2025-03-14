"use client";

import { Route } from "../routes/~__root";

export const useNav = () => {
  const nav = Route.useNavigate();

  return nav;
};

// export const useSearch = () => {
//   const a = Route.useSearch();

//   return a;
// };
