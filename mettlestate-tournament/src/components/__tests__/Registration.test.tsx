import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "../RegistrationForm";
import React from "react";

const mockIncrementRegistration = vi.fn();

vi.mock('../../context/RegistrationContext', () => ({
  RegistrationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRegistration: () => ({
    incrementRegistration: mockIncrementRegistration,
  }),
}));

describe('Registration Component', () => {
  beforeEach(() => {
    mockIncrementRegistration.mockClear();
  });

  it('check validation on Registration component - prevents submission with invalid email', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
    // Fill in registration form with invalid email address
    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('ProGamer123'), 'ProGamer123');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'invalidemail');
    await user.type(screen.getByPlaceholderText('Valorant'), 'Valorant');
    
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    expect(mockIncrementRegistration).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    
    expect(screen.getByRole('button', { name: /complete registration/i })).toBeInTheDocument();
  });

  it('allows form submission with valid email', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
    // Fill the registration form in with valid email
    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('ProGamer123'), 'ProGamer123');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'valid@email.com');
    await user.type(screen.getByPlaceholderText('Valorant'), 'Valorant');
    
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);
    
    await waitFor(
      () => {
        expect(mockIncrementRegistration).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });
});