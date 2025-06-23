import React, { useEffect, useState } from 'react';

const Score = () => {
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const storedScore = localStorage.getItem("score");
    setScore(parseInt(storedScore || "0", 10));
  }, []);

  return (
    <div>
      <h5>Score {score}</h5>
    </div>
  );
};

export default Score;
