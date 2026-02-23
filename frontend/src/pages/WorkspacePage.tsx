import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../store';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';

export default function WorkspacePage() {
  const { workspaceId, pageId } = useParams<{ workspaceId: string; pageId: string }>();
  const { fetchWorkspace, fetchPages, fetchPage, currentWorkspace, currentPage } = useWorkspaceStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchPages(workspaceId);
    }
  }, [workspaceId, fetchWorkspace, fetchPages]);

  useEffect(() => {
    if (pageId) {
      fetchPage(pageId);
    }
  }, [pageId, fetchPage]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar
        workspaceId={workspaceId!}
        onPageSelect={(id) => navigate(`/workspace/${workspaceId}/page/${id}`)}
      />
      <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}>
        {currentPage ? (
          <Editor page={currentPage} />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#9ca3af',
            fontSize: '15px',
          }}>
            Select a page from the sidebar or create a new one.
          </div>
        )}
      </main>
    </div>
  );
}
