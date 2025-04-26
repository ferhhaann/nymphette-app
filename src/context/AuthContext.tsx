
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type UserRole = 'super_admin' | 'tour_manager';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@tours.com',
    password: 'admin123',
    role: 'super_admin' as UserRole,
    name: 'John Admin'
  },
  {
    id: '2',
    email: 'manager@tours.com',
    password: 'manager123',
    role: 'tour_manager' as UserRole,
    name: 'Jane Manager'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('tourUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to your auth service
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create the user object without the password
      const authenticatedUser = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      };
      
      // Save to localStorage (in a real app, you'd use secure cookies or tokens)
      localStorage.setItem('tourUser', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Remove from localStorage
      localStorage.removeItem('tourUser');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email: string, password: string, role: UserRole, name: string) => {
    try {
      setLoading(true);
      // Check if user with this email already exists
      const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, this would create a new user in your auth system
      // For now, we'll just show a success message
      toast.success(`New ${role} account created for ${email}`);
    } catch (error) {
      console.error('Create user error:', error);
      toast.error('Failed to create user: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole: user?.role || null,
        login,
        logout,
        createUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
