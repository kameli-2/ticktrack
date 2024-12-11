import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('renders correct title', () => {
  render(<App />);
  const h1 = screen.getByRole('heading', { level: 1 });
  expect(h1.innerHTML).toContain('Time Tracker');
});
