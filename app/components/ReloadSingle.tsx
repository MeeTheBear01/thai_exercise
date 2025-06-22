"use client";
import React, { useState } from "react";
import { RedoOutlined } from '@ant-design/icons';
import styles from "../css/ReloadSingle.module.css";

const ReloadSingle = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${styles.reloadSingle} ${!isPlaying ? styles.paused : ""}`}
        // title={isPlaying ? "Animation กำลังเล่น" : "Animation หยุด"}
      >
        <RedoOutlined />
      </div>
      <button
        onClick={togglePlay}
        className="btn btn-primary select-none"
        type="button"
      >
        {isPlaying ? "หยุด" : "เล่น"}
      </button>
    </div>
  );
};

export default ReloadSingle;
