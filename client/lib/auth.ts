// lib/auth.ts
export const getToken = (): string | null => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Check localStorage first, then sessionStorage
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const getUserData = () => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Check localStorage first, then sessionStorage
  const userDataStr = localStorage.getItem('userData') || sessionStorage.getItem('userData');
  return userDataStr ? JSON.parse(userDataStr) : null;
};

export const setAuthTokens = (token: string, userData: any, rememberMe: boolean) => {
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
  }
};

export const removeAuthTokens = () => {
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token !== '';
};

// Function to make authenticated API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token might be expired, remove tokens and redirect to login
    removeAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return Promise.reject(new Error('Unauthorized'));
  }

  return response;
};