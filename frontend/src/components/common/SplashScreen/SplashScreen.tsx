import { useEffect, useState } from 'react';
import f1Logo from '../../../assets/F1-logo-square.svg';
import './SplashScreen.scss';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const [state, setState] = useState<'center' | 'header'>('center');

  useEffect(() => {
    // Start the animation after a short delay
    const timer = setTimeout(() => {
      setState('header');
      onAnimationComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div data-testid="splash-screen" className={`splash-screen ${state}`}>
      <img 
        src={f1Logo} 
        alt="F1 World Champions" 
        className="splash-logo"
      />
    </div>
  );
}; 

export { SplashScreen };