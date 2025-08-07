import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.15:6075/api';

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiService.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  signup: (data: SignupData) => apiService.post('/users/signup', data),
  login: (data: LoginData) => apiService.post('/users/login', data),
  getUserStats: () => apiService.get('/users/stats'),
  getGlobalStats: () => apiService.get('/users/global-stats'),
};

export const leaguesAPI = {
  getLeagues: () => apiService.get('/leagues/get'),
  createLeague: (name: string) => apiService.post('/leagues/create', { name }),
  getLeague: (id: number) => apiService.get(`/leagues/get/${id}`),
  joinLeague: (leagueId: number) => apiService.post(`/leagues/${leagueId}/join`),
  joinByCode: (joinCode: string) => apiService.post('/leagues/join-by-code', { joinCode }),
  getLeagueByCode: (joinCode: string) => apiService.get(`/leagues/code/${joinCode}`),
  getLeagueMembers: (leagueId: number) => apiService.get(`/leagues/${leagueId}/members`),
  getLeagueStandings: (leagueId: number) => apiService.get(`/leagues/${leagueId}/standings`),
  getLeagueStats: (leagueId: number) => apiService.get(`/leagues/${leagueId}/stats`),
};

export const picksAPI = {
  makePick: (leagueId: number, weekNumber: number, driverId: number) =>
    apiService.post('/picks/make', { leagueId, weekNumber, driverId }),
  getUserPicks: (leagueId: number) => apiService.get(`/picks/user/${leagueId}`),
  getLeaguePicks: (leagueId: number, weekNumber: number) =>
    apiService.get(`/picks/league/${leagueId}/week/${weekNumber}`),
  getRaceResults: (leagueId: number, weekNumber: number) =>
    apiService.get(`/picks/results/${leagueId}/week/${weekNumber}`),
};

export const driversAPI = {
  getDrivers: () => apiService.get('/drivers/get'),
};

export const f1racesAPI = {
  getCurrentRace: () => apiService.get('/f1races/current'),
  getAllRaces: (seasonYear = 2025) => apiService.get(`/f1races/all?seasonYear=${seasonYear}`),
  getRaceByWeek: (weekNumber: number, seasonYear = 2025) =>
    apiService.get(`/f1races/week/${weekNumber}?seasonYear=${seasonYear}`),
  populateSeason: () => apiService.post('/f1races/populate-season'),
};

export const activityAPI = {
  getLeagueActivity: (leagueId: number, limit = 20) =>
    apiService.get(`/activity/league/${leagueId}?limit=${limit}`),
  getRecentActivity: (leagueId: number, limit = 10) =>
    apiService.get(`/activity/league/${leagueId}/recent?limit=${limit}`),
};

// Types
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface League {
  id: number;
  name: string;
  ownerId: number;
  seasonYear: number;
  joinCode?: string;
  memberCount?: number;
  isMember?: boolean;
  userRole?: 'Owner' | 'Member';
}

export interface Driver {
  id: number;
  name: string;
  team: string;
  driverNumber: number;
  country: string;
}

export interface Pick {
  id: number;
  leagueId: number;
  weekNumber: number;
  driverId: number;
  driverName: string;
  isLocked: boolean;
  points: number;
} 
