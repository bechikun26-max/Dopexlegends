import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string | null;
  visible?: boolean;
}

export function ErrorMessage({ message, visible = true }: ErrorMessageProps) {
  if (!message || !visible) {
    return null;
  }

  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon}>⚠️</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
