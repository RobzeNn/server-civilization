import type { CivilizationResponse } from '@server-civilization/shared';
import './Dashboard.css';

interface DashboardProps {
  civilization: CivilizationResponse;
  displayName: string;
  avatarUrl: string | null;
}

export function Dashboard({ civilization, displayName, avatarUrl }: DashboardProps) {
  const { resources } = civilization;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>SERVER CIVILIZATION</h1>
        <div className="civ-meta">
          <span className="civ-name">{civilization.name}</span>
          <span className="civ-day">Day {civilization.currentDay}</span>
        </div>
      </header>

      <section className="resources">
        <h2>Resources</h2>
        <div className="resource-grid">
          <ResourceCard label="Food" value={resources.food} />
          <ResourceCard label="Wood" value={resources.wood} />
          <ResourceCard label="Stone" value={resources.stone} />
          <ResourceCard label="Gold" value={resources.gold} />
          <ResourceCard label="Population" value={resources.population} />
        </div>
      </section>

      <section className="village-area">
        <h2>Village</h2>
        <div className="village-scene">
          <div className="hut" />
          <div className="tree" />
          <div className="tree tree--right" />
        </div>
      </section>

      <section className="citizen-panel">
        <h2>Citizen</h2>
        <div className="citizen-card">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="citizen-avatar" />
          ) : (
            <div className="citizen-avatar citizen-avatar--placeholder" />
          )}
          <div className="citizen-info">
            <strong>{displayName}</strong>
            <span>Citizen since Day 1</span>
          </div>
        </div>
      </section>

      <section className="tabs">
        <button type="button" className="tab tab--active">Village</button>
        <button type="button" className="tab">Citizens</button>
        <button type="button" className="tab">History</button>
      </section>
    </div>
  );
}

function ResourceCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="resource-card">
      <span className="resource-label">{label}</span>
      <span className="resource-value">{value}</span>
    </div>
  );
}
