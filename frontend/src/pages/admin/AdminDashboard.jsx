import { useMemo } from 'react';
import StatCard from '../../components/primitives/StatCard';
import Timeline from '../../components/primitives/Timeline';
import Tag from '../../components/primitives/Tag';
import IngredientPieInsights from '../../ingredients/IngredientPieInsights';
import { getSystemReport, getUsers } from '../../data/rbacMockStore';

export default function AdminDashboard() {
  const report = getSystemReport();
  const users = getUsers();
  const doctors = users.filter((user) => user.role === 'doctor');
  const receptionists = users.filter((user) => user.role === 'receptionist');

  const kpis = useMemo(() => {
    return [
      { title: 'Total Users', value: report.totalUsers, trend: 4 },
      { title: 'Registered Patients', value: report.totalPatients, trend: 2 },
      { title: 'Appointments', value: report.totalAppointments, trend: 3 },
      { title: 'Prescriptions', value: report.totalPrescriptions, trend: 1 }
    ];
  }, [report]);

  return (
    <div className="grid fade-slide">
      <h2>Admin Dashboard</h2>
      <div className="grid kpis stagger">
        {kpis.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="page-card">
        <h5>Role Assignment Snapshot</h5>
        <p>Doctors: {doctors.length}</p>
        <p>Receptionists: {receptionists.length}</p>
        <p>Admins: {users.filter((user) => user.role === 'admin').length}</p>
        <p>Patients as users: {users.filter((user) => user.role === 'patient').length}</p>
      </div>

      <div className="page-card">
        <h5>System Reports Placeholder</h5>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag tone="success">User report ready</Tag>
          <Tag tone="info">Appointment report ready</Tag>
          <Tag tone="warn">Revenue report pending backend</Tag>
        </div>
      </div>

      <IngredientPieInsights />

      <Timeline
        items={[
          { title: 'User module', detail: 'Create, update, delete users with role assignment', at: 'Now' },
          { title: 'RBAC middleware', detail: 'Routes are restricted by role-based permissions', at: 'Now' },
          { title: 'Reporting', detail: 'Summary widgets are active with placeholder reports', at: 'Now' }
        ]}
      />
    </div>
  );
}
