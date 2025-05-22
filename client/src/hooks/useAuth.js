import api from "@/utils/api";
import { useState, useCallback } from "react";

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/auth/status");
      return response.isAuthenticated;
    } catch (err) {
      console.error("Error checking auth status:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await api.post("/api/auth/logout");
      return true;
    } catch (err) {
      setError(err.message || "Failed to logout");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    checkAuthStatus,
    logout,
  };
}
