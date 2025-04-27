import React, { useState, useEffect } from 'react';
import { Users, Film, MessageSquare, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  const getActivityIcon = (type) => {
    const icons = {
      USER_REGISTER: <Users className="w-5 h-5 text-red-500" />,
      MOVIE_ADD: <Film className="w-5 h-5 text-red-500" />,
      MOVIE_UPDATE: <Edit className="w-5 h-5 text-red-500" />,
      CONTACT_ADD: <MessageSquare className="w-5 h-5 text-red-500" />
    };
    return icons[type] || <Users className="w-5 h-5 text-red-500" />;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities', {
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          }
        });
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 6000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="font-medium dark:text-white">{activity.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {dayjs(activity.created_at).fromNow()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;