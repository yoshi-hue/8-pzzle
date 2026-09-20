import { useState, useEffect } from 'react';
import landscapeImg from './imports/image-3.png';
import type { Board, SearchResult } from './utils/algorithms';
import {
  isValidBoard, isSolvable, generateSolvable,
  runGBFS,
} from './utils/algorithms';
import SolverSection from './components/SolverSection';
import ComparisonSection from './components/ComparisonSection';
import AlgorithmCards from './components/AlgorithmCards';
import PixelDialog from './components/PixelDialog';

export type Algorithm = 'gbfs';
export type Heuristic  = 'manhattan' | 'misplaced';
export type Section    = 'welcome' | 'solver' | 'comparison' | 'algorithms';

const DEFAULT_INITIAL: Board = [2,8,3,1,6,4,7,0,5];
const DEFAULT_GOAL: Board    = [1,2,3,8,0,4,7,6,5];


// ─── Faded pixel hills for welcome screen background ─────────────────────────
function WelcomeBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Sky tint */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #C8E4F0 0%, var(--cream) 65%)' }} />

      {/* Pixel hill SVG — stepped blocks, very faint */}
      <svg
        viewBox="0 0 800 260"
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.13 }}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        {/* Back ridge — muted blue-green */}
        <polygon fill="#5A8A70" points="
          0,260 0,190 16,190 16,174 32,174 32,158 48,158 48,142 64,142
          64,126 80,126 80,110 96,110 96,126 112,126 112,142 128,142
          128,126 144,126 144,110 160,110 160,94 176,94 176,110 192,110
          192,126 208,126 208,142 224,142 224,126 240,126 240,110 256,110
          256,94 272,94 272,78 288,78 288,94 304,94 304,110 320,110
          320,126 336,126 336,110 352,110 352,94 368,94 368,78 384,78
          384,62 400,62 400,78 416,78 416,94 432,94 432,110 448,110
          448,126 464,126 464,110 480,110 480,94 496,94 496,78 512,78
          512,94 528,94 528,110 544,110 544,126 560,126 560,142 576,142
          576,126 592,126 592,110 608,110 608,126 624,126 624,142 640,142
          640,158 656,158 656,174 672,174 672,190 688,190 688,206 704,206
          704,220 720,220 720,206 736,206 736,190 752,190 752,206 768,206
          768,220 784,220 784,240 800,240 800,260
        "/>
        {/* Front ridge — darker, taller */}
        <polygon fill="#235018" points="
          0,260 0,220 16,220 16,204 32,204 32,188 48,188 48,172 64,172
          64,156 80,156 80,140 96,140 96,124 112,124 112,108 128,108
          128,92 144,92 144,108 160,108 160,124 176,124 176,140 192,140
          192,156 208,156 208,140 224,140 224,124 240,124 240,108 256,108
          256,92 272,92 272,76 288,76 288,60 304,60 304,76 320,76
          320,92 336,92 336,76 352,76 352,60 368,60 368,44 384,44
          384,60 400,60 400,76 416,76 416,92 432,92 432,108 448,108
          448,124 464,124 464,108 480,108 480,92 496,92 496,76 512,76
          512,92 528,92 528,108 544,108 544,124 560,124 560,140 576,140
          576,156 592,156 592,172 608,172 608,188 624,188 624,204 640,204
          640,220 656,220 656,236 672,236 672,252 688,252 688,260 800,260
        "/>
        {/* Grass strip */}
        <rect x="0" y="244" width="800" height="16" fill="#3D8A3D" />
      </svg>

      {/* A handful of floating pixel stars */}
      {[
        { x:'8%',  y:'14%', s:8 }, { x:'91%', y:'11%', s:6 },
        { x:'22%', y:'7%',  s:5 }, { x:'76%', y:'19%', s:8 },
        { x:'50%', y:'5%',  s:6 }, { x:'4%',  y:'55%', s:5 },
        { x:'95%', y:'60%', s:6 }, { x:'38%', y:'3%',  s:5 },
      ].map((s, i) => (
        <div key={i} className="sparkle" style={{
          position: 'fixed', left: s.x, top: s.y,
          width: s.s, height: s.s,
          background: 'var(--yellow)', opacity: 0.18,
          pointerEvents: 'none',
          animationDelay: `${i * 0.22}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Very quiet background for non-welcome sections ──────────────────────────
function SectionBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Faint mountain silhouette pinned to bottom */}
      <svg
        viewBox="0 0 500 120"
        width="100%"
        height="200px"
        style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.07 }}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
      >
        <polygon
          fill="#235018"
          points="
            0,120 0,80 16,80 16,64 32,64 32,48 48,48 48,32 64,32
            64,48 80,48 80,64 96,64 96,48 112,48 112,32 128,32 128,16
            144,16 144,32 160,32 160,48 176,48 176,64 192,64 192,48
            208,48 208,32 224,32 224,16 240,16 240,0 256,0 256,16 272,16
            272,32 288,32 288,48 304,48 304,64 320,64 320,48 336,48
            336,32 352,32 352,16 368,16 368,32 384,32 384,48 400,48
            400,64 416,64 416,80 432,80 432,96 448,96 448,80 464,80
            464,64 480,64 480,80 500,80 500,120
          "
        />
        <rect x="0" y="104" width="500" height="16" fill="#3D8A3D" />
      </svg>
    </div>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: 16,
      position: 'relative', zIndex: 1,
    }}>
      <div className="pixel-window" style={{ width: '100%', maxWidth: 520, zIndex: 2 }}>

        {/* Title bar */}
        <div className="pixel-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block', width: 12, height: 12,
              background: 'var(--yellow)', border: '2px solid var(--text-dark)',
            }} />
            <span>LANDSCAPE.EXE</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span className="pixel-titlebar-btn">_</span>
            <span className="pixel-titlebar-btn" style={{ color: 'var(--red-error)' }}>✕</span>
          </div>
        </div>

        {/* Progress bar row */}
        <div style={{
          background: '#B8D8EC',
          borderBottom: '3px solid var(--blue-deep)',
          padding: '4px 8px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ flex: 1 }}>
            <div className="progress-bar-track" style={{ height: 14 }}>
              <div className="loading-bar-fill" style={{ width: loaded ? '100%' : undefined }} />
            </div>
          </div>
          <span style={{
            fontFamily: "'Press Start 2P'", fontSize: 7,
            color: 'var(--blue-deep)', whiteSpace: 'nowrap',
          }}>
            {loaded ? 'SYSTEM READY' : 'LOADING...'}
          </span>
        </div>

        {/* Landscape canvas — image cropped to remove its own window chrome.
            image-3.png is 680×618px. The file includes cream page bg (~25px top)
            + window border (3px) + titlebar (26px) + border (3px) + progress bar
            (20px) + border (3px) = ~80px of non-landscape at the top.
            80/680 = 11.8% of image width. margin-top % is relative to the
            containing block WIDTH (same axis as image scaling), so -15% is safe. */}
        <div style={{ position: 'relative', height: 370, overflow: 'hidden', background: '#7BB8D4' }}>
          <img
            src={landscapeImg}
            alt=""
            aria-hidden="true"
            style={{
              display: 'block',
              width: 'calc(100% + 1.8%)',
              height: 'auto',
              marginTop: '-15%',
              marginLeft: '-0.9%',
              imageRendering: 'pixelated',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />

          {/* START button covers the image's painted button.
              With -15% crop the button lands at ~52% of the container height. */}
          <button
            onClick={onStart}
            style={{
              position: 'absolute',
              top: '52%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: "'Press Start 2P'",
              fontSize: 20,
              letterSpacing: 6,
              padding: '20px 72px',
              background: '#1E5A1E',
              color: 'white',
              border: '4px solid white',
              outline: '5px solid #123C83',
              outlineOffset: '0px',
              boxShadow: '0 0 0 9px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              zIndex: 3,
              imageRendering: 'pixelated',
              minWidth: 240,
            }}
          >
            START
          </button>
        </div>

        {/* Bottom status bar */}
        <div style={{
          background: 'var(--blue-deep)', color: 'white',
          fontFamily: "'Press Start 2P'", fontSize: 7,
          padding: '6px 10px',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>GREEDY BEST-FIRST SEARCH</span>
          <span style={{ color: 'var(--yellow)' }}>◉ READY</span>
        </div>
      </div>

      {/* Student strip */}
      <div style={{
        marginTop: 14, textAlign: 'center',
        fontFamily: "'Press Start 2P'", fontSize: 7,
        color: 'var(--blue-main)', lineHeight: 2.3, zIndex: 2,
      }}>
        <div>Yoshita Vanapalli · 24BCE2812</div>
        <div>Artificial Intelligence · AI Search Algorithms</div>
      </div>
    </div>
  );
}

// ─── Main nav / section shell ─────────────────────────────────────────────────
const NAV: { id: Section; label: string }[] = [
  { id: 'solver',     label: 'SOLVER.EXE' },
  { id: 'comparison', label: 'COMPARE.EXE' },
  { id: 'algorithms', label: 'ALGO CARDS.EXE' },
];

const SECTION_TITLE: Record<Section, string> = {
  welcome:    'LANDSCAPE.EXE',
  solver:     'PUZZLE.EXE — Interactive Solver',
  comparison: 'COMPARE.EXE — Algorithm Comparison',
  algorithms: 'ALGORITHM CARDS.EXE',
};

export default function App() {
  const [section, setSection]       = useState<Section>('welcome');
  const [initialBoard, setInitial]  = useState<Board>(DEFAULT_INITIAL);
  const [goalBoard,    setGoal]     = useState<Board>(DEFAULT_GOAL);
  const [algorithm] = useState<Algorithm>('gbfs');
  const [heuristic,   setHeuristic] = useState<Heuristic>('manhattan');
  const [result,      setResult]    = useState<SearchResult | null>(null);
  const [running,     setRunning]   = useState(false);
  const [error,       setError]     = useState<string | null>(null);

  const handleChangeInitial = (b: Board) => { setInitial(b); setResult(null); };
  const handleChangeGoal    = (b: Board) => { setGoal(b);    setResult(null); };

  const handleRun = () => {
    if (!isValidBoard(initialBoard)) { setError('Initial board is invalid — each digit 0–8 must appear exactly once.'); return; }
    if (!isValidBoard(goalBoard))    { setError('Goal board is invalid — each digit 0–8 must appear exactly once.'); return; }
    if (!isSolvable(initialBoard, goalBoard)) {
      setError('Unsolvable puzzle — initial and goal have different inversion parity. Use "Random Puzzle" to generate a valid state.');
      return;
    }
    setRunning(true); setResult(null);
    setTimeout(() => {
      try {
        const r: SearchResult = runGBFS(initialBoard, goalBoard, heuristic);
        setResult(r);
      } catch (e) { setError('Search error: ' + String(e)); }
      setRunning(false);
    }, 30);
  };

  const handleShuffle = () => { setInitial(generateSolvable(goalBoard, 80)); setResult(null); };

  if (section === 'welcome') {
    return (
      <div className="pixel-bg-grid scanlines" style={{
        background: 'var(--cream)',
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
      }}>
        <WelcomeBg />
        <WelcomeScreen onStart={() => setSection('solver')} />
      </div>
    );
  }

  return (
    <div className="pixel-bg-grid scanlines" style={{
      background: 'var(--cream)',
      minHeight: '100vh', position: 'relative', overflowX: 'hidden',
    }}>
      <SectionBg />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          background: 'var(--blue-deep)', borderBottom: '4px solid var(--text-dark)',
          padding: '8px 16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <button onClick={() => setSection('welcome')} style={{
            fontFamily: "'Press Start 2P'", fontSize: 9, color: 'var(--yellow)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '4px 10px 4px 0', borderRight: '2px solid var(--blue-main)',
            marginRight: 8,
          }}>⌂ HOME</button>

          {NAV.map(({ id, label }) => (
            <button key={id} onClick={() => setSection(id)}
              className={section === id ? 'pixel-btn' : 'pixel-btn pixel-btn-gray'}
              style={{ fontSize: 7 }}
              aria-current={section === id ? 'page' : undefined}
            >{label}</button>
          ))}

          <div style={{ marginLeft: 'auto', fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--blue-light)' }}>
            {running ? '⏳ RUNNING...' : result ? `✓ ${result.nodesGenerated} nodes` : 'READY'}
          </div>
        </div>

        {/* Main window */}
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pixel-window" style={{ width: '100%', maxWidth: 1000, flex: 1 }}>
            <div className="pixel-titlebar" style={{ fontSize: 10 }}>
              <span>{SECTION_TITLE[section]}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="pixel-titlebar-btn" onClick={() => setSection('welcome')} style={{ cursor: 'pointer' }}>⌂</span>
                <span className="pixel-titlebar-btn" style={{ color: 'var(--yellow)' }}>◉</span>
              </div>
            </div>

            {section === 'solver' && (
              <SolverSection
                initialBoard={initialBoard} goalBoard={goalBoard}
                algorithm={algorithm} heuristic={heuristic}
                result={result} running={running}
                onChangeInitial={handleChangeInitial} onChangeGoal={handleChangeGoal}
                onShuffle={handleShuffle}
                onChangeHeuristic={(h) => { setHeuristic(h); setResult(null); }}
                onRun={handleRun}
              />
            )}
            {section === 'comparison' && (
              <ComparisonSection
                initialBoard={initialBoard} goalBoard={goalBoard} heuristic={heuristic} />
            )}
            {section === 'algorithms' && <AlgorithmCards />}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: 'var(--blue-deep)', color: 'white',
          fontFamily: "'Press Start 2P'", fontSize: 7,
          padding: '8px 16px', textAlign: 'center', lineHeight: 2.5,
          borderTop: '3px solid var(--text-dark)',
        }}>
          <span>Yoshita Vanapalli · 24BCE2812 · Artificial Intelligence</span>
        </div>
      </div>

      {error && (
        <PixelDialog title="ERROR" message={error}
          onClose={() => setError(null)} onYes={() => setError(null)} yesLabel="OK" />
      )}
    </div>
  );
}
