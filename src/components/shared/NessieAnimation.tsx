import { useState } from 'react';
import styles from './NessieAnimation.module.css';

export interface NessieAnimationProps {
  /** アニメーション表示中か */
  isPlaying: boolean;
  /** アニメーション完了時のコールバック */
  onAnimationEnd: () => void;
}

export function NessieAnimation({ isPlaying, onAnimationEnd }: NessieAnimationProps) {
  const [hasError, setHasError] = useState(false);

  if (!isPlaying || hasError) {
    return null;
  }

  return (
    <div className={styles.nessieContainer}>
      <img
        className={styles.nessieImage}
        src="/images/nessie.png"
        alt="Nessie"
        onAnimationEnd={onAnimationEnd}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
