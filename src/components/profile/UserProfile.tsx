import { useAppContext } from '../../context/AppContext';
import { LegendLineup } from '../legend/LegendLineup';
import styles from './UserProfile.module.css';

export function UserProfile() {
  const { profile } = useAppContext();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>プロフィール - 所持レジェンド</h2>
      <p className={styles.description}>
        所持しているレジェンドにチェックを入れてください。未所持のレジェンドはガチャ対象から除外されます。
      </p>
      <LegendLineup
        checks={profile.ownedLegends}
        onToggleLegend={profile.toggleLegend}
        onToggleClass={profile.toggleClass}
        onToggleAll={profile.toggleAll}
      />
    </div>
  );
}
