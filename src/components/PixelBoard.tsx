import type { Board } from '../utils/algorithms';

interface Props {
  board: Board;
  goal?: Board;
  mini?: boolean;
  label?: string;
}

export default function PixelBoard({ board, goal, mini, label }: Props) {
  const tileClass = mini ? 'puzzle-tile-mini' : 'puzzle-tile';
  return (
    <div>
      {label && (
        <div className="text-center mb-1" style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--blue-deep)' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: mini ? 1 : 3 }}>
        {board.map((val, i) => {
          const isBlank = val === 0;
          const isMatch = goal && !isBlank && goal[i] === val;
          return (
            <div
              key={i}
              className={`${tileClass}${isBlank ? ' blank' : ''}${isMatch ? ' goal-match' : ''}`}
            >
              {isBlank ? '' : val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
