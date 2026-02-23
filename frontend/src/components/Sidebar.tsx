import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store';

interface SidebarProps {
  workspaceId: string;
  onPageSelect: (pageId: string) => void;
}

export default function Sidebar({ workspaceId, onPageSelect }: SidebarProps) {
  const { pages, currentWorkspace, createPage, deletePage } = useWorkspaceStore();
  const navigate = useNavigate();
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;
    const page = await createPage(workspaceId, newPageTitle);
    setShowNewPageInput(false);
    setNewPageTitle('');
    onPageSelect(page._id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreatePage();
    if (e.key === 'Escape') {
      setShowNewPageInput(false);
      setNewPageTitle('');
    }
  };

  return (
    <aside style={{
      width: '256px',
      minWidth: '256px',
      backgroundColor: '#f9fafb',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#6b7280', padding: '0', marginBottom: '8px', display: 'block' }}
        >
          ← All Workspaces
        </button>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
          {currentWorkspace?.name || 'Workspace'}
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</span>
          <button
            onClick={() => setShowNewPageInput(true)}
            title="New page"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '18px', lineHeight: 1, padding: '0 2px' }}
          >
            +
          </button>
        </div>

        {showNewPageInput && (
          <div style={{ padding: '4px 8px' }}>
            <input
              autoFocus
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Page title..."
              style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {pages.map((page) => (
          <div
            key={page._id}
            onClick={() => onPageSelect(page._id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              marginBottom: '2px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {page.title || 'Untitled'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this page?')) deletePage(page._id);
              }}
              title="Delete page"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '14px', padding: '0 2px', flexShrink: 0, display: 'none' }}
            >
              x
            </button>
          </div>
        ))}

        {pages.length === 0 && !showNewPageInput && (
          <p style={{ fontSize: '13px', color: '#9ca3af', padding: '8px', textAlign: 'center' }}>
            No pages yet. Click + to create one.
          </p>
        )}
      </div>
    </aside>
  );
}
