'use client';

import React, { useState, useEffect } from 'react';
import { CreateTaskPayload, Task, TaskPriority, TaskStatus } from '@/types/task';
import { Spinner } from '@/components/Spinner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => Promise<boolean>;
  editingTask?: Task | null;
  serverErrors?: Array<{ field: string; message: string }>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  serverErrors = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setPriority('MEDIUM');
      setDueDate('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateTaskPayload = {
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    const success = await onSubmit(payload);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const getFieldError = (fieldName: string) => {
    const found = serverErrors.find((e) => e.field === fieldName);
    return found ? found.message : null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-subtle btn-sm"
            style={{ padding: '2px 5px', fontSize: '0.8rem' }}
          >
            ✖
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          {/* Validation Alert */}
          {serverErrors.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '2px',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: '#991b1b',
            }}>
              <div>
                {serverErrors.map((err, i) => (
                  <div key={i}>⚠️ {err.field}: {err.message}</div>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
              Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              placeholder="Task title (min 3 chars)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              style={{
                borderColor: getFieldError('title') ? '#dc2626' : undefined,
                height: '32px',
                fontSize: '0.85rem',
              }}
            />
            {getFieldError('title') && (
              <span style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                {getFieldError('title')}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
              Description :
            </label>
            <textarea
              rows={2}
              maxLength={5000}
              placeholder="Task details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical', minHeight: '70px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Priority & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field select-field"
                style={{ height: '32px', fontSize: '0.85rem' }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="input-field select-field"
                style={{ height: '32px', fontSize: '0.85rem' }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
              style={{ height: '32px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '0.75rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '2px' }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: '10px', padding: '5px 14px' }}
              disabled={isSubmitting || title.trim().length < 3}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="xs" color="#ffffff" inline />
                  <span>Saving...</span>
                </>
              ) : editingTask ? (
                'Update'
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
