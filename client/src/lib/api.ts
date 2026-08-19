const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface ApiSuccess<T> {
  success: true
  data: T
}

interface ApiFailure {
  success: false
  message: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null

  if (!response.ok || !body || !body.success) {
    throw new ApiError(
      response.status,
      body && !body.success ? body.message : 'Qualcosa è andato storto',
    )
  }

  return body.data
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
