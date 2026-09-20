import { useEffect } from 'react';

interface Props {
  title: string;
  message: string;
  onYes?: () => void;
  onNo?: () => void;
  yesLabel?: string;
  noLabel?: string;
  onClose?: () => void;
}

export default function PixelDialog({ title, message, onYes, onNo, yesLabel = 'YES', noLabel = 'NO', onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="pixel-dialog-overlay" onClick={onClose} />
      <div className="pixel-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="pixel-titlebar">
          <span>{title}</span>
          {onClose && (
            <button className="pixel-titlebar-btn" onClick={onClose} aria-label="Close dialog">×</button>
          )}
        </div>
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontFamily: "'VT323'", fontSize: 20, marginBottom: 16, color: 'var(--text-dark)' }}>{message}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {onYes && (
              <button className="pixel-btn pixel-btn-green" onClick={onYes}>{yesLabel}</button>
            )}
            {onNo && (
              <button className="pixel-btn pixel-btn-gray" onClick={onNo}>{noLabel}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
