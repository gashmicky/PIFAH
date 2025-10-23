import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isFocalPerson: user?.role === "focal_person",
    isApprover: user?.role === "approver",
    isPublic: user?.role === "public",
  };
}
