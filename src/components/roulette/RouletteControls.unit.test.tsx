import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RouletteControls } from './RouletteControls';

describe('RouletteControls', () => {
  it('renders nothing when hasResult is false (Req 11.6)', () => {
    const { container } = render(
      <RouletteControls
        hasResult={false}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders reset button and apply toggle when hasResult is true', () => {
    render(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('適用')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked (Req 11.3)', () => {
    const onReset = vi.fn();
    render(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={onReset}
        onToggleApply={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleApply with false when toggle is unchecked (Req 11.4)', () => {
    const onToggleApply = vi.fn();
    render(
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
    render(
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

  it('shows apply toggle as checked when isApplied is true', () => {
    render(
      <RouletteControls
        hasResult={true}
        isApplied={true}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('shows apply toggle as unchecked when isApplied is false', () => {
    render(
      <RouletteControls
        hasResult={true}
        isApplied={false}
        onReset={vi.fn()}
        onToggleApply={vi.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
