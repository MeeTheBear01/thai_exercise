import React, { useEffect, useState } from 'react';

const Score = (props: { score: number }) => {
  
  return (
    <div>
      <h5>Score {props.score}</h5>
    </div>
  )
};

export default Score;