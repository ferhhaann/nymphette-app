
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, User, ShieldCheck } from 'lucide-react';

const UserManagementPanel = () => {
  const { createUser, userRole } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'tour_manager' | 'super_admin'>('tour_manager');
  const [isLoading, setIsLoading] = useState(false);

  // Only super admins should access this panel
  if (userRole !== 'super_admin') {
    return (
      <div className="p-6 text-center text-red-400">
        <ShieldCheck className="h-12 w-12 mx-auto mb-2 text-red-400" />
        <h2 className="text-xl font-semibold">Unauthorized Access</h2>
        <p className="mt-2">You do not have permission to manage users.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) return;
    
    setIsLoading(true);
    try {
      await createUser(email, password, selectedRole, name);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole('tour_manager');
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 via-purple-200 to-blue-100 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-blue-200/80 mt-1">
            Create and manage tour manager accounts
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create User Form */}
        <Card className="col-span-1 backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-100">
              <UserPlus className="h-5 w-5 mr-2" /> Create New User
            </CardTitle>
            <CardDescription className="text-gray-400">
              Add a new tour manager or admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="name">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  User Role
                </label>
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant={selectedRole === 'tour_manager' ? 'default' : 'outline'}
                    className={selectedRole === 'tour_manager' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                    }
                    onClick={() => setSelectedRole('tour_manager')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Tour Manager
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === 'super_admin' ? 'default' : 'outline'}
                    className={selectedRole === 'super_admin' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                    }
                    onClick={() => setSelectedRole('super_admin')}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Super Admin
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-white rounded-full" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Mock User List */}
        <Card className="col-span-1 md:col-span-2 backdrop-blur-lg bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-100">
              <User className="h-5 w-5 mr-2" /> Current Users
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage existing user accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Sample user entries - in a real app, this would be populated from API */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">John Admin</div>
                    <div className="text-sm text-gray-400">admin@tours.com</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full">
                    Super Admin
                  </span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Jane Manager</div>
                    <div className="text-sm text-gray-400">manager@tours.com</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-full">
                    Tour Manager
                  </span>
                </div>
              </div>
              
              {/* You can add more mock users here */}
              
              <div className="text-center py-3 text-sm text-gray-400">
                In a real application, this would be a dynamic list with edit/delete functionality
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagementPanel;
