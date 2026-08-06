import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PartyGacha } from './PartyGacha';
import { LocaleProvider } from '../../i18n';
import type { Legend } from '../../types';

const mockLegends: Legend[] = [
  { id: 'bangalore', name: 'バンガロール', class: 'Assault', imagePath: '/images/legends/bangalore.png', hasThirdWeaponSlot: false },
  { id: 'wraith', name: 'レイス', class: 'Skirmisher', imagePath: '/images/legends/wraith.png', hasThirdWeaponSlot: false },
  { id: 'bloodhound', name: 'ブラッドハウンド', class: 'Recon', imagePath: '/images/legends/bloodhound.png', hasThirdWeaponSlot: false },
];

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe('PartyGacha', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('navigator', { language: 'ja' });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders party size selector with default of 3', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    const buttons = screen.getAllByRole('button', { pressed: true });
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('3人');
  });

  it('renders all party size options (1人, 2人, 3人)', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.getByText('1人')).toBeInTheDocument();
    expect(screen.getByText('2人')).toBeInTheDocument();
    expect(screen.getByText('3人')).toBeInTheDocument();
  });

  it('renders the execute button', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.getByText('パーティガチャ実行')).toBeInTheDocument();
  });

  it('calls onExecute with lineups and party size when button clicked', async () => {
    const onExecute = vi.fn();
    renderWithLocale(
      <PartyGacha
        onExecute={onExecute}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    fireEvent.click(screen.getByText('パーティガチャ実行'));

    // Advance past the animation duration + final setTimeout
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExecute).toHaveBeenCalledTimes(1);
    expect(onExecute).toHaveBeenCalledWith(
      [mockLegends, mockLegends, mockLegends],
      3
    );
  });

  it('changes party size when selector button is clicked', async () => {
    const onExecute = vi.fn();
    renderWithLocale(
      <PartyGacha
        onExecute={onExecute}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    fireEvent.click(screen.getByText('2人'));
    fireEvent.click(screen.getByText('パーティガチャ実行'));

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExecute).toHaveBeenCalledWith(
      [mockLegends, mockLegends],
      2
    );
  });

  it('displays party results with member labels', () => {
    const partyResult: Legend[] = [
      mockLegends[0],
      mockLegends[1],
      mockLegends[2],
    ];

    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={partyResult}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.getByText('メンバー1')).toBeInTheDocument();
    expect(screen.getByText('メンバー2')).toBeInTheDocument();
    expect(screen.getByText('メンバー3')).toBeInTheDocument();
    expect(screen.getByText('バンガロール')).toBeInTheDocument();
    expect(screen.getByText('レイス')).toBeInTheDocument();
    expect(screen.getByText('ブラッドハウンド')).toBeInTheDocument();
  });

  it('does not display results when partyResult is null', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.queryByText('メンバー1')).not.toBeInTheDocument();
    expect(screen.queryByText('パーティ結果')).not.toBeInTheDocument();
  });

  it('displays error message when error is provided', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error="選択可能なレジェンドが不足しています"
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('選択可能なレジェンドが不足しています');
  });

  it('does not display error when error is null', () => {
    renderWithLocale(
      <PartyGacha
        onExecute={vi.fn()}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('passes single-member lineup when party size is 1', async () => {
    const onExecute = vi.fn();
    renderWithLocale(
      <PartyGacha
        onExecute={onExecute}
        partyResult={null}
        error={null}
        effectiveLineup={mockLegends}
      />
    );

    fireEvent.click(screen.getByText('1人'));
    fireEvent.click(screen.getByText('パーティガチャ実行'));

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(onExecute).toHaveBeenCalledWith([mockLegends], 1);
  });
});
