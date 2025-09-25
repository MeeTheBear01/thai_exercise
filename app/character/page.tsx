'use client';

import SpritePlayer from './SpritePlayer';
import React from 'react';

export default function CharacterPage() {
    return (
        <SpritePlayer
            src="/character-walk.svg"
            frameWidth={50}
            frameHeight={64}
            frameCount={4}
            fps={6}
            loop={true}
            speed={4}
        />
    );
}
