import { useState } from 'react';
import { cmsApi } from '../../api/clinicApi';
import DataTable from '../../components/primitives/DataTable';
import Tag from '../../components/primitives/Tag';
import FormSection from '../../components/primitives/FormSection';

export default function Inventory() {
  const [query, setQuery] = useState({ page: 1, pageSize: 20 });
  const stock = cmsApi.useCollection(cmsApi.endpoints.inventory, query);

  return (
    <div className="grid">
      <h2>Inventory</h2>
      <DataTable
        columns={[
          { key: 'sku', label: 'SKU' },
          { key: 'name', label: 'Item' },
          { key: 'onHand', label: 'On Hand' },
          { key: 'reorderAt', label: 'Reorder At' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'alert', label: 'Alert', render: (_, row) => (row.onHand <= row.reorderAt ? <Tag tone="warn">Reorder</Tag> : <Tag tone="success">OK</Tag>) }
        ]}
        rows={stock.data?.items || []}
        total={stock.data?.total || 0}
        loading={stock.isLoading}
        onQueryChange={setQuery}
      />

      <FormSection title="Intake / Issue Log" hint="Tracks movement and source document references.">
        <input className="form-control" placeholder="SKU" />
        <input className="form-control" type="number" placeholder="Quantity" />
        <select className="form-select">
          <option value="intake">Intake</option>
          <option value="issue">Issue</option>
        </select>
        <input className="form-control" placeholder="Reference" />
        <button className="btn btn-primary">Save log</button>
      </FormSection>
    </div>
  );
}
