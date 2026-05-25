import React from "react";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import Layout from "../components/layout/Layout";
import DashboardPage from "../pages/dashboard";
import InquiriesPage from "../pages/inquiries";
import SalesPersonsPage from "../pages/users";

import DevicesPage from "../pages/devices";
import AIReportsPage from "../pages/ai-reports";
import NotFound from "../components/layout/NotFound";
import CreateInquiry from "../pages/inquiries/create";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import InquiryDetailPage from "../pages/inquiries/detail";
import AttendancePage from "../pages/attendance";
import NotificationsPage from "../pages/notifications";
import SalesPersonReportPage from "../pages/users/detail";
import SettingsPage from "../pages/settings";
import TrashInquiriesPage from "../pages/inquiries/trash";
import AdminsPage from "../pages/admins";
import ComplaintsPage from "../pages/complaints";

export default function AppRoutes() {
  return useRoutes([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      element: <ProtectedRoute allowedRoles={["admin", "superuser"]} />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "inquiries", element: <InquiriesPage /> },
            { path: "inquiries/create", element: <CreateInquiry /> },
            { path: "inquiries/:id", element: <InquiryDetailPage /> },
            { path: "inquiries/trash", element: <TrashInquiriesPage /> },
            { path: "sales-persons", element: <SalesPersonsPage /> },
            { path: "admins", element: <AdminsPage /> },
            { path: "complaints", element: <ComplaintsPage /> },
            { path: "sales-persons/:id", element: <SalesPersonReportPage /> },
            { path: "devices", element: <DevicesPage /> },
            { path: "notifications", element: <NotificationsPage /> },
            // { path: "ai-reports", element: <AIReportsPage /> },
            { path: "attendance", element: <AttendancePage /> },
            {
              element: <ProtectedRoute allowedRoles={["superuser"]} />,
              children: [{ path: "settings", element: <SettingsPage /> }],
            },

            { path: "*", element: <NotFound /> },
          ],
        },
      ],
    },

    { path: "*", element: <NotFound /> },
  ]);
}
