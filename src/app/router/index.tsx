import { createBrowserRouter } from 'react-router-dom';
import { CanvasPage } from '@pages/canvas';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CanvasPage />,
  },
]);
