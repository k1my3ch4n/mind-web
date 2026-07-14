import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { CanvasPage } from '@pages/canvas';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/workspace',
    element: <CanvasPage />,
  },
]);
