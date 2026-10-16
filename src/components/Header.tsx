'use client';

import React from 'react';

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '2px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '1050px',
        margin: '0 auto',
        padding: '0.7rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          paddingTop: '3px', // looks better aligned like this
        }}>
           Task Manager
        </h1>

        <div style={{ paddingTop: '2px' }}>
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary"
          >
             Add Task
          </button>
        </div>
      </div>
    </header>
  );
};