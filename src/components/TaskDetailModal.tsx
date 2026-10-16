'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { api } from '@/lib/api';
import { Spinner } from '@/components/Spinner';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    let isMounted = true;
    setLoading(true);

    api.getTask(taskId).then((res) => {
      if (!isMounted) return;
      setRawResponse(res);
      if (res && res.data) {
        setTask(res.data);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  if (!taskId) return null;

  const handleCopy = () => {
    if (rawResponse) {
      navigator.clipboard.writeText(JSON.stringify(rawResponse, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Task Details
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {taskId}
            </span>
          </div>
          <button onClick={onClose} className="btn btn-subtle btn-sm" style={{ padding: '2px 5px', fontSize: '0.8rem' }}>
            ✖
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Spinner size="sm" label="Loading..." />
            </div>
          ) : task ? (
            <>
              {/* Badges & Title */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span className={`badge ${
                    task.status === 'COMPLETED' ? 'badge-completed' :
                    task.status === 'IN_PROGRESS' ? 'badge-progress' : 'badge-pending'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`badge ${
                    task.priority === 'HIGH' ? 'badge-high' :
                    task.priority === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {task.title}
                </h3>
              </div>

              {/* Description */}
              <div style={{
                background: '#f8f9fb',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.75rem',
                fontSize: '0.8rem',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Description
                </div>
                <p style={{ color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {task.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>None</span>}
                </p>
              </div>

              {/* Metadata */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                fontSize: '0.75rem',
              }}>
                <div style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Due Date</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '6px 10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>Created</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '9px 8px', background: '#fafbfd' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Updated</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)', marginTop: '2px' }}>
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Technical JSON Toggle */}
              <div style={{ marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="btn btn-subtle btn-sm"
                  style={{ fontSize: '0.75rem', padding: '2px 4px' }}
                >
                  <span style={{ fontSize: '0.75rem' }}>{showTechnical ? 'Hide JSON' : 'Show JSON'}</span>
                </button>

                {showTechnical && (
                  <div style={{ marginTop: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                      <button
                        onClick={handleCopy}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      >
                        <span>{copied ? 'Copied ✔' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <div className="code-box" style={{ maxHeight: '140px', fontSize: '11px' }}>
                      {JSON.stringify(rawResponse, null, 2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.75rem',
              }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(task);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete task "${task.title}"?`)) {
                      onDelete(task.id);
                      onClose();
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#dc2626', fontSize: '0.8rem' }}>
              Could not load task details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
