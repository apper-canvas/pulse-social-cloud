import Home from '@/components/pages/Home';
import Search from '@/components/pages/Search';
import Notifications from '@/components/pages/Notifications';
import Profile from '@/components/pages/Profile';
import PostDetail from '@/components/pages/PostDetail';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: Notifications
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  },
  postDetail: {
    id: 'post-detail',
    label: 'Post',
    path: '/post/:id',
    icon: 'MessageCircle',
    component: PostDetail
  }
};

export const routeArray = Object.values(routes);
export default routes;