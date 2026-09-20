import { useState } from 'react';
import type { Board, SearchResult } from '../utils/algorithms';
import { runBFS, runDFS, runDLS, runIDDLS, runGBFS, runAStar } from '../utils/algorithms';
import type { Heuristic } from '../App';

interface Props {
  initialBoard: Board;
  goalBoard: Board;
  heuristic: Heuristic;
}

interface Row {
  name: string;
  result: SearchResult | null;
  running: boolean;
}

function memLabel(bytes: number): string {
  if (bytes < 50_000)  return 'LOW';
  if (bytes < 500_000) return 'MED';
  return 'HIGH';
}

export default function ComparisonSection({ initialBoard, goalBoard, heuristic }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  const runAll = () => {
    setRunning(true);
    setRows([
      { name: 'BFS',   result: null, running: true },
      { name: 'DFS',   result: null, running: true },
      { name: 'DLS',   result: null, running: true },
      { name: 'IDDLS', result: null, running: true },
      { name: 'GBFS',  result: null, running: true },
      { name: 'A*',    result: null, running: true },
    ]);

    // Run asynchronously to not freeze UI
    setTimeout(() => {
      const results: Row[] = [
        { name: 'BFS',   result: runBFS(initialBoard, goalBoard),                    running: false },
        { name: 'DFS',   result: runDFS(initialBoard, goalBoard),                    running: false },
        { name: 'DLS',   result: runDLS(initialBoard, goalBoard, 20),                running: false },
        { name: 'IDDLS', result: runIDDLS(initialBoard, goalBoard),                  running: false },
        { name: 'GBFS',  result: runGBFS(initialBoard, goalBoard, heuristic),        running: false },
        { name: 'A*',    result: runAStar(initialBoard, goalBoard, heuristic),       running: false },
      ];
      setRows(results);
      setRunning(false);
    }, 50);
  };

  return (
    <div className="pixel-window">
      <div className="pixel-titlebar">COMPARISON.EXE — All Algorithms on Same Puzzle</div>
      <div style={{ padding: 14 }}>
        <div style={{ fontFamily: "'VT323'", fontSize: 19, color: 'var(--text-dark)', marginBottom: 12 }}>
          Runs all 6 algorithms on the current puzzle using heuristic: <strong>{heuristic === 'manhattan' ? 'Manhattan Distance' : 'Misplaced Tiles'}</strong>
          . DLS uses depth limit 20.
        </div>

        <button
          className="pixel-btn pixel-btn-green"
          style={{ fontSize: 9, marginBottom: 16 }}
          onClick={runAll}
          disabled={running}
        >
          {running ? '⏳ RUNNING ALL...' : '▶ RUN ALL ALGORITHMS'}
        </button>

        {rows.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="pixel-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  {['ALGORITHM', 'SOLUTION FOUND', 'NODES EXPANDED', 'MOVES', 'TIME', 'MEMORY'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const r = row.result;
                  return (
                    <tr key={row.name} className={row.name === 'GBFS' || row.name === 'A*' ? 'highlight' : ''}>
                      <td style={{ fontFamily: "'Press Start 2P'", fontSize: 8 }}>{row.name}</td>
                      <td style={{ color: r?.found ? 'var(--green-success)' : 'var(--red-error)', fontFamily: "'Press Start 2P'", fontSize: 8 }}>
                        {row.running ? '⏳' : r?.found ? 'YES' : 'NO'}
                      </td>
                      <td>{row.running ? '—' : r?.nodesExpanded ?? '—'}</td>
                      <td>{row.running ? '—' : r?.found ? r.path.length - 1 : '—'}</td>
                      <td>{row.running ? '—' : r ? `${r.executionTimeMs.toFixed(1)} ms` : '—'}</td>
                      <td>{row.running ? '—' : r ? memLabel(r.memoryBytes) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && !running && (
          <div style={{
            marginTop: 12, fontFamily: "'VT323'", fontSize: 17,
            color: 'var(--blue-deep)', padding: '8px 12px',
            background: 'var(--blue-light)', border: '2px solid var(--blue-main)',
          }}>
            Highlighted rows = informed search algorithms. GBFS uses h(n) priority only.
            A* uses f(n)=g(n)+h(n). DLS may not find a solution if depth limit is insufficient.
            DFS/BFS nodes may hit the 100,000-node safety limit on difficult puzzles.
          </div>
        )}
      </div>
    </div>
  );
}
