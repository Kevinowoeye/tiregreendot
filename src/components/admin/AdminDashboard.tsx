import React from 'react';
import { AdminPortal } from './AdminPortal';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AdminDashboardProps {
  onNavigateWebsite?: () => void;
  onNavigateHome?: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  return (
    <ErrorBoundary fallbackTitle="Admin Portal Error" fallbackMessage="An error occurred inside the administrative system. Your session has been safely preserved.">
      <AdminPortal {...props} />
    </ErrorBoundary>
  );
};

export default AdminDashboard;
