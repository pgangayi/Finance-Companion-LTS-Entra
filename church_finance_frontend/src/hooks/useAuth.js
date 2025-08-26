import { useAuth } from '../context/AuthContext';

export const useAuth = () => {
  // This is just a re-export for convenience
  // The actual hook is defined in AuthContext.js
  return useAuth();
};