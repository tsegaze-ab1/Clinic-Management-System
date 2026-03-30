import { useMemo, useState } from 'react';

const snapshots = {
  today: {
    labels: ['Consultation', 'Labs', 'Medication', 'Follow-up', 'Other'],
    data: [28, 20, 18, 24, 10],
    colors: ['#1d4e89', '#136f63', '#e67e22', '#8e44ad', '#c0392b']
  },
  week: {
    labels: ['Consultation', 'Labs', 'Medication', 'Follow-up', 'Other'],
    data: [25, 18, 22, 20, 15],
    colors: ['#2a6f97', '#1a936f', '#f4a261', '#9d4edd', '#d00000']
  },
  month: {
    labels: ['Consultation', 'Labs', 'Medication', 'Follow-up', 'Other'],
    data: [30, 15, 20, 25, 10],
    colors: ['#355070', '#6d597a', '#b56576', '#e56b6f', '#eaac8b']
  }
};

export default function IngredientPieInsights() {
  const [period, setPeriod] = useState('today');
  const current = snapshots[period];

  const total = useMemo(() => current.data.reduce((sum, value) => sum + value, 0), [current.data]);

  return (
    <section className="ingredient-insights page-card">
      <div className="ingredient-insights-head">
        <h5>Operational Mix</h5>
        <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="ingredient-insights-rows">
        {current.labels.map((label, index) => {
          const value = current.data[index];
          const percent = ((value / total) * 100).toFixed(1);
          return (
            <div className="ingredient-insight-row" key={label}>
              <span>{label}</span>
              <div className="ingredient-progress-bar">
                <div className="ingredient-progress-fill" style={{ width: `${percent}%`, backgroundColor: current.colors[index] }} />
              </div>
              <strong>{percent}%</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
