import { useState } from 'react';
import { cmsApi } from '../../api/clinicApi';
import DataTable from '../../components/primitives/DataTable';
import ModalDrawer from '../../components/primitives/ModalDrawer';
import Tag from '../../components/primitives/Tag';

export default function BillingPayments() {
  const [query, setQuery] = useState({ page: 1, pageSize: 20 });
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoices = cmsApi.useCollection(cmsApi.endpoints.invoices, query);

  const renderStatusTag = (value) => {
    let tone = 'info';
    if (value === 'paid') tone = 'success';
    if (value === 'refunded') tone = 'warn';
    return <Tag tone={tone}>{value}</Tag>;
  };

  return (
    <div className="grid">
      <h2>Billing & Payments</h2>
      <DataTable
        columns={[
          { key: 'invoiceNumber', label: 'Invoice #' },
          { key: 'patientName', label: 'Patient' },
          { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status', render: (value) => renderStatusTag(value) },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
              <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedInvoice(row); setPaymentModal(true); }}>
                Collect/Refund
              </button>
            )
          }
        ]}
        rows={invoices.data?.items || []}
        total={invoices.data?.total || 0}
        loading={invoices.isLoading}
        onQueryChange={setQuery}
      />

      <ModalDrawer open={paymentModal} title="Payment Action" onClose={() => setPaymentModal(false)}>
        <div className="grid">
          <p>Invoice: {selectedInvoice?.invoiceNumber || '--'}</p>
          <input className="form-control" placeholder="Amount" type="number" />
          <select className="form-select">
            <option value="capture">Capture payment</option>
            <option value="refund">Refund payment</option>
          </select>
          <button className="btn btn-primary">Submit</button>
          <button className="btn btn-outline-secondary" onClick={() => window.print()}>Print receipt</button>
        </div>
      </ModalDrawer>
    </div>
  );
}
