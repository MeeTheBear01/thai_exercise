'use client';
import React from 'react';

interface PowerTuneProps {
    stats: {
        hunger: number;
        energy: number;
        hygiene: number;
        strength: number;
    };
}

const PowerTune: React.FC<PowerTuneProps> = ({ stats }) => {
    const powerTubeImg = '/img/power_tube.png'; 

    return (
        <div className='power-tube-container'>
            <img src={powerTubeImg} alt="powerTube" className="power-tube-bg" />
            
            {/* 🌡️ หลอดพลังงานด้านใน (Overlay) */}
            <div className="stats-overlay">
                <div className="stat-slot">
                    <div className="bar hunger" style={{ height: `${stats.hunger}%` }}></div>
                </div>
                <div className="stat-slot">
                    <div className="bar energy" style={{ height: `${stats.energy}%` }}></div>
                </div>
                <div className="stat-slot">
                    <div className="bar hygiene" style={{ height: `${stats.hygiene}%` }}></div>
                </div>
                <div className="stat-slot">
                    <div className="bar strength" style={{ height: `${stats.strength}%` }}></div>
                </div>
            </div>
        </div>
    );
}

export default PowerTune;
