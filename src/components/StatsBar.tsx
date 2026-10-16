'use client';

import React from 'react';
import { Task } from '@/types/task';

interface StatsBarProps {
  tasks: Task[];
  totalServerItems?: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ tasks, totalServerItems }) => {
  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalCount = totalServerItems !== undefined ? totalServerItems : tasks.length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      marginBottom: '0.8rem',
      flexWrap: 'wrap',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '8px 12px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        Total : <strong style={{ color: 'var(--text-main)' }}>{totalCount}</strong>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '6px 10px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        Pending : <strong style={{ color: '#da8b00' }}>{pendingCount}</strong>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '9px 14px',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        In Progress : <strong style={{ color: '#2b7fd4' }}>{inProgressCount}</strong>
      </div>

      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '7px 10px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        Completed : <strong style={{ color: '#12a35a' }}>{completedCount}</strong>
      </div>
    </div>
  );
};