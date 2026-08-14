import { useState, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LegendGacha } from './components/legend/LegendGacha';
import { WeaponGacha } from './components/weapon/WeaponGacha';
import { RuleRoulette } from './components/roulette/RuleRoulette';
import { UserProfile } from './components/profile/UserProfile';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { useNessieEasterEgg } from './hooks/useNessieEasterEgg';
import { NessieAnimation } from './components/shared/NessieAnimation';
import { useTranslation } from './i18n';
import styles from './App.module.css';


/** パスが /bo かどうかを判定 */
function isBOPath(): boolean {
  return window.location.pathname === '/bo' || window.location.pathname === '/bo/';
}

/** 通常ユーザー向けアプリ */
function AppContent() {
  const { legendGacha, weaponGacha } = useAppContext();
  const { t } = useTranslation();
  const showSlot3 = legendGacha.partyResult?.some(l => l.hasThirdWeaponSlot) === true;
  const [showProfile, setShowProfile] = useState(false);
  const [showDescription, setShowDescription] = useState(
    () => localStorage.getItem('hideDescription') !== 'true'
  );

  const toggleDescription = useCallback(() => {
    setShowDescription((prev) => {
      const next = !prev;
      localStorage.setItem('hideDescription', next ? 'false' : 'true');
      return next;
    });
  }, []);

  const { isPlaying, onAnimationEnd, animationKey } = useNessieEasterEgg(
    legendGacha.partyResult,
    weaponGacha.slot1Checks,
    weaponGacha.slot2Checks,
    weaponGacha.carePackageFlags,
    weaponGacha.slot1Result,
    weaponGacha.slot2Result,
    weaponGacha.slot3Result
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('app.title')} <span className={styles.seasonBadge}>{t('app.seasonBadge')}</span></h1>
        <button
          type="button"
          className={styles.profileButton}
          onClick={() => setShowProfile(!showProfile)}
          aria-label={t('app.profileButton')}
          title={t('app.profileButton')}
        >
          👤
        </button>
      </header>

      {/* サイト説明（トグルで非表示可能） */}
      <div className={styles.descriptionBar}>
        <button
          type="button"
          className={styles.descriptionToggle}
          onClick={toggleDescription}
          aria-expanded={showDescription}
        >
          {showDescription ? '▲' : '▼'} {t('app.descriptionToggle')}
        </button>
        {showDescription && (
          <div className={styles.descriptionContent}>
            <p className={styles.descriptionText}>{t('app.description')}</p>
            <ul className={styles.descriptionFeatures}>
              <li>{t('app.featureRoulette')}</li>
              <li>{t('app.featureLegend')}</li>
              <li>{t('app.featureWeapon')}</li>
            </ul>
          </div>
        )}
      </div>

      {/* プロフィールパネル */}
      {showProfile && (
        <div className={styles.profileOverlay} onClick={() => setShowProfile(false)}>
          <div className={styles.profilePanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.profileHeader}>
              <span className={styles.profileTitle}>{t('app.profileButton')}</span>
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
        />

        {/* Legend & Weapon side by side */}
        <div className={styles.gachaRow}>
          <LegendGacha />
          <WeaponGacha showSlot3={showSlot3} />
        </div>
      </main>

      <NessieAnimation isPlaying={isPlaying} onAnimationEnd={onAnimationEnd} key={animationKey} />
    </div>
  );
}

/** BO（バックオフィス）ページ */
function BOContent() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('bo-authenticated') === 'true'
  );

  const handleAuth = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('app.boTitle')}</h1>
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
