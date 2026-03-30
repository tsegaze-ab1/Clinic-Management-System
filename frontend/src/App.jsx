import { Outlet } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

export default function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
