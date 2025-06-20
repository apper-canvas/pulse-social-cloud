import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Mock notifications data
  const mockNotifications = [
    {
      Id: 1,
      type: 'like',
      userId: '2',
      userName: 'Sarah Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      content: 'liked your post',
      postContent: 'Just finished building an amazing React component library!',
      createdAt: '2024-01-15T14:30:00Z',
      read: false
    },
    {
      Id: 2,
      type: 'comment',
      userId: '3',
      userName: 'Alex Chen',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'commented on your post',
      commentContent: 'Great work! TypeScript really makes a huge difference.',
      createdAt: '2024-01-15T15:15:00Z',
      read: false
    },
    {
      Id: 3,
      type: 'follow',
      userId: '4',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'started following you',
      createdAt: '2024-01-15T10:00:00Z',
      read: true
    },
    {
      Id: 4,
      type: 'like',
      userId: '5',
      userName: 'David Kim',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      content: 'liked your post',
      postContent: 'Beautiful sunset from my morning hike!',
      createdAt: '2024-01-15T08:45:00Z',
      read: true
    }
  ];
  
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setLoading(false);
    };
    
    loadNotifications();
  }, []);
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.Id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'Heart', color: 'text-red-400' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-blue-400' };
      case 'follow':
        return { name: 'UserPlus', color: 'text-green-400' };
      default:
        return { name: 'Bell', color: 'text-gray-400' };
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <SkeletonLoader count={4} type="comment" />
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <EmptyState
          title="No notifications yet"
          description="When someone likes your posts, follows you, or comments, you'll see it here"
          icon="Bell"
        />
      </div>
    );
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      {/* Notifications */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const icon = getNotificationIcon(notification.type);
          
          return (
            <motion.div
              key={notification.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              className={`
                bg-surface/50 border rounded-xl p-4 cursor-pointer transition-all
                ${notification.read 
                  ? 'border-gray-700/50' 
                  : 'border-primary/30 bg-primary/5'
                }
              `}
              onClick={() => markAsRead(notification.Id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar 
                    src={notification.userAvatar}
                    alt={notification.userName}
                    size="md"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-surface border-2 border-background rounded-full flex items-center justify-center`}>
                    <ApperIcon name={icon.name} className={`w-3 h-3 ${icon.color}`} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white text-sm">
                      {notification.userName}
                    </p>
                    <span className="text-gray-400 text-sm">
                      {notification.content}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  
                  {notification.postContent && (
                    <p className="text-gray-300 text-sm mb-2 line-clamp-1">
                      "{notification.postContent}"
                    </p>
                  )}
                  
                  {notification.commentContent && (
                    <p className="text-gray-300 text-sm mb-2 line-clamp-1">
                      "{notification.commentContent}"
                    </p>
                  )}
                  
                  <p className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Notifications;