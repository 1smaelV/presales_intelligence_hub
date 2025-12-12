import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import PresalesHub from '../app/presales-hub-v1';

describe('PresalesHub', () => {
    it('renders the main title', () => {
        render(<PresalesHub />);
        const expandButton = screen.getByLabelText(/Expand sidebar/i);
        act(() => {
            expandButton.click();
        });
        expect(screen.getByText('Presales Hub')).toBeInTheDocument();
        expect(screen.getByText('Intelligence Center')).toBeInTheDocument();
    });
});
