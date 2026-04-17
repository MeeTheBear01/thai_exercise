'use client';
const RepeatButton = ({ onClick }: { onClick: () => void }) => (
  <button id="repeatButton" aria-label="Play again" onClick={onClick}>
    🔁 Play Again
  </button>
);

export default RepeatButton;
