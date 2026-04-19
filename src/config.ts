// Configuration for the API URL
// In development, we use localhost:3001
// In production, we will use the environment variable provided by Vite/Vercel

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
