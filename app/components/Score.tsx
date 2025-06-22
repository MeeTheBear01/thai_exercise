import React, { useEffect, useState } from 'react';

const Score = () => {
  const score = localStorage.getItem("score") || 0 ;
  
  return (
    <div>
      <h5>Score {score}</h5>
    </div>
  )
};

export default Score;