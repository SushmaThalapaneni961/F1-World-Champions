import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import RaceWinners from '../pages/RaceWinners/RaceWinners';
import Seasons from '../pages/Seasons/Seasons';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/seasons" replace />,
      },
      {
        path: 'seasons',
        element: <Seasons />,
      },
      {
        path: 'raceWinners/:season',
        element: <RaceWinners />,
      },
    ],
  },
]);
  
export default router;