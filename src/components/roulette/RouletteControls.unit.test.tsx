import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RouletteControls } from './RouletteControls';
import { LocaleProvider } from '../../i18n';

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe('RouletteControls', () => {
  it('renders nothing when hasResult is false (Req 11.6)', () => {
    renderWithLocale(
      <RouletteControls
        hasResult={false}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders reset button and apply toggle when hasResult is true', () => {
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked (Req 11.3)', () => {
    const onReset = vi.fn();
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={onReset}
        onToggleApply={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleApply with false when toggle is unchecked (Req 11.4)', () => {
    const onToggleApply = vi.fn();
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={vi.fn()}
        onToggleApply={onToggleApply}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggleApply).toHaveBeenCalledWith(false);
  });

  it('calls onToggleApply with true when toggle is checked (Req 11.5)', () => {
    const onToggleApply = vi.fn();
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={onToggleApply}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggleApply).toHaveBeenCalledWith(true);
  });

  it('shows Unapply label when isApplied is true', () => {
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByText('Unapply')).toBeInTheDocument();
  });

  it('shows Apply label when isApplied is false', () => {
    renderWithLocale(
      <RouletteControls
        hasResult={true}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });
});
