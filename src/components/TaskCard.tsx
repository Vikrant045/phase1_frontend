'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onInspect: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onInspect,
  onStatusChange,
}) => {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge badge-high">High</span>;
      case 'MEDIUM':
        return <span className="badge badge-medium">Medium</span>;
      case 'LOW':
        return <span className="badge badge-low">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-progress">In Progress</span>;
      case 'PENDING':
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'COMPLETED') {
      onStatusChange(task.id, 'PENDING');
    } else if (task.status === 'PENDING') {
      onStatusChange(task.id, 'IN_PROGRESS');
    } else {
      onStatusChange(task.id, 'COMPLETED');
    }
  };

  return (
    <div
      className="surface-card surface-card-hover"
      onClick={() => onInspect(task)}
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff',
        border: isOverdue ? '1px solid #fecaca' : undefined,
      }}
    >
      <div>
        {/* Top Header: Badges & Status Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>

          <button
            onClick={toggleStatus}
            className="btn btn-subtle btn-sm"
            style={{ padding: '0.2rem 0.35rem', borderRadius: '6px' }}
            title="Click to cycle status"
          >
            {isCompleted ? (
              <CheckCircle2 size={17} color="#059669" />
            ) : (
              <Circle size={17} color="#94a3b8" />
            )}
          </button>
        </div>

        {/* Task Title */}
        <h3
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: isCompleted ? 'var(--text-light)' : 'var(--text-main)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            marginBottom: '0.4rem',
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          lineHeight: 1.45,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description || <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No description</span>}
        </p>
      </div>

      {/* Footer: Due date & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '0.75rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        {/* Due date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} color={isOverdue ? '#dc2626' : '#64748b'} />
          <span style={{ color: isOverdue ? '#dc2626' : 'inherit', fontWeight: isOverdue ? 600 : 500 }}>
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            }) : 'No due date'}
          </span>
          {isOverdue && <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.7rem' }}>(Overdue)</span>}
        </div>

        {/* Action text buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onInspect(task)}
            className="btn-action btn-action-view"
            title="View Details"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(task)}
            className="btn-action btn-action-edit"
            title="Edit Task"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete task "${task.title}"?`)) {
                onDelete(task.id);
              }
            }}
            className="btn-action btn-action-delete"
            title="Delete Task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
