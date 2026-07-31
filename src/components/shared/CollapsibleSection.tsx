import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './CollapsibleSection.module.css';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggle}
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{isOpen ? '▼' : '▶'}</span> {title}
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}
