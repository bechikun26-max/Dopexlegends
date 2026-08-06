import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LegendLineup } from './LegendLineup';
import { LEGENDS } from '../../data/legends';
import { LocaleProvider } from '../../i18n';
import en from '../../i18n/locales/en.json';

function createAllCheckedMap(): Map<string, boolean> {
  const checks = new Map<string, boolean>();
  for (const legend of LEGENDS) {
    checks.set(legend.id, true);
  }
  return checks;
}

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe('LegendLineup', () => {
  it('renders all 28 legends as checkboxes', () => {
    const checks = createAllCheckedMap();
    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    for (const legend of LEGENDS) {
      const translatedName = en[`legends.${legend.id}` as keyof typeof en];
      expect(screen.getByLabelText(translatedName)).toBeInTheDocument();
    }
  });

  it('renders class group headers', () => {
    const checks = createAllCheckedMap();
    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('Assault')).toBeInTheDocument();
    expect(screen.getByText('Skirmisher')).toBeInTheDocument();
    expect(screen.getByText('Recon')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Controller')).toBeInTheDocument();
  });

  it('renders select-all checkbox showing correct count', () => {
    const checks = createAllCheckedMap();
    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('Select All (28/28)')).toBeInTheDocument();
  });

  it('calls onToggleLegend when individual checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleLegend = vi.fn();

    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={onToggleLegend}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Bangalore'));
    expect(onToggleLegend).toHaveBeenCalledWith('bangalore');
  });

  it('calls onToggleAll when select-all checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleAll = vi.fn();

    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={onToggleAll}
      />
    );

    fireEvent.click(screen.getByLabelText('Select all legends'));
    expect(onToggleAll).toHaveBeenCalled();
  });

  it('calls onToggleClass when class group checkbox clicked', () => {
    const checks = createAllCheckedMap();
    const onToggleClass = vi.fn();

    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={onToggleClass}
        onToggleAll={vi.fn()}
      />
    );

    const assaultCheckbox = screen.getByRole('checkbox', { name: /Assault/ });
    fireEvent.click(assaultCheckbox);
    expect(onToggleClass).toHaveBeenCalledWith('Assault');
  });

  it('shows correct count when some legends are unchecked', () => {
    const checks = createAllCheckedMap();
    checks.set('bangalore', false);
    checks.set('wraith', false);

    renderWithLocale(
      <LegendLineup
        checks={checks}
        onToggleLegend={vi.fn()}
        onToggleClass={vi.fn()}
        onToggleAll={vi.fn()}
      />
    );

    expect(screen.getByText('Select All (26/28)')).toBeInTheDocument();
  });
});
