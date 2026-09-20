import type { SearchNode } from '../utils/algorithms';
import PixelBoard from './PixelBoard';

interface Props {
  node: SearchNode;
  goal: number[];
  onClose: () => void;
}

const FIELD_STYLE = {
  marginBottom: 10,
  borderBottom: '1px solid var(--blue-light)',
  paddingBottom: 8,
};

export default function NodeInspector({ node, goal, onClose }: Props) {
  return (
    <>
      <div className="pixel-dialog-overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Node #${node.id} details`}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          width: 'min(580px, 94vw)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'var(--cream-pixel)',
          border: '4px solid var(--blue-deep)',
          boxShadow: '8px 8px 0 var(--blue-deep)',
        }}
      >
        {/* Title bar */}
        <div className="pixel-titlebar" style={{ fontSize: 10, position: 'sticky', top: 0 }}>
          <span>NODE #{node.id} — INSPECTOR</span>
          <button className="pixel-titlebar-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div style={{ padding: '18px 20px' }}>
          {/* Board + quick stats side by side */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 8 }}>
                BOARD STATE
              </div>
              <PixelBoard board={node.board} goal={goal} />
              <div style={{ fontFamily: "'VT323'", fontSize: 15, color: 'var(--gray-pixel)', marginTop: 6 }}>
                Green tiles = in correct goal position
              </div>
            </div>

            {/* Metric grid */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 8 }}>
                METRICS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'NODE ID',   value: `#${node.id}` },
                  { label: 'DEPTH',     value: node.depth },
                  { label: 'g(n)',      value: node.g, note: 'path cost from start' },
                  { label: 'h(n)',      value: node.h, note: 'heuristic estimate' },
                  { label: 'f(n)',      value: node.f, note: 'g + h (display only)' },
                  { label: 'PARENT',    value: node.parentId !== null ? `#${node.parentId}` : 'ROOT' },
                  { label: 'MOVE',      value: node.move ?? 'START' },
                ].map(m => (
                  <div key={m.label} style={{
                    background: 'var(--blue-deep)',
                    color: 'white',
                    padding: '8px 10px',
                    border: '2px solid var(--text-dark)',
                  }}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}>{m.label}</div>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 12, color: 'var(--yellow)', marginTop: 4 }}>
                      {String(m.value)}
                    </div>
                    {(m as any).note && (
                      <div style={{ fontFamily: "'VT323'", fontSize: 14, color: 'var(--blue-light)', marginTop: 2 }}>
                        {(m as any).note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Board as flat array */}
          <div style={FIELD_STYLE}>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--blue-deep)', marginBottom: 4 }}>
              STATE ARRAY
            </div>
            <div style={{
              fontFamily: 'monospace', fontSize: 16,
              background: 'var(--blue-deep)', color: 'var(--yellow)',
              padding: '8px 12px', border: '2px solid var(--text-dark)',
              letterSpacing: 4,
            }}>
              [{node.board.join(', ')}]
            </div>
          </div>

          {/* GBFS note */}
          <div style={{
            fontFamily: "'VT323'", fontSize: 18, color: 'var(--text-dark)',
            background: 'var(--blue-light)', border: '2px solid var(--blue-main)',
            padding: '8px 12px',
          }}>
            <strong>GBFS selection priority = h(n) only.</strong>{' '}
            f(n) = g(n) + h(n) is displayed here for reference but does NOT affect node ordering.
            This node {node.h === 0 ? 'is the goal (h=0)' : `has h=${node.h}, meaning ~${node.h} moves estimated to goal`}.
          </div>

          <button
            className="pixel-btn pixel-btn-gray"
            style={{ fontSize: 8, marginTop: 16 }}
            onClick={onClose}
          >
            ← CLOSE INSPECTOR
          </button>
        </div>
      </div>
    </>
  );
}
