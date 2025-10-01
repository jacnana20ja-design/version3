import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import NotificationModal from '../Modals/NotificationModal';
import SearchModal from '../Modals/SearchModal';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <>
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-4 fixed top-0 right-0 md:left-64 left-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md hidden md:block ml-12 md:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher stagiaires, projets, tâches..."
              onClick={() => setShowSearch(true)}
              readOnly
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      onClick={() => {
                        console.log('Mark all as read');
                      }}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${!notification.read ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                          notification.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/50' :
                          'bg-blue-100 dark:bg-blue-900/50'
                        }`}>
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                          {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                          {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{notification.timestamp}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-200"
            >
              <img
                src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="text-sm hidden md:block">
                <div className="font-medium text-gray-900 dark:text-white">Utilisateur Admin</div>
                <div className="text-gray-500 dark:text-gray-400">Administrateur</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Mon profil
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Paramètres
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    
    {/* Modals */}
    <NotificationModal 
      isOpen={showNotifications} 
      onClose={() => setShowNotifications(false)} 
    />
    <SearchModal 
      isOpen={showSearch} 
      onClose={() => setShowSearch(false)} 
    />
    
    {/* Overlay for profile dropdown */}
    {showProfile && (
      <div 
        className="fixed inset-0 z-10" 
        onClick={() => setShowProfile(false)}
      />
    )}
    </>
  );
}