import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "../RegistrationForm";
import React from "react";

// Create the mock function outside
const mockIncrementRegistration = vi.fn();

// Mock the RegistrationContext
vi.mock('../../context/RegistrationContext', () => ({
  RegistrationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRegistration: () => ({
    incrementRegistration: mockIncrementRegistration,
  }),
}));

describe('Registration Component', () => {
  beforeEach(() => {
    // Clear mock before each test
    mockIncrementRegistration.mockClear();
  });

  it('check validation on Registration component - prevents submission with invalid email', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
    // Fill form with invalid email
    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('ProGamer123'), 'ProGamer123');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'invalidemail');
    await user.type(screen.getByPlaceholderText('Valorant'), 'Valorant');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);
    
    // Wait a bit for any async validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Form should NOT have submitted (validation should have blocked it)
    expect(mockIncrementRegistration).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    
    // The form should still be visible (not closed)
    expect(screen.getByRole('button', { name: /complete registration/i })).toBeInTheDocument();
  });

  it('allows form submission with valid email', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
    // Fill form with VALID data
    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
    await user.type(screen.getByPlaceholderText('ProGamer123'), 'ProGamer123');
    await user.type(screen.getByPlaceholderText('john@example.com'), 'valid@email.com');
    await user.type(screen.getByPlaceholderText('Valorant'), 'Valorant');
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);
    
    // Wait for the async submission (your component has a 1 second delay)
    await waitFor(
      () => {
        expect(mockIncrementRegistration).toHaveBeenCalled();
      },
      { timeout: 2000 } // Increase timeout to account for the 1s delay in onSubmit
    );
  });
});

//updated
// import { describe, it, expect, vi } from "vitest";
// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { RegistrationForm } from "../RegistrationForm";
// import React from "react";

// // Mock the RegistrationContext
// const mockIncrementRegistration = vi.fn();

// vi.mock('../../context/RegistrationContext', () => ({
//   RegistrationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//   useRegistration: () => ({
//     incrementRegistration: mockIncrementRegistration,
//   }),
// }));

// describe('Registration Component', () => {
//   it('check validation on Registration component', async () => {
//     const user = userEvent.setup();
//     const mockOnClose = vi.fn();
    
//     render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
//     const fullNameInput = screen.getByPlaceholderText('John Doe');
//     const gamerTagInput = screen.getByPlaceholderText('ProGamer123');
//     const emailInput = screen.getByPlaceholderText('john@example.com');
//     const favoriteGameInput = screen.getByPlaceholderText('Valorant');
    
//     await user.type(fullNameInput, 'John Doe');
//     await user.type(gamerTagInput, 'ProGamer123');
//     await user.type(emailInput, 'invalidemail'); // Invalid email
//     await user.type(favoriteGameInput, 'Valorant');
    
//     const submitButton = screen.getByRole('button', { name: /complete registration/i });
//     await user.click(submitButton);
    
//     // Wait and check that the form did NOT submit successfully
//     await waitFor(
//       () => {
//         // incrementRegistration should NOT have been called due to validation failure
//         expect(mockIncrementRegistration).not.toHaveBeenCalled();
//       },
//       { timeout: 3000 }
//     );
    
//     // Additional check: the modal should still be open (not closed)
//     expect(mockOnClose).not.toHaveBeenCalled();
//   });
// });



//original
// import { describe, it, expect, vi } from "vitest";
// import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { RegistrationForm } from "../RegistrationForm";
// import React from "react";

// // Mock the RegistrationContext
// const mockIncrementRegistration = vi.fn();

// vi.mock('../../context/RegistrationContext', () => ({
//   RegistrationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//   useRegistration: () => ({
//     incrementRegistration: mockIncrementRegistration,
//   }),
// }));

// describe('Registration Component', () => {
//   it('check validation on Registration component', async () => {
//     const user = userEvent.setup();
//     const mockOnClose = vi.fn();
    
//     render(<RegistrationForm isOpen={true} onClose={mockOnClose} />);
    
//     // Fill in form with VALID data first to ensure everything works
//     const fullNameInput = screen.getByPlaceholderText('John Doe');
//     const gamerTagInput = screen.getByPlaceholderText('ProGamer123');
//     const emailInput = screen.getByPlaceholderText('john@example.com');
//     const favoriteGameInput = screen.getByPlaceholderText('Valorant');
    
//     // Type invalid email
//     await user.type(fullNameInput, 'John Doe');
//     await user.type(gamerTagInput, 'ProGamer123');
//     await user.type(emailInput, 'invalidemail'); // Invalid email
//     await user.type(favoriteGameInput, 'Valorant');
    
//     // Submit the form
//     const submitButton = screen.getByRole('button', { name: /complete registration/i });
//     await user.click(submitButton);
    
//     // Wait for potential error message with a more flexible approach
//     await waitFor(
//       async () => {
//         const errorText = screen.queryByText(/please enter a valid email address/i) ||
//                          screen.queryByText(/valid email/i) ||
//                          screen.queryByText(/email/i);
        
//         // If no error found, check that the form did NOT submit successfully
//         // (incrementRegistration should NOT have been called)
//         expect(mockIncrementRegistration).not.toHaveBeenCalled();
//       },
//       { timeout: 3000 }
//     );
    
//     // Additional check: the modal should still be open (not closed)
//     expect(mockOnClose).not.toHaveBeenCalled();
//   });
// });