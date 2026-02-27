import { createBrowserRouter } from 'react-router';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { DashboardRouter } from './components/DashboardRouter';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: Layout,
    children: [
      {
        index: true,
        Component: DashboardRouter,
      },
    ],
  },
]);