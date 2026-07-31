import { useState, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LegendGacha } from './components/legend/LegendGacha';
import { WeaponGacha } from './components/weapon/WeaponGacha';
import { RuleRoulette } from './components/roulette/RuleRoulette';
import { UserProfile } from './components/profile/UserProfile';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import styles from './App.module.css';

/** パスが /bo かどうかを判定 */
function isBOPath(): boolean {
  return window.location.pathname === '/bo' || window.location.pathname === '/bo/';
}

/** 通常ユーザー向けアプリ */
function AppContent() {
  const { legendGacha, weaponGacha } = useAppContext();
  const showSlot3 = legendGacha.partyResult?.some(l => l.hasThirdWeaponSlot) === true;
  const [showProfile, setShowProfile] = useState(false);
  const [allExecuteTrigger, setAllExecuteTrigger] = useState(0);

  const handleAllExecute = useCallback(() => {
    setAllExecuteTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Apex Gacha System</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.allExecuteButton}
            onClick={handleAllExecute}
          >
            🎲 全一括実行
          </button>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => setShowProfile(!showProfile)}
            aria-label="プロフィール設定"
            title="プロフィール設定"
          >
            👤
          </button>
        </div>
      </header>

      {/* プロフィールパネル */}
      {showProfile && (
        <div className={styles.profileOverlay} onClick={() => setShowProfile(false)}>
          <div className={styles.profilePanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.profileHeader}>
              <span className={styles.profileTitle}>プロフィール設定</span>
              <button
                type="button"
                className={styles.profileClose}
                onClick={() => setShowProfile(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.profileContent}>
              <UserProfile />
            </div>
          </div>
        </div>
      )}

      <main className={styles.content}>
        {/* Roulette at top */}
        <RuleRoulette
          legendChecks={legendGacha.checks}
          weaponSlot1Checks={weaponGacha.slot1Checks}
          weaponSlot2Checks={weaponGacha.slot2Checks}
          setLegendChecks={legendGacha.setChecks}
          setWeaponSlot1Checks={weaponGacha.setSlot1Checks}
          setWeaponSlot2Checks={weaponGacha.setSlot2Checks}
          externalTrigger={allExecuteTrigger}
        />

        {/* Legend & Weapon side by side */}
        <div className={styles.gachaRow}>
          <LegendGacha externalTrigger={allExecuteTrigger} />
          <WeaponGacha showSlot3={showSlot3} externalTrigger={allExecuteTrigger} />
        </div>
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
