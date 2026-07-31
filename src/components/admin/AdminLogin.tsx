import { useState } from 'react';
import styles from './AdminLogin.module.css';

// "Momoclo5" の SHA-256 ハッシュ
const ADMIN_PASSWORD_HASH = 'd1b6f4373b9a4cd3f08525753ba3269b4d051272456ed39659b442604fb1c0ec';

/** 入力文字列のSHA-256ハッシュを計算 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    const hash = await sha256(password);

    if (hash === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem('bo-authenticated', 'true');
      onAuthenticated();
    } else {
      setError('パスワードが正しくありません');
      setPassword('');
    }
    setIsChecking(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🔒 Back Office</h2>
        <p className={styles.description}>管理者パスワードを入力してください</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className={styles.input}
            autoFocus
            disabled={isChecking}
          />
          <button type="submit" className={styles.button} disabled={isChecking}>
            {isChecking ? '確認中...' : 'ログイン'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
