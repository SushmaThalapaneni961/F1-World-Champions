import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import RaceWinners from '../pages/RaceWinners/RaceWinners';
import Seasons from '../pages/Seasons/Seasons';

const router = createBrowserRouter([
    // {
      // path: 'seasons',
      // element: <Layout />,
      // children: [
        {
            path: '/seasons',
            element: <Seasons />,
        },
        {
          path: '/racewinners/:season',
          element: <RaceWinners />,
        },
      // ],
    // },
    {
      path: '*',
      element: '404 Not Found',
    },
  ]);
  
  export default router;