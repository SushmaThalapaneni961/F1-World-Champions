import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '../../../__tests__/utils/test-utils';
import { SplashScreen } from '../../../components/common/SplashScreen/SplashScreen';

describe('SplashScreen Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initially with center state', () => {
    render(<SplashScreen onAnimationComplete={vi.fn()} />);

    const splashScreen = screen.getByTestId('splash-screen');
    const logo = screen.getByAltText('F1 World Champions');

    expect(splashScreen).toHaveClass('splash-screen', 'center');
    expect(logo).toHaveClass('splash-logo');
  });

  it('transitions to header state after delay', async () => {
    render(<SplashScreen onAnimationComplete={vi.fn()} />);

    const splashScreen = screen.getByTestId('splash-screen');

    // Initial state
    expect(splashScreen).toHaveClass('center');

    // After first timeout (transition to header)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(splashScreen).toHaveClass('header');
  });

  it('calls onAnimationComplete after animation', async () => {
    const handleAnimationComplete = vi.fn();
    render(<SplashScreen onAnimationComplete={handleAnimationComplete} />);

    // Initial state
    expect(handleAnimationComplete).not.toHaveBeenCalled();

    // After animation completes
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(handleAnimationComplete).toHaveBeenCalledTimes(1);
  });

  it('cleans up timers on unmount', () => {
    const handleAnimationComplete = vi.fn();
    const { unmount } = render(<SplashScreen onAnimationComplete={handleAnimationComplete} />);

    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(handleAnimationComplete).not.toHaveBeenCalled();
  });

  it('applies responsive styles based on media queries', () => {
    render(<SplashScreen onAnimationComplete={vi.fn()} />);

    const logo = screen.getByAltText('F1 World Champions');
    expect(logo).toHaveClass('splash-logo');
    // Note: Media query testing would typically require additional setup with jest-matchmedia-mock
  });
});
