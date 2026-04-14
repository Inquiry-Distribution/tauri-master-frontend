/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter } from "react-router-dom";
// import { ThemeProvider } from './hooks/useTheme';
import AppRoutes from "./routes";
import { ThemeProvider } from "./contexts";

import { queryClient } from "./api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/authContext";
// import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
