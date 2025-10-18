import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero Component', () => {
  it('renders the hero title correctly', () => {
    const mockOnClick = vi.fn();
    render(<Hero onRegisterClick={mockOnClick} />);
    
    expect(screen.getByText(/Legends of Victory/i)).toBeInTheDocument();
  });

  it('calls onRegisterClick when button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<Hero onRegisterClick={mockOnClick} />);
    
    const button = screen.getByText(/Register Now/i);
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});