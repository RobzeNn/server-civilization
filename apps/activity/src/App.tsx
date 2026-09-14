import { Dashboard } from './components/Dashboard.js';
import { useDiscordAuth } from './hooks/useDiscordAuth.js';
import './App.css';

export function App() {
  const { status, authenticate } = useDiscordAuth();

  if (status.type === 'loading') {
    return (
      <div className="app app--centered">
        <p>Connecting to Discord…</p>
      </div>
    );
  }

  if (status.type === 'error') {
    return (
      <div className="app app--centered">
        <div className="error-panel">
          <h2>Could not connect</h2>
          <p>{status.message}</p>
          <button type="button" onClick={() => void authenticate()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Dashboard
        civilization={status.session.civilization}
        displayName={status.session.me.user.displayName}
        avatarUrl={status.session.me.user.avatarUrl}
      />
    </div>
  );
}
