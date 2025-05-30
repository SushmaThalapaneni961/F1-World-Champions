import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import router from './routes/route';
import './styles/global.scss';

const App = () => {
  return (
    <Suspense fallback={<div className="loader" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
