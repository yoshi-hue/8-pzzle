import { useState, useEffect, useRef } from 'react';
import type { Board, SearchResult, SearchNode } from '../utils/algorithms';
import { isValidBoard, isSolvable } from '../utils/algorithms';
import type { Algorithm, Heuristic } from '../App';
import PixelBoard from './PixelBoard';
import NodeInspector from './NodeInspector';

interface Props {
  initialBoard: Board;
  goalBoard: Board;
  algorithm: Algorithm;
  heuristic: Heuristic;
  result: SearchResult | null;
  running: boolean;
  onChangeInitial: (b: Board) => void;
  onChangeGoal: (b: Board) => void;
  onShuffle: () => void;
  onChangeHeuristic: (h: Heuristic) => void;
  onRun: () => void;
}

// ── Visual board grid editor ──────────────────────────────────────────
function BoardEditor({
  board, goal, label,
  onChange, onCommit, onCancel,
  error,
}: {
  board: string[];
  goal?: Board;
  label: string;
  onChange: (vals: string[]) => void;
  onCommit: () => void;
  onCancel: () => void;
  error: string | null;
}) {
  // Click-to-swap: first click selects a tile, second click swaps the two
  const [selected, setSelected] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTileClick(i: number) {
    if (selected === null) {
      setSelected(i);
    } else if (selected === i) {
      setSelected(null);
    } else {
      const next = [...board];
      [next[selected], next[i]] = [next[i], next[selected]];
      onChange(next);
      setSelected(null);
    }
  }

  // Keep a local alias so JSX below can read it as `active`
  const active = selected;

  return (
    <>
      <div className="pixel-dialog-overlay" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${label}`}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 200,
          width: 'min(400px, 92vw)',
          background: 'var(--cream-pixel)',
          border: '4px solid var(--blue-deep)',
          boxShadow: '8px 8px 0 var(--blue-deep)',
        }}
      >
        <div className="pixel-titlebar" style={{ fontSize: 10 }}>
          <span>EDIT {label}</span>
          <button className="pixel-titlebar-btn" onClick={onCancel}>×</button>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: "'VT323'", fontSize: 19, marginBottom: 14, color: 'var(--text-dark)' }}>
            Click a tile to <span style={{ color: 'var(--blue-main)', fontWeight: 'bold' }}>select</span> it, then click another to <span style={{ color: 'var(--green-success)', fontWeight: 'bold' }}>swap</span>. Each digit 0–8 must appear exactly once. 0 = blank.
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
            {board.map((val, i) => {
              const isBlank = val === '0' || val === '';
              const isActive = active === i;
              const goalMatch = goal && !isBlank && goal[i] === Number(val);
              return (
                <button
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  onClick={() => handleTileClick(i)}
                  aria-label={`Tile position ${i + 1}, current value ${val || 'blank'}`}
                  aria-pressed={isActive}
                  style={{
                    height: 72,
                    border: `4px solid ${isActive ? 'var(--yellow)' : 'var(--blue-deep)'}`,
                    background: isActive
                      ? '#FFF8D0'
                      : goalMatch
                        ? '#B8E4A0'
                        : isBlank
                          ? 'var(--cream)'
                          : 'var(--blue-light)',
                    color: 'var(--blue-deep)',
                    fontFamily: "'Press Start 2P'",
                    fontSize: 22,
                    boxShadow: isActive
                      ? 'inset 0 0 0 3px var(--yellow)'
                      : 'inset -2px -2px 0 rgba(0,0,0,0.15), inset 2px 2px 0 rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.08s, background 0.08s',
                    position: 'relative',
                  }}
                >
                  {!isBlank && val}
                  {isActive && (
                    <span style={{
                      position: 'absolute', bottom: 3, right: 4,
                      fontFamily: "'Press Start 2P'", fontSize: 6, color: 'var(--yellow)',
                    }}>▋</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current values as number row */}
          <div style={{
            fontFamily: 'monospace', fontSize: 18,
            background: 'var(--blue-deep)', color: 'var(--yellow)',
            padding: '6px 12px', marginBottom: 12, letterSpacing: 4,
            border: '2px solid var(--text-dark)',
          }}>
            [{board.map(v => v || '_').join(' ')}]
          </div>

          {error && (
            <div style={{
              fontFamily: "'VT323'", fontSize: 18, color: 'var(--red-error)',
              background: '#FFF0F0', border: '2px solid var(--red-error)',
              padding: '6px 10px', marginBottom: 12,
            }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pixel-btn pixel-btn-green" style={{ fontSize: 8 }} onClick={onCommit}>
              ✓ APPLY
            </button>
            <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 8 }} onClick={onCancel}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Animated board that cycles through path steps ─────────────────────
function PuzzleAnimator({ path, goal, speed }: { path: SearchNode[]; goal: Board; speed: number }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inspecting, setInspecting] = useState<SearchNode | null>(null);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setStep(0); setPlaying(true); }, [path]);

  useEffect(() => {
    if (ref.current) clearInterval(ref.current);
    if (!playing || path.length === 0) return;
    ref.current = setInterval(() => {
      setStep(s => {
        if (s >= path.length - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, speed);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [playing, speed, path.length]);

  if (path.length === 0) return null;
  const current = path[step];
  const isGoal = step === path.length - 1;

  return (
    <>
      <div className="pixel-window">
        <div className="pixel-titlebar">PUZZLE ANIMATION — STEP {step} / {path.length - 1}</div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
            {/* Animated board */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                border: `4px solid ${isGoal ? 'var(--green-success)' : 'var(--blue-main)'}`,
                boxShadow: `6px 6px 0 ${isGoal ? 'var(--green-dark)' : 'var(--blue-deep)'}`,
                padding: 4,
                background: isGoal ? '#F0FFF0' : 'var(--cream-pixel)',
              }}>
                <PixelBoard board={current.board} goal={goal} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, margin: '10px 0 4px', color: isGoal ? 'var(--green-success)' : 'var(--blue-deep)' }}>
                {isGoal ? '🏆 GOAL REACHED!' : current.move ? `MOVE: ${current.move}` : 'INITIAL STATE'}
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--blue-main)', marginBottom: 10 }}>
                h={current.h} · g={current.g} · f={current.f}
              </div>
              <button
                className="pixel-btn"
                style={{ fontSize: 7, marginBottom: 12 }}
                onClick={() => setInspecting(current)}
              >
                🔍 INSPECT NODE #{current.id}
              </button>
            </div>

            {/* Path step list */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--blue-deep)', marginBottom: 6 }}>
                SOLUTION PATH
              </div>
              <div className="pixel-list" style={{ height: 220, padding: 4 }}>
                {path.map((n, i) => (
                  <div
                    key={n.id}
                    role="row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', textAlign: 'left',
                      background: step === i ? 'var(--blue-light)' : 'transparent',
                      border: step === i ? '2px solid var(--blue-main)' : '2px solid transparent',
                      padding: '4px 6px', marginBottom: 2,
                    }}
                  >
                    <button
                      onClick={() => { setPlaying(false); setStep(i); }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
                      }}
                      aria-pressed={step === i}
                      aria-label={`Go to step ${i}`}
                    >
                      <PixelBoard board={n.board} mini />
                      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, lineHeight: 2 }}>
                        <div style={{ color: 'var(--blue-deep)' }}>
                          {i === 0 ? 'START' : i === path.length - 1 ? '★ GOAL' : `STEP ${i}`}
                        </div>
                        <div>h={n.h} g={n.g}</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setInspecting(n)}
                      style={{
                        background: 'var(--blue-main)', color: 'white',
                        border: '2px solid var(--blue-deep)', fontFamily: "'Press Start 2P'",
                        fontSize: 6, padding: '2px 5px', cursor: 'pointer',
                      }}
                      aria-label={`Inspect node ${n.id}`}
                    >
                      INFO
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-track" style={{ margin: '10px 0' }}>
            <div className="progress-bar-fill" style={{ width: `${(step / Math.max(path.length - 1, 1)) * 100}%` }} />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} onClick={() => { setPlaying(false); setStep(0); }}>⏮</button>
            <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} disabled={step === 0} onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>◀</button>
            <button className={`pixel-btn ${playing ? 'pixel-btn-red' : 'pixel-btn-green'}`} style={{ fontSize: 7 }}
              onClick={() => { if (step >= path.length - 1) { setStep(0); setPlaying(true); } else setPlaying(p => !p); }}>
              {playing ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
            <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} disabled={step >= path.length - 1} onClick={() => { setPlaying(false); setStep(s => Math.min(path.length - 1, s + 1)); }}>▶</button>
            <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} onClick={() => { setPlaying(false); setStep(path.length - 1); }}>⏭</button>
          </div>
        </div>
      </div>

      {inspecting && (
        <NodeInspector node={inspecting} goal={goal} onClose={() => setInspecting(null)} />
      )}
    </>
  );
}

// ── Mini clickable node card ──────────────────────────────────────────
function NodeCard({ node, highlight, goal, onInspect }: { node: SearchNode; highlight?: boolean; goal: Board; onInspect: () => void }) {
  return (
    <button
      onClick={onInspect}
      title={`Click to inspect node #${node.id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', textAlign: 'left',
        border: `2px solid ${highlight ? 'var(--yellow)' : 'var(--blue-main)'}`,
        background: highlight ? '#FFF8D0' : 'var(--cream-pixel)',
        padding: '4px 6px', marginBottom: 3,
        cursor: 'pointer',
      }}
      aria-label={`Node ${node.id} — click to inspect`}
    >
      <PixelBoard board={node.board} mini />
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: 6, lineHeight: 2, color: 'var(--text-dark)', flex: 1 }}>
        <div style={{ color: 'var(--blue-deep)' }}>#{node.id}</div>
        <div>h={node.h} g={node.g} f={node.f}</div>
        <div>depth={node.depth}</div>
      </div>
      <div style={{
        fontFamily: "'Press Start 2P'", fontSize: 6,
        background: 'var(--blue-main)', color: 'white',
        padding: '3px 6px', border: '2px solid var(--blue-deep)',
        alignSelf: 'center',
      }}>
        INFO
      </div>
    </button>
  );
}

// ── Main SolverSection ────────────────────────────────────────────────
export default function SolverSection({
  initialBoard, goalBoard, algorithm, heuristic, result, running,
  onChangeInitial, onChangeGoal, onShuffle,
  onChangeHeuristic, onRun,
}: Props) {
  const [editTarget, setEditTarget] = useState<'initial' | 'goal' | null>(null);
  const [editValues, setEditValues] = useState<string[]>([]);
  const [editError,  setEditError]  = useState<string | null>(null);
  const [animSpeed,  setAnimSpeed]  = useState(600);
  const [inspecting, setInspecting] = useState<SearchNode | null>(null);

  const openEdit = (target: 'initial' | 'goal') => {
    const b = target === 'initial' ? initialBoard : goalBoard;
    setEditValues(b.map(String));
    setEditError(null);
    setEditTarget(target);
  };

  const commitEdit = () => {
    const parsed = editValues.map(Number);
    if (!isValidBoard(parsed)) { setEditError('Each digit 0–8 must appear exactly once.'); return; }
    if (editTarget === 'initial') {
      if (!isSolvable(parsed, goalBoard)) { setEditError('This state cannot reach the current goal (different inversion parity).'); return; }
      onChangeInitial(parsed);
    } else {
      if (!isSolvable(initialBoard, parsed)) { setEditError('Goal unreachable from current initial state.'); return; }
      onChangeGoal(parsed);
    }
    setEditTarget(null);
  };

  const lastNode = result?.path[result.path.length - 1] ?? null;

  return (
    <div style={{ padding: 16 }}>
      {/* ── Puzzle Input ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: 'var(--blue-deep)', marginBottom: 12 }}>
          PUZZLE INPUT
        </div>

        <div style={{ fontFamily: "'VT323'", fontSize: 18, color: 'var(--blue-main)', marginBottom: 8 }}>
          Method 1 — Click a board to edit it tile by tile:
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start', marginBottom: 16 }}>
          {/* Initial board */}
          <div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 6 }}>
              INITIAL STATE
            </div>
            <button
              onClick={() => openEdit('initial')}
              style={{ display: 'block', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="Edit initial state"
              title="Click to edit"
            >
              <div style={{ border: '3px solid var(--blue-deep)', padding: 3, background: 'var(--cream-pixel)', boxShadow: '4px 4px 0 var(--blue-deep)' }}>
                <PixelBoard board={initialBoard} goal={goalBoard} />
              </div>
            </button>
            <button className="pixel-btn" style={{ marginTop: 8, fontSize: 7, width: '100%' }} onClick={() => openEdit('initial')}>
              ✎ EDIT TILES
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', fontSize: 32, color: 'var(--blue-main)', paddingTop: 22 }}>→</div>

          {/* Goal board */}
          <div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 6 }}>
              GOAL STATE
            </div>
            <button
              onClick={() => openEdit('goal')}
              style={{ display: 'block', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="Edit goal state"
              title="Click to edit"
            >
              <div style={{ border: '3px solid var(--blue-deep)', padding: 3, background: 'var(--cream-pixel)', boxShadow: '4px 4px 0 var(--blue-deep)' }}>
                <PixelBoard board={goalBoard} />
              </div>
            </button>
            <button className="pixel-btn" style={{ marginTop: 8, fontSize: 7, width: '100%' }} onClick={() => openEdit('goal')}>
              ✎ EDIT TILES
            </button>
          </div>
        </div>

        <div style={{ fontFamily: "'VT323'", fontSize: 18, color: 'var(--blue-main)', marginBottom: 8 }}>
          Method 2 — Generate a random solvable puzzle:
        </div>
        <button className="pixel-btn pixel-btn-yellow" style={{ fontSize: 8 }} onClick={onShuffle}>
          ⚄ GENERATE RANDOM PUZZLE
        </button>
      </div>

      {/* ── Algorithm: GBFS ── */}
      <div style={{ marginBottom: 20, borderTop: '2px solid var(--blue-light)', paddingTop: 16 }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: 'var(--blue-deep)', marginBottom: 12 }}>
          ALGORITHM: GBFS
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--blue-deep)', marginBottom: 6 }}>HEURISTIC</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['manhattan', 'misplaced'] as Heuristic[]).map(h => (
              <button key={h}
                className={`pixel-btn ${heuristic === h ? '' : 'pixel-btn-gray'}`}
                style={{ fontSize: 7 }}
                onClick={() => onChangeHeuristic(h)}
                aria-pressed={heuristic === h}
              >{h === 'manhattan' ? 'MANHATTAN DIST.' : 'MISPLACED TILES'}</button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--blue-light)', border: '2px solid var(--blue-main)', padding: '8px 12px', fontFamily: "'VT323'", fontSize: 18, color: 'var(--text-dark)' }}>
          GBFS expands nodes with lowest h(n) — fast but not optimal. Using {heuristic === 'manhattan' ? 'Manhattan Distance' : 'Misplaced Tiles'}.
        </div>
      </div>

      {/* ── Run controls ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
        <button className="pixel-btn pixel-btn-green" style={{ fontSize: 10, padding: '12px 24px' }} onClick={onRun} disabled={running}>
          {running ? '⏳ SEARCHING...' : '▶ RUN SEARCH'}
        </button>
        <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 8 }} onClick={onShuffle}>↺ RESET PUZZLE</button>
      </div>
      {result?.found && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7 }}>ANIM SPEED</span>
          <select value={animSpeed} onChange={e => setAnimSpeed(Number(e.target.value))}
            style={{ fontFamily: "'Press Start 2P'", fontSize: 7, background: 'var(--blue-main)', color: 'white', border: '2px solid var(--blue-deep)', padding: '3px 6px' }}>
            <option value={1000}>SLOW</option>
            <option value={600}>MED</option>
            <option value={250}>FAST</option>
            <option value={80}>TURBO</option>
          </select>
        </div>
      )}

      {/* ── Results ── */}
      {running && (
        <div className="pixel-window" style={{ marginTop: 16 }}>
          <div className="pixel-titlebar">SEARCHING...</div>
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div className="progress-bar-track" style={{ marginBottom: 10 }}>
              <div style={{ height: '100%', background: 'var(--blue-main)', animation: 'load-fill 3s ease-out infinite' }} />
            </div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)' }}>Running algorithm...</div>
          </div>
        </div>
      )}

      {result && !running && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!result.found && (
            <div className="pixel-window">
              <div className="pixel-titlebar">RESULT</div>
              <div style={{ padding: 20, textAlign: 'center', fontFamily: "'Press Start 2P'", fontSize: 14, color: 'var(--red-error)' }}>
                ✗ NO SOLUTION FOUND
              </div>
            </div>
          )}

          {/* Animation */}
          {result.found && result.path.length > 0 && (
            <PuzzleAnimator path={result.path} goal={goalBoard} speed={animSpeed} />
          )}

          {/* ── Section 5: Search Process Visualization ── */}
          <div className="pixel-window">
            <div className="pixel-titlebar" style={{ fontSize: 9 }}>
              <span>⚙ SEARCH.EXE — Search Process Visualization</span>
            </div>
            <div style={{ padding: 16 }}>

              {/* Top metrics row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'NODES GENERATED', value: result.nodesGenerated },
                  { label: 'NODES EXPANDED',  value: result.nodesExpanded },
                  { label: 'FRONTIER SIZE',   value: result.frontier.length },
                  { label: 'EXPLORED SIZE',   value: result.explored.length },
                  { label: 'SEARCH DEPTH',    value: result.maxDepth },
                  { label: 'PATH COST',       value: result.found ? result.pathCost : 'N/A' },
                ].map(m => (
                  <div key={m.label} className="metric-card">
                    {m.label}
                    <span className="metric-value">{String(m.value)}</span>
                  </div>
                ))}
              </div>

              {/* Current (last expanded) node */}
              {lastNode && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 16 }}>
                  <div style={{ minWidth: 180 }}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 8 }}>
                      CURRENT NODE EXPANDED
                    </div>
                    <PixelBoard board={lastNode.board} goal={goalBoard} />
                    <div style={{ fontFamily: "'VT323'", fontSize: 17, lineHeight: 1.7, marginTop: 8, color: 'var(--text-dark)', background: 'var(--cream)', border: '2px solid var(--blue-light)', padding: '6px 10px' }}>
                      <div><span style={{ color: 'var(--blue-deep)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>NODE ID</span> #{lastNode.id}</div>
                      <div><span style={{ color: 'var(--blue-deep)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>DEPTH</span> {lastNode.depth}</div>
                      <div><span style={{ color: 'var(--blue-deep)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>PARENT</span> {lastNode.parentId !== null ? `#${lastNode.parentId}` : 'ROOT'}</div>
                      <div><span style={{ color: 'var(--blue-deep)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>MOVE</span> {lastNode.move ?? 'START'}</div>
                      <div style={{ borderTop: '1px solid var(--blue-light)', marginTop: 4, paddingTop: 4 }}>
                        <span style={{ color: 'var(--blue-main)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>h(n)</span> = {lastNode.h}
                      </div>
                      <div><span style={{ color: 'var(--blue-deep)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>g(n)</span> = {lastNode.g}</div>
                      <div><span style={{ color: 'var(--green-success)', fontFamily: "'Press Start 2P'", fontSize: 6 }}>f(n)</span> = {lastNode.f}</div>
                    </div>
                    <button className="pixel-btn" style={{ fontSize: 6, marginTop: 8 }} onClick={() => setInspecting(lastNode)}>
                      🔍 INSPECT NODE
                    </button>
                  </div>

                  {/* Frontier (Open List) */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 6 }}>
                      FRONTIER — OPEN LIST
                      <span style={{ marginLeft: 8, color: 'var(--yellow)', background: 'var(--blue-deep)', padding: '1px 5px', fontSize: 6 }}>
                        {result.frontier.length} nodes
                      </span>
                    </div>
                    <div className="pixel-list" style={{ height: 180, padding: 4 }}>
                      {result.frontier.length === 0
                        ? <div style={{ fontFamily: "'VT323'", fontSize: 18, color: 'var(--gray-pixel)', padding: 8 }}>Empty — goal reached</div>
                        : result.frontier.slice(0, 40).map(n => (
                          <NodeCard key={n.id} node={n} goal={goalBoard} highlight={false} onInspect={() => setInspecting(n)} />
                        ))}
                      {result.frontier.length > 40 && (
                        <div style={{ fontFamily: "'VT323'", fontSize: 16, color: 'var(--gray-pixel)', padding: '4px 8px' }}>
                          … and {result.frontier.length - 40} more nodes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explored (Closed List) */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 6 }}>
                      EXPLORED — CLOSED LIST
                      <span style={{ marginLeft: 8, color: 'var(--yellow)', background: 'var(--blue-deep)', padding: '1px 5px', fontSize: 6 }}>
                        {result.explored.length} nodes
                      </span>
                    </div>
                    <div className="pixel-list" style={{ height: 180, padding: 4 }}>
                      {result.explored.slice(-40).reverse().map(n => (
                        <NodeCard key={n.id} node={n} goal={goalBoard} highlight={n.id === lastNode.id} onInspect={() => setInspecting(n)} />
                      ))}
                      {result.explored.length > 40 && (
                        <div style={{ fontFamily: "'VT323'", fontSize: 16, color: 'var(--gray-pixel)', padding: '4px 8px' }}>
                          … {result.explored.length - 40} earlier nodes not shown
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Solution path */}
              {result.found && result.path.length > 1 && (
                <div>
                  <div style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)', marginBottom: 6 }}>
                    SOLUTION PATH — {result.path.length - 1} MOVES
                  </div>
                  <div className="pixel-list" style={{ height: 160, padding: 4 }}>
                    {result.path.map((n, i) => (
                      <NodeCard key={n.id} node={n} goal={goalBoard}
                        highlight={i === result.path.length - 1}
                        onInspect={() => setInspecting(n)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 6: Solution Summary ── */}
          <div className="pixel-window">
            <div className="pixel-titlebar" style={{ fontSize: 9 }}>
              <span>{result.found ? '✓ RESULTS.EXE — Solution Found' : '✗ RESULTS.EXE — No Solution'}</span>
            </div>
            <div style={{ padding: 16 }}>
              {/* Status banner */}
              <div style={{
                fontFamily: "'Press Start 2P'", fontSize: 13, textAlign: 'center',
                padding: '12px 0', marginBottom: 16,
                color: result.found ? 'var(--green-success)' : 'var(--red-error)',
                background: result.found ? '#E8F5E0' : '#FDECEA',
                border: `3px solid ${result.found ? 'var(--green-success)' : 'var(--red-error)'}`,
              }}>
                {result.found ? '✓ SOLUTION FOUND' : '✗ NO SOLUTION FOUND'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10, marginBottom: 12 }}>
                {[
                  { label: 'TOTAL MOVES',      value: result.found ? result.path.length - 1 : 'N/A' },
                  { label: 'NODES GENERATED',  value: result.nodesGenerated },
                  { label: 'NODES EXPANDED',   value: result.nodesExpanded },
                  { label: 'MAX SEARCH DEPTH', value: result.maxDepth },
                  { label: 'EXECUTION TIME',   value: `${result.executionTimeMs.toFixed(2)} ms` },
                  { label: 'PATH COST',        value: result.found ? result.pathCost : 'N/A' },
                  { label: 'MEMORY (APPROX)',  value: `~${(result.memoryBytes / 1024).toFixed(1)} KB` },
                  { label: 'FRONTIER FINAL',   value: result.frontier.length },
                ].map(m => (
                  <div key={m.label} className="metric-card">
                    {m.label}
                    <span className="metric-value">{String(m.value)}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "'VT323'", fontSize: 16, color: 'var(--gray-pixel)' }}>
                ℹ Memory estimate: ~200 bytes × {result.nodesGenerated} nodes generated.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Board editor modal ── */}
      {editTarget && (
        <BoardEditor
          board={editValues}
          goal={editTarget === 'initial' ? goalBoard : undefined}
          label={editTarget === 'initial' ? 'INITIAL STATE' : 'GOAL STATE'}
          onChange={setEditValues}
          onCommit={commitEdit}
          onCancel={() => setEditTarget(null)}
          error={editError}
        />
      )}

      {/* ── Node inspector ── */}
      {inspecting && (
        <NodeInspector node={inspecting} goal={goalBoard} onClose={() => setInspecting(null)} />
      )}
    </div>
  );
}
