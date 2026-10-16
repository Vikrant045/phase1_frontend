import { ApiResponse, CreateTaskPayload, Task, TaskFilterParams, UpdateTaskPayload } from '@/types/task';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('phase1_api_url');
    if (saved) return saved;
  }
  return DEFAULT_BASE_URL;
};

export const setBaseUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('phase1_api_url', url.replace(/\/+$/, ''));
  }
};

async function fetchClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: ApiResponse<T> }> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let responseBody: any = null;
  let status = 0;
  let ok = false;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    status = res.status;
    ok = res.ok;

    const text = await res.text();
    try {
      responseBody = JSON.parse(text);
    } catch {
      responseBody = { raw: text };
    }
  } catch (err: any) {
    status = 0;
    ok = false;
    responseBody = {
      success: false,
      message: err.message || 'Network error: Cannot reach Phase 1 backend on http://localhost:5000',
    };
  }

  return { ok, status, data: responseBody };
}

export const api = {
  // 1. GET /api/v1/tasks (paginated, filtered, sorted, searched)
  async getTasks(params: TaskFilterParams = {}): Promise<ApiResponse<Task[]>> {
    const query = new URLSearchParams();

    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.priority && params.priority !== 'ALL') query.append('priority', params.priority);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());

    const queryString = query.toString();
    const endpoint = `/api/v1/tasks${queryString ? `?${queryString}` : ''}`;
    const res = await fetchClient<Task[]>(endpoint);
    return res.data;
  },

  // 2. GET /api/v1/tasks/:id
  async getTask(id: string): Promise<ApiResponse<Task>> {
    const res = await fetchClient<Task>(`/api/v1/tasks/${id}`);
    return res.data;
  },

  // 3. POST /api/v1/tasks
  async createTask(payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    const res = await fetchClient<Task>('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // 4. PATCH /api/v1/tasks/:id
  async updateTask(id: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> {
    const res = await fetchClient<Task>(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // 5. DELETE /api/v1/tasks/:id
  async deleteTask(id: string): Promise<ApiResponse<Task>> {
    const res = await fetchClient<Task>(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};
