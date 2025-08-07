import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:6075/api'; // Change this to your API URL

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiService.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
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
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email: string, password: string) =>
    apiService.post('/users/login', { email, password }),
  signup: (email: string, password: string, name: string) =>
    apiService.post('/users/signup', { email, password, name }),
};

export const leaguesAPI = {
  getLeagues: () => apiService.get('/leagues'),
  createLeague: (name: string) => apiService.post('/leagues', { name }),
  getLeague: (id: number) => apiService.get(`/leagues/${id}`),
  joinLeague: (leagueId: number) => apiService.post(`/leagues/${leagueId}/join`),
  getLeagueMembers: (leagueId: number) => apiService.get(`/leagues/${leagueId}/members`),
  getLeagueStandings: (leagueId: number) => apiService.get(`/leagues/${leagueId}/standings`),
  getLeagueStats: (leagueId: number) => apiService.get(`/leagues/${leagueId}/stats`),
  getLeagueByCode: (joinCode: string) => apiService.get(`/leagues/code/${joinCode}`),
  joinByCode: (joinCode: string) => apiService.post(`/leagues/join/${joinCode}`),
};

export const picksAPI = {
  makePick: (leagueId: number, weekNumber: number, driverId: number) =>
    apiService.post('/picks', { leagueId, weekNumber, driverId }),
  getUserPicks: (leagueId: number) => apiService.get(`/picks/user/${leagueId}`),
  getLeaguePicks: (leagueId: number, weekNumber: number) =>
    apiService.get(`/picks/league/${leagueId}/${weekNumber}`),
  getRaceResults: (leagueId: number, weekNumber: number) =>
    apiService.get(`/picks/results/${leagueId}/week/${weekNumber}`),
};

export const driversAPI = {
  getDrivers: () => apiService.get('/drivers'),
};

export const f1racesAPI = {
  getCurrentRace: () => apiService.get('/f1races/current'),
  getAllRaces: (seasonYear = 2025) => apiService.get(`/f1races/all?seasonYear=${seasonYear}`),
  getRaceByWeek: (weekNumber: number, seasonYear = 2025) =>
    apiService.get(`/f1races/week/${weekNumber}?seasonYear=${seasonYear}`),
}; 