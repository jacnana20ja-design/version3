import React from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}