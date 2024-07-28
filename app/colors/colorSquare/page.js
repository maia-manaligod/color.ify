"use client"

import { useEffect, useState } from 'react';
import { generateColorImage } from '@/lib/generateImage';
import { changePlaylistCover } from '@/lib/spotify';

const SolidColor = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Generate a solid color image
    const color = '#edc44a'; // Example color
    const width = 200; // Example width
    const height = 200; // Example height
    generateColorImage(color, width, height).then((result) => {
      console.log(result)
      setImageUrl(result);
      changePlaylistCover("7rCS8HLTPrzRHRSdeevDfU", result)
    });
    
  }, []);

  return (
    <div>
      <h1>Solid Color Image</h1>
      {imageUrl}
      {imageUrl && <img src={imageUrl} alt="Solid Color" />}
    </div>
  );
};

export default SolidColor;