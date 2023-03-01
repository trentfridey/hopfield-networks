import { useState } from 'react';

import Bitmap from './Bitmap';
import { Pattern } from './utils';

interface IProps {
  pattern: Pattern;
  onEdit: (index: number) => void
  onDelete: () => void;
}

export default function Memory({ pattern, onDelete, onEdit }: IProps) {
  const pixelSize = 16;
  const width = Math.sqrt(pattern.length);
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: hovered ? 'red' : "#1a1a1a",
          border: '1px solid #646cff',
          right: -10,
          top: -10,
          borderRadius: 50,
          color: 'white',
          cursor: 'pointer',
          lineHeight: 1,
        }}
        onClick={onDelete}
      >&times;</div>
      <Bitmap width={width} pixelSize={pixelSize} pattern={pattern} onClick={onEdit}/>
    </div>
  );
}
