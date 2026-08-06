import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '../context';
import { AppProvider } from '../../context/AppContext';
import { LegendGacha } from '../../components/legend/LegendGacha';
import { WeaponGacha } from '../../components/weapon/WeaponGacha';

/**
 * Integration tests for localized rendering.
 * Validates: Requirements 4.4, 5.1, 5.2, 5.3, 5.4
 */

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LocaleProvider>
      <AppProvider>{ui}</AppProvider>
    </LocaleProvider>
  );
}

describe('Integration: Localized rendering', () => {
  const originalLanguage = navigator.language;

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    });
  });

  describe('English locale (en)', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });
    });

    it('LegendGacha renders title in English', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('Legend Gacha')).toBeInTheDocument();
    });

    it('LegendGacha renders button text in English', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByRole('button', { name: 'Execute Legend Gacha' })).toBeInTheDocument();
    });

    it('LegendGacha renders pick candidates label in English', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('Pick candidates:')).toBeInTheDocument();
    });

    it('LegendGacha renders lineup settings in English', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('Legend Lineup Settings')).toBeInTheDocument();
    });

    it('WeaponGacha renders title in English', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByText('Weapon Gacha')).toBeInTheDocument();
    });

    it('WeaponGacha renders button text in English', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByRole('button', { name: 'Execute All Slots Gacha' })).toBeInTheDocument();
    });

    it('WeaponGacha renders slot buttons in English', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByRole('button', { name: 'Slot 1 Gacha' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Slot 2 Gacha' })).toBeInTheDocument();
    });

    it('WeaponGacha renders lineup settings in English', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByText('Weapon Lineup Settings')).toBeInTheDocument();
    });

    it('legend names display in English from translation files', () => {
      renderWithProviders(<LegendGacha />);
      // Expand the collapsible lineup section
      fireEvent.click(screen.getByText('Legend Lineup Settings'));
      // Legend names appear as checkbox labels in the lineup
      expect(screen.getByLabelText('Bangalore')).toBeInTheDocument();
      expect(screen.getByLabelText('Wraith')).toBeInTheDocument();
      expect(screen.getByLabelText('Octane')).toBeInTheDocument();
    });

    it('weapon category names display in English', () => {
      renderWithProviders(<WeaponGacha />);
      // Expand the collapsible lineup section
      fireEvent.click(screen.getByText('Weapon Lineup Settings'));
      // Categories appear in both slots, so use getAllByText
      expect(screen.getAllByText('Shotgun').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Assault Rifle').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Japanese locale (ja)', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'ja-JP',
        configurable: true,
      });
    });

    it('LegendGacha renders title in Japanese', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('レジェンドガチャ')).toBeInTheDocument();
    });

    it('LegendGacha renders button text in Japanese', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByRole('button', { name: 'レジェンドガチャ実行' })).toBeInTheDocument();
    });

    it('LegendGacha renders pick candidates label in Japanese', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('ピック候補人数:')).toBeInTheDocument();
    });

    it('LegendGacha renders lineup settings in Japanese', () => {
      renderWithProviders(<LegendGacha />);
      expect(screen.getByText('レジェンドラインナップ設定')).toBeInTheDocument();
    });

    it('WeaponGacha renders title in Japanese', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByText('武器ガチャ')).toBeInTheDocument();
    });

    it('WeaponGacha renders button text in Japanese', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByRole('button', { name: '全スロットガチャ実行' })).toBeInTheDocument();
    });

    it('WeaponGacha renders slot buttons in Japanese', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByRole('button', { name: 'スロット1 ガチャ' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'スロット2 ガチャ' })).toBeInTheDocument();
    });

    it('WeaponGacha renders lineup settings in Japanese', () => {
      renderWithProviders(<WeaponGacha />);
      expect(screen.getByText('武器ラインナップ設定')).toBeInTheDocument();
    });

    it('legend names display in Japanese from translation files', () => {
      renderWithProviders(<LegendGacha />);
      // Expand the collapsible lineup section
      fireEvent.click(screen.getByText('レジェンドラインナップ設定'));
      // Legend names appear as checkbox labels in the lineup
      expect(screen.getByLabelText('バンガロール')).toBeInTheDocument();
      expect(screen.getByLabelText('レイス')).toBeInTheDocument();
      expect(screen.getByLabelText('オクタン')).toBeInTheDocument();
    });

    it('weapon category names display in Japanese', () => {
      renderWithProviders(<WeaponGacha />);
      // Expand the collapsible lineup section
      fireEvent.click(screen.getByText('武器ラインナップ設定'));
      // Categories appear in both slots, so use getAllByText
      expect(screen.getAllByText('ショットガン').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('アサルトライフル').length).toBeGreaterThanOrEqual(1);
    });
  });
});
