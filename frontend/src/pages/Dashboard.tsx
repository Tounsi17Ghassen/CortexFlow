import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useWorkspaceStore } from '../store';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, createWorkspace } = useWorkspaceStore();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    const workspace = await createWorkspace(newWorkspaceName, newWorkspaceDesc);
    setShowCreateModal(false);
    setNewWorkspaceName('');
    setNewWorkspaceDesc('');
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>CortexFlow</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Welcome, {user?.name}</span>
          <button onClick={logout} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
        </div>
      </nav>

      <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Your Workspaces</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            + New Workspace
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {workspaces.map((ws) => (
            <div
              key={ws._id}
              onClick={() => navigate(`/workspace/${ws._id}`)}
              style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #e5e7eb', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{ws.name}</h3>
              {ws.description && <p style={{ fontSize: '13px', color: '#6b7280' }}>{ws.description}</p>}
            </div>
          ))}
          {workspaces.length === 0 && (
            <p style={{ color: '#9ca3af', gridColumn: '1/-1' }}>No workspaces yet. Create your first one!</p>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '28px', width: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Create Workspace</h3>
            <input
              placeholder="Workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input
              placeholder="Description (optional)"
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '20px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreateWorkspace} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
