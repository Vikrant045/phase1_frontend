'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onInspect: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onInspect,
  onStatusChange,
}) => {
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

  return (
    <div className="surface-card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ background: '#f4f6f9', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 'bold', width: '32%', textAlign: 'left' }}>Title</th>
            <th style={{ padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 'bold', width: '15%', textAlign: 'left' }}>STATUS</th>
            <th style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 'bold', width: '12%', textAlign: 'left' }}>Priority</th>
            <th style={{ padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 'bold', width: '14%', textAlign: 'left' }}>Due Date</th>
            <th style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 'bold', width: '11%', textAlign: 'center' }}>Created</th>
            <th style={{ padding: '6px 12px', color: 'var(--text-muted)', fontWeight: 'bold', width: '16%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

            return (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                {/* title and desc */}
                <td style={{ padding: '7px 10px' }}>
                  <div
                    onClick={() => onInspect(task)}
                    style={{
                      fontWeight: 500,
                      color: isCompleted ? 'var(--text-light)' : 'var(--text-main)',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '340px',
                    }}>
                      {task.description}
                    </div>
                  )}
                </td>

                {/* status dropdown */}
                <td style={{ padding: '6px 12px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                    className="input-field"
                    style={{ padding: '1px 2px', fontSize: '0.75rem', height: '24px' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>

                {/* priority badge */}
                <td style={{ padding: '7px 10px' }}>
                  {getPriorityBadge(task.priority)}
                </td>

                {/* due date */}
                <td style={{ padding: '6px 12px', fontSize: '0.75rem', color: isOverdue ? '#e02020' : 'var(--text-main)' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}
                </td>

                {/* created date */}
                <td style={{ padding: '7px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>

                {/* action buttons */}
                <td style={{ padding: '6px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onInspect(task)}
                      className="btn-action btn-action-view"
                      title="View task details"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="btn-action btn-action-edit"
                      title="Edit task"
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
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};