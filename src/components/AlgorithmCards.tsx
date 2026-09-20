import { useState } from 'react';

interface AlgoInfo {
  name: string;
  short: string;
  category: 'Uninformed' | 'Informed';
  implemented: boolean;
  iconColors: string[];
  description: string;
  working: string;
  advantages: string;
  limitations: string;
  timeComplexity: string;
  spaceComplexity: string;
  completeness: string;
  optimality: string;
}

const ALGORITHMS: AlgoInfo[] = [
  {
    name: 'BFS',
    short: 'Breadth-First Search',
    category: 'Uninformed',
    implemented: true,
    iconColors: ['#194FA5', '#8FC7E5'],
    description: 'Explores all nodes at depth d before depth d+1. It is the canonical uninformed search for the shallowest goal.',
    working: 'Maintain OPEN as a FIFO queue. The start node is enqueued first. Repeatedly dequeue a node, test for the goal, and enqueue its unvisited successors. CLOSED (or a reached-set) prevents re-expansion of the same state.',
    advantages: 'Complete when the branching factor b is finite. Optimal when every action has the same positive cost, because the first time a node is reached is along a shortest path in number of steps.',
    limitations: 'The frontier stores every node at the current depth, so memory grows as O(b^d). It wastes work when a cheap deep path exists and step costs are unequal.',
    timeComplexity: 'O(b^d) — nodes generated to the shallowest solution depth d, where b is the branching factor.',
    spaceComplexity: 'O(b^d) — must store the entire frontier. This is the primary practical bottleneck.',
    completeness: 'Complete if b is finite and the graph is finite (or the solution exists at finite depth).',
    optimality: 'Optimal for equal step costs. Not optimal in general when step costs differ.',
  },
  {
    name: 'DFS',
    short: 'Depth-First Search',
    category: 'Uninformed',
    implemented: true,
    iconColors: ['#123C83', '#334D36'],
    description: 'Explores as deep as possible along each branch before backtracking. Uses a stack or recursion.',
    working: 'Maintain OPEN as a LIFO stack (or use recursion). The deepest unexplored node is always expanded next. When a dead end is reached, backtrack to the most recent unexplored branch. Duplicate detection prevents cycles.',
    advantages: 'Very low memory usage: O(bm) linear space. Reaches deep solutions quickly when the search tree is wide. Well-suited for problems where the solution is known to be deep.',
    limitations: 'Not complete in infinite or cyclic spaces without visited-state tracking. Not optimal — may find a long path before a short one. Can follow very long or infinite paths before backtracking.',
    timeComplexity: 'O(b^m) where m is the maximum search depth (can be very large or infinite in practice).',
    spaceComplexity: 'O(bm) — stores only the path from root to the current node plus unexplored siblings at each level.',
    completeness: 'Incomplete in infinite or cyclic graphs without duplicate detection. Complete on finite acyclic graphs.',
    optimality: 'Not optimal. The first solution found may not be the shallowest or cheapest.',
  },
  {
    name: 'DLS',
    short: 'Depth-Limited Search',
    category: 'Uninformed',
    implemented: true,
    iconColors: ['#194FA5', '#C7CBD0'],
    description: 'DFS with a hard depth cutoff l. No node beyond depth l is generated or expanded.',
    working: 'Acts exactly like DFS but treats any node at depth l as a leaf (even if it has successors). Returns CUTOFF if no solution is found within the limit. Returns FAILURE only if the search space below l is exhausted without finding a goal.',
    advantages: 'Memory efficient — same O(bl) linear space as DFS. Avoids infinite paths by construction. Suitable when a depth bound on the solution is known in advance.',
    limitations: 'Incomplete if the solution lies deeper than the chosen limit l. Not optimal. Selecting the right limit requires domain knowledge; too small misses solutions, too large wastes time.',
    timeComplexity: 'O(b^l) where l is the depth limit. Exponential in l but never explores below it.',
    spaceComplexity: 'O(bl) — linear in the depth limit, same asymptotic as DFS.',
    completeness: 'Incomplete if d > l (solution is below the depth limit). Complete if d ≤ l and the space is finite.',
    optimality: 'Not optimal. Returns the first solution found within the limit, which may not be shallowest.',
  },
  {
    name: 'IDDFS',
    short: 'Iterative Deepening DFS',
    category: 'Uninformed',
    implemented: true,
    iconColors: ['#194FA5', '#F3D95B', '#194FA5'],
    description: 'Runs DLS repeatedly with limits 0, 1, 2, ... until the solution is found. Combines BFS completeness with DFS memory efficiency.',
    working: 'Iteratively calls DLS with increasing depth limits starting from 0. Each iteration restarts from the root. When a deeper iteration finds the goal, the search terminates. Shallow nodes are re-expanded on every pass, but the overhead is bounded.',
    advantages: 'Complete for finite branching factor. Optimal for equal step costs. Uses O(bd) memory — same as DFS. The extra work from re-expansion is only ~1/(b-1) of total nodes — negligible for b ≥ 2.',
    limitations: 'Repeats work at every shallower depth on each new iteration. More complex to implement than plain DFS. If step costs differ, IDDFS does not guarantee an optimal solution.',
    timeComplexity: 'O(b^d) — same asymptotic as BFS, despite the repeated frontier expansions across iterations.',
    spaceComplexity: 'O(bd) — linear in depth, same as DFS. This is the key advantage over BFS.',
    completeness: 'Complete for finite branching factor and finite solution depth, with or without duplicate detection.',
    optimality: 'Optimal for equal step costs (finds shallowest solution). Not generally optimal for varying costs.',
  },
  {
    name: 'GBFS',
    short: 'Greedy Best-First Search',
    category: 'Informed',
    implemented: true,
    iconColors: ['#477F42', '#8FC7E5'],
    description: 'Expands the frontier node with the smallest heuristic estimate h(n), completely ignoring the path cost g(n).',
    working: 'Maintains a priority queue sorted by h(n) alone. The node that looks closest to the goal (by heuristic) is always expanded next. Unlike A*, GBFS does NOT use f(n) = g(n) + h(n) for ordering — only h(n). This makes it greedy but fast.',
    advantages: 'Often reaches the goal much faster than uninformed search in practice. Can quickly navigate toward the goal when the heuristic is accurate. Lower overhead per node than A* (no g accumulation needed for ordering).',
    limitations: 'Not optimal in general — may find a longer path if the heuristic is misleading. Can be misled by local minima in h(n). Not complete without duplicate detection on infinite spaces.',
    timeComplexity: 'O(b^m) in the worst case. Highly heuristic-dependent — a perfect heuristic gives O(d) performance.',
    spaceComplexity: 'O(b^m) — must maintain the full open list, which can be large for wide searches.',
    completeness: 'Complete with duplicate detection on finite state spaces. Incomplete on infinite spaces in general.',
    optimality: 'Not guaranteed optimal. Node ordering uses only h(n), so path cost is not minimized.',
  },
  {
    name: 'A*',
    short: 'A* Search',
    category: 'Informed',
    implemented: true,
    iconColors: ['#F3D95B', '#477F42'],
    description: 'Expands the node with smallest f(n) = g(n) + h(n), balancing actual path cost and heuristic estimate. The gold standard informed search.',
    working: 'Maintains a priority queue ordered by f(n) = g(n) + h(n). Each expansion picks the node whose combined cost-to-come plus estimated cost-to-go is minimal. With an admissible heuristic, A* never overestimates the remaining cost and is guaranteed to find the optimal path.',
    advantages: 'Optimal with an admissible heuristic. Complete. Generally faster than UCS because h(n) guides the search. A good heuristic dramatically reduces nodes expanded compared to blind search.',
    limitations: 'Memory-intensive: must store all generated nodes in the open/closed lists. Performance depends heavily on heuristic quality. Exponential worst-case time and space in the branching factor.',
    timeComplexity: 'Exponential in the worst case — O(b^d). In practice, heuristic accuracy determines performance; an exact h(n) yields O(d) node expansions.',
    spaceComplexity: 'O(b^d) — stores all expanded and frontier nodes. Memory is usually the binding constraint before time.',
    completeness: 'Complete for finite branching factor and admissible heuristic, assuming finite step costs > 0.',
    optimality: 'Optimal with an admissible heuristic (and consistent heuristic for graph search). This is the primary guarantee that distinguishes A* from GBFS.',
  },
];

const SECTIONS: { key: keyof AlgoInfo; label: string }[] = [
  { key: 'description',    label: 'DESCRIPTION' },
  { key: 'working',        label: 'WORKING PRINCIPLE' },
  { key: 'advantages',     label: 'ADVANTAGES' },
  { key: 'limitations',    label: 'LIMITATIONS' },
  { key: 'timeComplexity', label: 'TIME COMPLEXITY' },
  { key: 'spaceComplexity',label: 'SPACE COMPLEXITY' },
  { key: 'completeness',   label: 'COMPLETENESS' },
  { key: 'optimality',     label: 'OPTIMALITY' },
];

// ── Card in the grid ──────────────────────────────────────────────────
function AlgoCard({ algo, onOpen }: { algo: AlgoInfo; onOpen: () => void }) {
  return (
    <div style={{
      background: 'var(--cream-pixel)',
      border: '3px solid var(--blue-deep)',
      boxShadow: '4px 4px 0 var(--blue-deep)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Icon + name + description */}
      <div style={{ padding: '14px 14px 10px', flex: 1 }}>
        {/* Pixel icon squares */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {algo.iconColors.map((color, i) => (
            <div key={i} style={{
              width: 16, height: 16,
              background: color,
              border: '2px solid var(--text-dark)',
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: "'Press Start 2P'", fontSize: 8,
          color: 'var(--text-dark)', lineHeight: 1.8, marginBottom: 8,
        }}>
          {algo.short}
        </div>

        <div style={{
          fontFamily: "'VT323'", fontSize: 17,
          color: 'var(--blue-deep)', lineHeight: 1.45,
        }}>
          {algo.description}
        </div>
      </div>

      {/* Footer row: badge + OPEN FILE button */}
      <div style={{
        borderTop: '2px solid var(--gray-pixel)',
        padding: '8px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 6,
      }}>
        <span className="pixel-badge" style={{
          color: algo.category === 'Informed' ? 'var(--green-success)' : 'var(--blue-main)',
          fontSize: 6,
        }}>
          {algo.category}
        </span>
        <button
          className="pixel-btn"
          style={{ fontSize: 7, padding: '5px 10px' }}
          onClick={onOpen}
          aria-label={`Open ${algo.name} details`}
        >
          OPEN FILE
        </button>
      </div>
    </div>
  );
}

// ── .TXT file detail viewer ───────────────────────────────────────────
function AlgoDetail({ algo, onClose, onPrev, onNext }: {
  algo: AlgoInfo; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Title bar — "{ALGO}.TXT" with yellow icon */}
      <div className="pixel-titlebar" style={{ fontSize: 10, position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-block', width: 12, height: 12,
            background: 'var(--yellow)', border: '2px solid var(--text-dark)',
            flexShrink: 0,
          }} />
          <span>{algo.name}.TXT</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="pixel-titlebar-btn" onClick={onPrev} aria-label="Previous">◀</button>
          <button className="pixel-titlebar-btn" onClick={onNext} aria-label="Next">▶</button>
          <button className="pixel-titlebar-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>

      {/* File content area */}
      <div style={{
        flex: 1, padding: '16px 22px',
        overflowY: 'auto',
        background: 'var(--cream-pixel)',
      }}>
        {/* Tags row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
          {(!algo.implemented) && (
            <span className="pixel-badge" style={{ color: 'var(--gray-pixel)', borderColor: 'var(--gray-pixel)' }}>
              REFERENCE ONLY
            </span>
          )}
          {algo.implemented && (
            <span className="pixel-badge" style={{ color: 'var(--green-success)', borderColor: 'var(--green-success)' }}>
              IMPLEMENTED ✓
            </span>
          )}
          <span className="pixel-badge" style={{
            color: algo.category === 'Informed' ? 'var(--green-success)' : 'var(--blue-main)',
            borderColor: algo.category === 'Informed' ? 'var(--green-success)' : 'var(--blue-main)',
          }}>
            {algo.category}
          </span>
        </div>

        {/* Numbered sections */}
        {SECTIONS.map(({ key, label }, idx) => (
          <div key={key} style={{ marginBottom: 20 }}>
            {/* Section header: "1. DESCRIPTION" in blue */}
            <div style={{
              fontFamily: "'Press Start 2P'",
              fontSize: 8,
              color: 'var(--blue-main)',
              marginBottom: 8,
              letterSpacing: 0.5,
            }}>
              {idx + 1}. {label}
            </div>

            {/* Section body: VT323 at readable size, dark text */}
            <div style={{
              fontFamily: "'VT323'",
              fontSize: 21,
              color: 'var(--text-dark)',
              lineHeight: 1.55,
            }}>
              {algo[key] as string}
            </div>
          </div>
        ))}

        {/* Navigation footer */}
        <div style={{
          borderTop: '2px solid var(--gray-pixel)',
          paddingTop: 12, marginTop: 8,
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} onClick={onClose}>
            ← BACK TO ALL
          </button>
          <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} onClick={onPrev}>
            ◀ PREV
          </button>
          <button className="pixel-btn pixel-btn-gray" style={{ fontSize: 7 }} onClick={onNext}>
            NEXT ▶
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main AlgorithmCards page ──────────────────────────────────────────
export default function AlgorithmCards() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (selected !== null) {
    return (
      <AlgoDetail
        algo={ALGORITHMS[selected]}
        onClose={() => setSelected(null)}
        onPrev={() => setSelected(i => (i! - 1 + ALGORITHMS.length) % ALGORITHMS.length)}
        onNext={() => setSelected(i => (i! + 1) % ALGORITHMS.length)}
      />
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        fontFamily: "'VT323'", fontSize: 18,
        color: 'var(--blue-deep)', marginBottom: 14,
      }}>
        Six search algorithms. Click OPEN FILE on any card to read its documentation.
        Use ◀ ▶ inside a file to navigate between algorithms.
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: 14,
        marginBottom: 20,
      }}>
        {ALGORITHMS.map((a, i) => (
          <AlgoCard key={a.name} algo={a} onOpen={() => setSelected(i)} />
        ))}
      </div>

      <button
        className="pixel-btn pixel-btn-yellow"
        style={{ fontSize: 7, marginBottom: 12 }}
        onClick={() => setShowTable(t => !t)}
      >
        {showTable ? 'HIDE' : 'SHOW'} COMPARISON TABLE
      </button>

      {showTable && (
        <div style={{ overflowX: 'auto' }}>
          <table className="pixel-table">
            <thead>
              <tr>
                {['ALGORITHM', 'PRIORITY RULE', 'TIME', 'SPACE', 'COMPLETE', 'OPTIMAL'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['BFS',   'FIFO queue',      'O(b^d)',      'O(b^d)',  'Yes*', 'Yes (equal costs)'],
                ['DFS',   'LIFO stack',       'O(b^m)',      'O(bm)',   'No',   'No'],
                ['DLS',   'LIFO, depth ≤ l', 'O(b^l)',      'O(bl)',   'No',   'No'],
                ['IDDFS', 'Iterative DLS',    'O(b^d)',      'O(bd)',   'Yes*', 'Yes (equal costs)'],
                ['GBFS',  'Min h(n)',          'O(b^m)',      'O(b^m)', 'Yes†', 'No'],
                ['A*',    'Min f=g+h',         'Exponential','O(b^d)', 'Yes*', 'Yes (admissible h)'],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontFamily: "'VT323'", fontSize: 15, marginTop: 6, color: 'var(--gray-pixel)' }}>
            * With finite branching and visited-state tracking. † Complete on finite spaces with duplicate detection.
          </div>
        </div>
      )}
    </div>
  );
}
