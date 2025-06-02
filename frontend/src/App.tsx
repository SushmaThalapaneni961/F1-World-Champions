import { RouterProvider } from 'react-router-dom';
import { Suspense, useState } from 'react';
import router from './routes/route';
import './styles/global.scss';
import { SplashScreen } from './components/common/SplashScreen/SplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} />}
      <Suspense fallback={<div className="loader" />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
};

export default App;
