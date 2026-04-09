import React from 'react';
import { useRoutes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import Layout from '../components/layout/Layout';
import DashboardPage from '../pages/dashboard';
import InquiriesPage from '../pages/inquiries';
import SalesPersonsPage from '../pages/users';
import SalesPersonReportPage from '../pages/users/report';
import DevicesPage from '../pages/devices';
import AIReportsPage from '../pages/ai-reports';
import NotFound from '../components/layout/NotFound';

export default function AppRoutes() {
  return useRoutes([
    {
      element: <ProtectedRoute allowedRoles={['Admin']} />,
      children: [
        {
          path: '/',
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'inquiries', element: <InquiriesPage /> },
            { path: 'sales-persons', element: <SalesPersonsPage /> },
            { path: 'sales-persons/:id', element: <SalesPersonReportPage /> },
            { path: 'devices', element: <DevicesPage /> },
            { path: 'ai-reports', element: <AIReportsPage /> },
            { path: '*', element: <NotFound /> },
          ],
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);
}
