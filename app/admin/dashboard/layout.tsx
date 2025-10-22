'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [testsExpanded, setTestsExpanded] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'super_admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (!user) return null;

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Tour Operators', path: '/admin/dashboard/organizations', icon: '🏢' },
    { label: 'Users', path: '/admin/dashboard/users', icon: '👥' },
    { label: 'Subscriptions', path: '/admin/dashboard/subscriptions', icon: '💳' },
    { label: 'Activity Logs', path: '/admin/dashboard/logs', icon: '📝' },
  ];

  const testMenuItems = [
    { label: 'Database Tests', path: '/admin/dashboard/tests', icon: '🧪' },
    { label: 'CRUD Tests', path: '/dashboard/test-crud', icon: '🔄' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Travel Quote AI</h1>
          <p className="text-sm text-gray-600">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* System Tests Group */}
          <div>
            <button
              onClick={() => setTestsExpanded(!testsExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span>🧪</span>
                <span className="font-medium">System Tests</span>
              </div>
              <span className={`transition-transform ${testsExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {testsExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                {testMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                      pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
