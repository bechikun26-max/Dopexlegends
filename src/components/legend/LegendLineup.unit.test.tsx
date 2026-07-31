import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LegendLineup } from './LegendLineup';
import { LEGENDS } from '../../data/legends';

function createAllCheckedMap(): Map<string, boolean> {
  const checks = new Map<string, boolean>();
  for (const legend of LEGENDS) {
    checks.set(legend.id, true);
  }
  return checks;
}

describe('LegendLineup', () => {
  it('renders all 28 legends as checkboxes', () => {
    const checks = createAllCheckedMap();
    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    for (const legend of LEGENDS) {
      expect(screen.getByLabelText(legend.name)).toBeInTheDocument();
    }
  });

  it('renders class group headers', () => {
    const checks = createAllCheckedMap();
    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('アサルト')).toBeInTheDocument();
    expect(screen.getByText('スカーミッシャー')).toBeInTheDocument();
    expect(screen.getByText('リコン')).toBeInTheDocument();
    expect(screen.getByText('サポート')).toBeInTheDocument();
    expect(screen.getByText('コントローラー')).toBeInTheDocument();
  });

  it('renders select-all checkbox showing correct count', () => {
    const checks = createAllCheckedMap();
    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('全選択 (28/28)')).toBeInTheDocument();
  });

  it('calls onToggleLegend when individual checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleLegend = vi.fn();

    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={onToggleLegend}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('バンガロール'));
    expect(onToggleLegend).toHaveBeenCalledWith('bangalore');
  });

  it('calls onToggleAll when select-all checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleAll = vi.fn();

    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={onToggleAll}
      />
    );

    fireEvent.click(screen.getByLabelText('全レジェンドを選択'));
    expect(onToggleAll).toHaveBeenCalled();
  });

  it('calls onToggleClass when class group checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleClass = vi.fn();

    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={onToggleClass}
        onToggleAll={vi.fn()}
      />
    );

    const assaultCheckbox = screen.getByRole('checkbox', { name: /アサルト/ });
    fireEvent.click(assaultCheckbox);
    expect(onToggleClass).toHaveBeenCalledWith('Assault');
  });

  it('shows correct count when some legends are unchecked', () => {
    const checks = createAllCheckedMap();
    checks.set('bangalore', false);
    checks.set('wraith', false);

    render(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('全選択 (26/28)')).toBeInTheDocument();
  });
});
