import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../components/primitives/StatCard';
import Timeline from '../../components/primitives/Timeline';
import Tag from '../../components/primitives/Tag';
import IngredientPieInsights from '../../ingredients/IngredientPieInsights';
import { getAppointmentsApi, getDashboardApi, getUsersApi } from '../../services/clinicApiService';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { pushToast } = useToast();
  const [report, setReport] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalAppointments: 0
  });
  const [users, setUsers] = useState([]);
  const [prescriptionsCount, setPrescriptionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const doctors = users.filter((user) => user.role === 'doctor');
  const receptionists = users.filter((user) => user.role === 'receptionist');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [dashboard, usersList, appointments] = await Promise.all([
          getDashboardApi('admin'),
          getUsersApi(),
          getAppointmentsApi()
        ]);

        if (!mounted) return;

        setUsers(usersList);
        setReport({
          totalUsers: Number(dashboard.totalUsers || usersList.length),
          totalPatients: Number(dashboard.totalPatients || 0),
          totalAppointments: Number(dashboard.totalAppointments || appointments.length)
        });
        setPrescriptionsCount(appointments.filter((item) => item.diagnosis || item.prescription).length);
      } catch (error) {
        pushToast({ title: 'Dashboard load failed', message: error.message || 'Unable to load admin report', tone: 'warn' });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [pushToast]);

  const kpis = useMemo(() => {
    return [
      { title: 'Total Users', value: report.totalUsers, trend: 4 },
      { title: 'Registered Patients', value: report.totalPatients, trend: 2 },
      { title: 'Appointments', value: report.totalAppointments, trend: 3 },
      { title: 'Prescriptions', value: prescriptionsCount, trend: 1 }
    ];
  }, [prescriptionsCount, report]);

  return (
    <div className="grid fade-slide">
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading dashboard...</p> : null}
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
