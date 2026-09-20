// All search algorithms for the 8-Puzzle

export type Board = number[]; // 9 elements, 0 = blank

export interface SearchNode {
  id: number;
  board: Board;
  parentId: number | null;
  depth: number;
  g: number;
  h: number;
  f: number;
  move: string | null;
}

export interface SearchResult {
  found: boolean;
  path: SearchNode[];
  nodesGenerated: number;
  nodesExpanded: number;
  maxDepth: number;
  executionTimeMs: number;
  pathCost: number;
  memoryBytes: number;
  cutoff?: boolean;
  frontier: SearchNode[];   // open list at termination
  explored: SearchNode[];   // closed list (expanded nodes in order)
}

// --- Board utils ---

export function boardKey(b: Board): string { return b.join(','); }

export function isValidBoard(b: Board): boolean {
  if (b.length !== 9) return false;
  const s = [...b].sort((a, z) => a - z);
  return s.every((v, i) => v === i);
}

function countInversions(b: Board): number {
  const flat = b.filter(x => x !== 0);
  let inv = 0;
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inv++;
  return inv;
}

export function isSolvable(initial: Board, goal: Board): boolean {
  return countInversions(initial) % 2 === countInversions(goal) % 2;
}

const DIRS = [
  { dir: 'UP',    di: -1, dj:  0 },
  { dir: 'DOWN',  di:  1, dj:  0 },
  { dir: 'LEFT',  di:  0, dj: -1 },
  { dir: 'RIGHT', di:  0, dj:  1 },
];

export function getNeighbors(board: Board): { board: Board; move: string }[] {
  const bi = board.indexOf(0);
  const r = Math.floor(bi / 3), c = bi % 3;
  const result: { board: Board; move: string }[] = [];
  for (const { dir, di, dj } of DIRS) {
    const nr = r + di, nc = c + dj;
    if (nr < 0 || nr >= 3 || nc < 0 || nc >= 3) continue;
    const ti = nr * 3 + nc;
    const next = [...board] as Board;
    [next[bi], next[ti]] = [next[ti], next[bi]];
    result.push({ board: next, move: dir });
  }
  return result;
}

export function generateSolvable(goal: Board, steps = 80): Board {
  let b = [...goal] as Board;
  for (let i = 0; i < steps; i++) {
    const nbrs = getNeighbors(b);
    b = nbrs[Math.floor(Math.random() * nbrs.length)].board;
  }
  return b;
}

// --- Heuristics ---

export function manhattanDistance(board: Board, goal: Board): number {
  let d = 0;
  for (let i = 0; i < 9; i++) {
    const v = board[i];
    if (v === 0) continue;
    const gi = goal.indexOf(v);
    d += Math.abs(Math.floor(i / 3) - Math.floor(gi / 3)) + Math.abs((i % 3) - (gi % 3));
  }
  return d;
}

export function misplacedTiles(board: Board, goal: Board): number {
  let c = 0;
  for (let i = 0; i < 9; i++)
    if (board[i] !== 0 && board[i] !== goal[i]) c++;
  return c;
}

export function computeH(board: Board, goal: Board, h: 'manhattan' | 'misplaced'): number {
  return h === 'manhattan' ? manhattanDistance(board, goal) : misplacedTiles(board, goal);
}

// --- Shared node builder ---
let _nodeId = 0;
function freshNodeId() { return _nodeId++; }

function makeNode(board: Board, parentId: number | null, depth: number, move: string | null, goal: Board, heuristic: 'manhattan' | 'misplaced'): SearchNode {
  const g = depth;
  const h = computeH(board, goal, heuristic);
  return { id: freshNodeId(), board, parentId, depth, g, h, f: g + h, move };
}

function reconstructPath(node: SearchNode, nodeMap: Map<number, SearchNode>): SearchNode[] {
  const path: SearchNode[] = [];
  let cur: SearchNode | undefined = node;
  while (cur) {
    path.unshift(cur);
    cur = cur.parentId !== null ? nodeMap.get(cur.parentId) : undefined;
  }
  return path;
}

const NODE_LIMIT = 100_000;

// --- BFS ---
export function runBFS(initial: Board, goal: Board): SearchResult {
  _nodeId = 0;
  const t0 = performance.now();
  const goalKey = boardKey(goal);
  const nodeMap = new Map<number, SearchNode>();
  const dummy: SearchNode = { id: freshNodeId(), board: initial, parentId: null, depth: 0, g: 0, h: 0, f: 0, move: null };
  nodeMap.set(dummy.id, dummy);
  const queue: SearchNode[] = [dummy];
  const visited = new Set<string>([boardKey(initial)]);
  let nodesExpanded = 0, maxDepth = 0;

  while (queue.length > 0) {
    const cur = queue.shift()!;
    nodesExpanded++;
    if (cur.depth > maxDepth) maxDepth = cur.depth;
    if (boardKey(cur.board) === goalKey) {
      const path = reconstructPath(cur, nodeMap);
      return { found: true, path, nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: cur.depth, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
    }
    if (nodeMap.size >= NODE_LIMIT) break;
    for (const { board, move } of getNeighbors(cur.board)) {
      const key = boardKey(board);
      if (visited.has(key)) continue;
      visited.add(key);
      const child: SearchNode = { id: freshNodeId(), board, parentId: cur.id, depth: cur.depth + 1, g: cur.depth + 1, h: 0, f: cur.depth + 1, move };
      nodeMap.set(child.id, child);
      queue.push(child);
    }
  }
  return { found: false, path: [], nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: 0, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
}

// --- DFS ---
export function runDFS(initial: Board, goal: Board): SearchResult {
  _nodeId = 0;
  const t0 = performance.now();
  const goalKey = boardKey(goal);
  const nodeMap = new Map<number, SearchNode>();
  const root: SearchNode = { id: freshNodeId(), board: initial, parentId: null, depth: 0, g: 0, h: 0, f: 0, move: null };
  nodeMap.set(root.id, root);
  const stack: SearchNode[] = [root];
  const visited = new Set<string>([boardKey(initial)]);
  let nodesExpanded = 0, maxDepth = 0;

  while (stack.length > 0) {
    const cur = stack.pop()!;
    nodesExpanded++;
    if (cur.depth > maxDepth) maxDepth = cur.depth;
    if (boardKey(cur.board) === goalKey) {
      const path = reconstructPath(cur, nodeMap);
      return { found: true, path, nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: cur.depth, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
    }
    if (nodeMap.size >= NODE_LIMIT) break;
    for (const { board, move } of getNeighbors(cur.board)) {
      const key = boardKey(board);
      if (visited.has(key)) continue;
      visited.add(key);
      const child: SearchNode = { id: freshNodeId(), board, parentId: cur.id, depth: cur.depth + 1, g: cur.depth + 1, h: 0, f: cur.depth + 1, move };
      nodeMap.set(child.id, child);
      stack.push(child);
    }
  }
  return { found: false, path: [], nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: 0, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
}

// --- DLS ---
export function runDLS(initial: Board, goal: Board, limit: number): SearchResult {
  _nodeId = 0;
  const t0 = performance.now();
  const goalKey = boardKey(goal);
  const nodeMap = new Map<number, SearchNode>();
  const root: SearchNode = { id: freshNodeId(), board: initial, parentId: null, depth: 0, g: 0, h: 0, f: 0, move: null };
  nodeMap.set(root.id, root);
  let nodesExpanded = 0, maxDepth = 0;
  let cutoff = false;

  // Recursive DLS
  function dls(node: SearchNode, path: Set<string>): SearchNode | 'cutoff' | null {
    if (boardKey(node.board) === goalKey) return node;
    if (node.depth >= limit) { cutoff = true; return 'cutoff'; }
    nodesExpanded++;
    if (node.depth > maxDepth) maxDepth = node.depth;
    let anyCutoff = false;
    for (const { board, move } of getNeighbors(node.board)) {
      const key = boardKey(board);
      if (path.has(key)) continue;
      const child: SearchNode = { id: freshNodeId(), board, parentId: node.id, depth: node.depth + 1, g: node.depth + 1, h: 0, f: node.depth + 1, move };
      nodeMap.set(child.id, child);
      path.add(key);
      const r = dls(child, path);
      path.delete(key);
      if (r === 'cutoff') { anyCutoff = true; }
      else if (r !== null) return r;
      if (nodeMap.size >= NODE_LIMIT) return null;
    }
    return anyCutoff ? 'cutoff' : null;
  }

  const pathSet = new Set<string>([boardKey(initial)]);
  const r = dls(root, pathSet);
  const found = r !== null && r !== 'cutoff';
  const path = found ? reconstructPath(r as SearchNode, nodeMap) : [];
  return { found, path, nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: found ? (r as SearchNode).depth : 0, memoryBytes: nodeMap.size * 200, cutoff, frontier: [], explored: [] };
}

// --- IDDLS ---
export function runIDDLS(initial: Board, goal: Board): SearchResult {
  const t0 = performance.now();
  let bestResult: SearchResult | null = null;
  for (let limit = 0; limit <= 50; limit++) {
    const r = runDLS(initial, goal, limit);
    if (r.found) {
      r.executionTimeMs = performance.now() - t0;
      return r;
    }
    bestResult = r;
    if (!r.cutoff) break; // no solution exists at any depth
    if (performance.now() - t0 > 5000) break; // safety timeout
  }
  const elapsed = performance.now() - t0;
  return { ...(bestResult ?? { found: false, path: [], nodesGenerated: 0, nodesExpanded: 0, maxDepth: 0, pathCost: 0, memoryBytes: 0, frontier: [], explored: [] }), found: false, executionTimeMs: elapsed };
}

// --- GBFS ---
export function runGBFS(initial: Board, goal: Board, heuristic: 'manhattan' | 'misplaced'): SearchResult {
  _nodeId = 0;
  const t0 = performance.now();
  const goalKey = boardKey(goal);
  const nodeMap = new Map<number, SearchNode>();
  const root = makeNode(initial, null, 0, null, goal, heuristic);
  nodeMap.set(root.id, root);
  let open: SearchNode[] = [root];
  const visited = new Set<string>([boardKey(initial)]);
  const exploredList: SearchNode[] = [];
  let nodesExpanded = 0, maxDepth = 0;

  while (open.length > 0) {
    open.sort((a, b) => a.h - b.h || a.depth - b.depth || a.id - b.id);
    const cur = open.shift()!;
    nodesExpanded++;
    exploredList.push(cur);
    if (cur.depth > maxDepth) maxDepth = cur.depth;
    if (boardKey(cur.board) === goalKey) {
      return { found: true, path: reconstructPath(cur, nodeMap), nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: cur.depth, memoryBytes: nodeMap.size * 200, frontier: [...open], explored: exploredList };
    }
    if (nodeMap.size >= NODE_LIMIT) break;
    for (const { board, move } of getNeighbors(cur.board)) {
      const key = boardKey(board);
      if (visited.has(key)) continue;
      visited.add(key);
      const child = makeNode(board, cur.id, cur.depth + 1, move, goal, heuristic);
      nodeMap.set(child.id, child);
      open.push(child);
    }
  }
  return { found: false, path: [], nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: 0, memoryBytes: nodeMap.size * 200, frontier: [...open], explored: exploredList };
}

// --- A* ---
export function runAStar(initial: Board, goal: Board, heuristic: 'manhattan' | 'misplaced'): SearchResult {
  _nodeId = 0;
  const t0 = performance.now();
  const goalKey = boardKey(goal);
  const nodeMap = new Map<number, SearchNode>();
  const root = makeNode(initial, null, 0, null, goal, heuristic);
  nodeMap.set(root.id, root);
  let open: SearchNode[] = [root];
  const visited = new Set<string>([boardKey(initial)]);
  let nodesExpanded = 0, maxDepth = 0;

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f || a.h - b.h || a.id - b.id);
    const cur = open.shift()!;
    nodesExpanded++;
    if (cur.depth > maxDepth) maxDepth = cur.depth;
    if (boardKey(cur.board) === goalKey) {
      return { found: true, path: reconstructPath(cur, nodeMap), nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: cur.depth, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
    }
    if (nodeMap.size >= NODE_LIMIT) break;
    for (const { board, move } of getNeighbors(cur.board)) {
      const key = boardKey(board);
      if (visited.has(key)) continue;
      visited.add(key);
      const child = makeNode(board, cur.id, cur.depth + 1, move, goal, heuristic);
      nodeMap.set(child.id, child);
      open.push(child);
    }
  }
  return { found: false, path: [], nodesGenerated: nodeMap.size, nodesExpanded, maxDepth, executionTimeMs: performance.now() - t0, pathCost: 0, memoryBytes: nodeMap.size * 200, frontier: [], explored: [] };
}
