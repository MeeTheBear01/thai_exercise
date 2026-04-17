import React from 'react';

const Score = ({ score }: { score: number }) => {
  return (
    <div className="flex justify-center items-center mt-[4rem]">
      <h5 className="text-4xl font-extrabold text-center">
        🎯{" "}
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent">
          Score {score}
        </span>
      </h5>
    </div>
  );
};

export default Score;