'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PaginationMeta, 
  Task, 
  TaskFilterParams, 
  TaskPriority, 
  TaskStatus, 
  CreateTaskPayload 
} from '@/types/task';
import { api } from '@/lib/api';
import { initialMockTasks } from '@/lib/mockData';
import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { TaskTable } from '@/components/TaskTable';
import { TaskModal } from '@/components/TaskModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { Spinner } from '@/components/Spinner';

const PAGE_SIZE = 10;

export default function DashboardPage() {
  // Tasks & API State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [serverErrors, setServerErrors] = useState<Array<{ field: string; message: string }>>([]);

  // Filter Controls
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt');
  const [page, setPage] = useState(1);

  // Modal Controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [inspectTaskId, setInspectTaskId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Fetch Tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setServerErrors([]);

    const params: TaskFilterParams = {
      page,
      limit: PAGE_SIZE,
      status: statusFilter,
      priority: priorityFilter,
      sortBy,
      order: 'desc',
      search: search.trim() || undefined,
    };

    try {
      const res = await api.getTasks(params);
      if (res && res.success && Array.isArray(res.data)) {
        setTasks(res.data);
        if (res.meta) {
          setPaginationMeta(res.meta);
        }
      } else {
        if (tasks.length === 0) {
          setTasks(initialMockTasks);
          setPaginationMeta({
            page: 1,
            limit: PAGE_SIZE,
            totalItems: initialMockTasks.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          });
        }
      }
    } catch {
      if (tasks.length === 0) {
        setTasks(initialMockTasks);
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, priorityFilter, sortBy, search, tasks.length]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Create or Update task
  const handleTaskSubmit = async (data: CreateTaskPayload): Promise<boolean> => {
    setServerErrors([]);
    try {
      if (editingTask) {
        const res = await api.updateTask(editingTask.id, data);
        if (res.success) {
          showToast('Task updated');
          loadTasks();
          return true;
        } else {
          if (res.errors) setServerErrors(res.errors);
          showToast(res.message || 'Update failed');
          return false;
        }
      } else {
        const res = await api.createTask(data);
        if (res.success) {
          showToast('Task created');
          setPage(1);
          loadTasks();
          return true;
        } else {
          if (res.errors) setServerErrors(res.errors);
          showToast(res.message || 'Creation failed');
          return false;
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Network error');
      return false;
    }
  };

  // Quick Status change
  const handleQuickStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      const res = await api.updateTask(id, { status: newStatus });
      if (res.success) {
        showToast('Status updated');
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
        );
      } else {
        showToast(res.message || 'Could not update status');
      }
    } catch {
      showToast('Status update failed');
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await api.deleteTask(id);
      if (res.success) {
        showToast('Task deleted');
        loadTasks();
      } else {
        showToast(res.message || 'Failed to delete task');
      }
    } catch {
      showToast('Error deleting task');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '16px',
          zIndex: 100,
          background: '#e7f8ee',
          color: '#186a3d',
          padding: '6px 12px',
          border: '1px solid #b7e6c8',
          borderRadius: '6px',
          fontSize: '0.78rem',
        }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        onOpenCreateModal={() => {
          setEditingTask(null);
          setServerErrors([]);
          setIsCreateModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1080px', width: '100%', margin: '0 auto', padding: '1rem 1.2rem', flex: 1 }}>
        
        {/* Simple 1-line Stats */}
        <StatsBar tasks={tasks} totalServerItems={paginationMeta.totalItems} />

        {/* Clean, Simple Filter Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
          marginBottom: '0.8rem',
        }}>
          {/* Search + Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search here...."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field"
              style={{ width: '170px', height: '28px', fontSize: '0.78rem', padding: '0 8px' }}
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="input-field"
              style={{ width: '130px', height: '28px', fontSize: '0.78rem', padding: '0 4px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as any);
                setPage(1);
              }}
              className="input-field select-field"
              style={{ width: 'auto', height: '28px', fontSize: '0.78rem', padding: '0 6px' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Sort & Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sort by :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field select-field"
              style={{ width: 'auto', height: '28px', fontSize: '0.78rem', padding: '0 6px' }}
            >
              <option value="createdAt">Newest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>

            {loading && tasks.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updating...</span>
            )}
          </div>
        </div>

        {/* Task Table Container */}
        <div style={{ minHeight: '380px', position: 'relative' }}>
          {loading && tasks.length === 0 ? (
            <div className="spinner-wrapper" style={{ minHeight: '300px' }}>
              <Spinner size="md" label="Loading tasks..." />
            </div>
          ) : tasks.length === 0 ? (
            <div className="surface-card" style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}>
              <p style={{ marginBottom: '0.75rem' }}>No tasks found 🙁</p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsCreateModalOpen(true);
                }}
                className="btn btn-primary"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div style={{
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              transition: 'opacity 0.15s ease',
            }}>
              <TaskTable
                tasks={tasks}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsCreateModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                onInspect={(t) => setInspectTaskId(t.id)}
                onStatusChange={handleQuickStatusChange}
              />
            </div>
          )}
        </div>

        {/* Minimalist Pagination */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            Showing {tasks.length} of {paginationMeta.totalItems} tasks (Page : {paginationMeta.page} / {paginationMeta.totalPages})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!paginationMeta.hasPrev || loading}
              className="btn btn-secondary btn-sm"
              style={{ padding: '2px 6px', fontSize: '0.75rem' }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!paginationMeta.hasNext || loading}
              className="btn btn-secondary btn-sm"
              style={{ padding: '3px 12px', fontSize: '0.75rem', borderRadius: '15px' }}
            >
              Next
            </button>
          </div>
        </div>

      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
        serverErrors={serverErrors}
      />

      <TaskDetailModal
        taskId={inspectTaskId}
        onClose={() => setInspectTaskId(null)}
        onEdit={(task) => {
          setEditingTask(task);
          setIsCreateModalOpen(true);
        }}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
