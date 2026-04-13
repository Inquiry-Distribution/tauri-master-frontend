/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter } from "react-router-dom";
// import { ThemeProvider } from './hooks/useTheme';
import AppRoutes from "./routes";
import { ThemeProvider } from "./contexts";
import { AuthProvider } from "./hooks/useAuth";
// import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
