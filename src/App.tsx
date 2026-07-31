import { useState, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LegendGacha } from './components/legend/LegendGacha';
import { PartyGacha } from './components/legend/PartyGacha';
import { WeaponGacha } from './components/weapon/WeaponGacha';
import { RuleRoulette } from './components/roulette/RuleRoulette';
import { UserProfile } from './components/profile/UserProfile';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import styles from './App.module.css';

type Page = 'legend' | 'weapon' | 'roulette' | 'profile';

/** パスが /bo かどうかを判定 */
function isBOPath(): boolean {
  return window.location.pathname === '/bo' || window.location.pathname === '/bo/';
}

/** 通常ユーザー向けアプリ */
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('legend');
  const { legendGacha, weaponGacha, effectiveLineup } = useAppContext();

  const showSlot3 = legendGacha.result?.hasThirdWeaponSlot === true;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Apex Gacha System</h1>
      </header>

      <nav className={styles.nav} aria-label="メインナビゲーション">
        <button
          type="button"
          onClick={() => setCurrentPage('legend')}
          className={currentPage === 'legend' ? styles.activeTab : styles.tab}
          aria-current={currentPage === 'legend' ? 'page' : undefined}
        >
          レジェンドガチャ
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage('weapon')}
          className={currentPage === 'weapon' ? styles.activeTab : styles.tab}
          aria-current={currentPage === 'weapon' ? 'page' : undefined}
        >
          武器ガチャ
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage('roulette')}
          className={currentPage === 'roulette' ? styles.activeTab : styles.tab}
          aria-current={currentPage === 'roulette' ? 'page' : undefined}
        >
          ルーレット
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage('profile')}
          className={currentPage === 'profile' ? styles.activeTab : styles.tab}
          aria-current={currentPage === 'profile' ? 'page' : undefined}
        >
          プロフィール
        </button>
      </nav>

      <main className={styles.content}>
        {currentPage === 'legend' && (
          <div>
            <LegendGacha />
            <PartyGacha
              onExecute={legendGacha.executePartyGacha}
              partyResult={legendGacha.partyResult}
              error={legendGacha.error}
              effectiveLineup={effectiveLineup}
            />
          </div>
        )}
        {currentPage === 'weapon' && <WeaponGacha showSlot3={showSlot3} />}
        {currentPage === 'roulette' && (
          <RuleRoulette
            legendChecks={legendGacha.checks}
            weaponSlot1Checks={weaponGacha.slot1Checks}
            setLegendChecks={legendGacha.setChecks}
            setWeaponSlot1Checks={weaponGacha.setSlot1Checks}
          />
        )}
        {currentPage === 'profile' && <UserProfile />}
      </main>
    </div>
  );
}

/** BO（バックオフィス）ページ */
function BOContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('bo-authenticated') === 'true'
  );

  const handleAuth = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Apex Gacha System — BO</h1>
      </header>
      <main className={styles.content}>
        {isAuthenticated ? <AdminPanel /> : <AdminLogin onAuthenticated={handleAuth} />}
      </main>
    </div>
  );
}

export default function App() {
  const isBO = isBOPath();

  return (
    <AppProvider>
      {isBO ? <BOContent /> : <AppContent />}
    </AppProvider>
  );
}
