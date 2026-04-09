/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter } from "react-router-dom";
// import { ThemeProvider } from './hooks/useTheme';
import AppRoutes from "./routes";
import { ThemeProvider } from "./contexts";
// import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ThemeProvider>
  );
}
