import { useMemo, useState } from 'react';
import DataTable from '../../components/primitives/DataTable';
import ModalDrawer from '../../components/primitives/ModalDrawer';
import FormSection from '../../components/primitives/FormSection';
import Tag from '../../components/primitives/Tag';
import {
  createUser as createUserRecord,
  deleteUser,
  getSystemReport,
  getUsers,
  updateUserRole
} from '../../data/rbacMockStore';
import { useToast } from '../../context/ToastContext';

const matrixColumns = [
  { key: 'permission', label: 'Permission' },
  { key: 'admin', label: 'Admin' },
  { key: 'receptionist', label: 'Receptionist' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'patient', label: 'Patient' }
];

const permissionMatrix = [
  { permission: 'users:write', admin: 'Y', receptionist: '-', doctor: '-', patient: '-' },
  { permission: 'appointments:write', admin: 'Y', receptionist: 'Y', doctor: '-', patient: '-' },
  { permission: 'appointments:read', admin: 'Y', receptionist: 'Y', doctor: 'Y', patient: 'Y' },
  { permission: 'encounters:write', admin: 'Y', receptionist: '-', doctor: 'Y', patient: '-' },
  { permission: 'prescriptions:read', admin: 'Y', receptionist: '-', doctor: 'Y', patient: 'Y' }
];

export default function UserManagement() {
  const { pushToast } = useToast();
  const [query, setQuery] = useState({ page: 1, pageSize: 10, search: '' });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ email: '', fullName: '', role: 'receptionist' });
  const [tick, setTick] = useState(0);

  const users = useMemo(() => {
    const all = getUsers();
    const term = (query.search || '').trim().toLowerCase();
    if (!term) return all;
    return all.filter((user) => user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));
  }, [query.search, tick]);

  const report = useMemo(() => getSystemReport(), [tick]);

  const onRoleChange = (row, nextRole) => {
    updateUserRole(row.id, nextRole);
    setTick((prev) => prev + 1);
    pushToast({ title: 'Role updated', message: `${row.fullName} is now ${nextRole}.`, tone: 'success' });
  };

  const onDeleteUser = (row) => {
    deleteUser(row.id);
    setTick((prev) => prev + 1);
    pushToast({ title: 'User deleted', message: `${row.fullName} removed from system.`, tone: 'warn' });
  };

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (value) => <Tag tone="info">{value}</Tag> },
    { key: 'status', label: 'Status', render: (value) => <Tag tone={value === 'active' ? 'success' : 'warn'}>{value}</Tag> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-select form-select-sm" value={row.role} onChange={(e) => onRoleChange(row, e.target.value)}>
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteUser(row)}>
            Delete
          </button>
        </div>
      )
    }
  ];

  const handleCreateUser = async () => {
    if (!draft.fullName || !draft.email) return;
    createUserRecord(draft);
    setOpen(false);
    setDraft({ email: '', fullName: '', role: 'receptionist' });
    setTick((prev) => prev + 1);
    pushToast({ title: 'User created', message: 'User has been added and role assigned.', tone: 'success' });
  };

  return (
    <div className="grid">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>User & Role Management</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>Create User</button>
      </div>

      <DataTable columns={columns} rows={users} total={users.length} loading={false} onQueryChange={setQuery} />

      <DataTable columns={matrixColumns} rows={permissionMatrix} total={permissionMatrix.length} loading={false} onQueryChange={() => {}} />

      <div className="page-card">
        <h5>System Report Placeholder</h5>
        <p>Total users: {report.totalUsers}</p>
        <p>Total patients: {report.totalPatients}</p>
        <p>Total appointments: {report.totalAppointments}</p>
        <p>Total prescriptions: {report.totalPrescriptions}</p>
      </div>

      <div className="page-card">
        <h5>Audit History Placeholder</h5>
        <ul>
          <li>2026-03-29 09:00: User role reassigned</li>
          <li>2026-03-29 08:45: New patient account created</li>
          <li>2026-03-28 16:10: Appointment status updated</li>
        </ul>
      </div>

      <ModalDrawer open={open} title="Create User" onClose={() => setOpen(false)}>
        <FormSection title="User identity" hint="Admin can create doctor, receptionist, and patient users.">
          <input className="form-control" placeholder="Full name" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
          <input className="form-control" placeholder="Work email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          <select className="form-select" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreateUser}>Create User</button>
        </FormSection>
      </ModalDrawer>
    </div>
  );
}
