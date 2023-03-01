import {
  useEffect,
  useRef,
} from 'react';

import {
  Pattern,
  plotPattern,
} from './utils';

interface IProps {
    pattern: Pattern;
    pixelSize: number;
    width: number;
    onClick: (index: number) => void
}

export default function Bitmap({ pattern, pixelSize, width, onClick }: IProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
            let ctx = canvasCtxRef.current;
            plotPattern(ctx, pattern, pixelSize, width);
        }
    }, [pattern]);
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const col = Math.floor(x / pixelSize)
        const row = Math.floor(y / pixelSize)
        onClick(row * width + col)
    }
    return (
        <canvas
            onClick={handleClick}
            ref={canvasRef}
            width={pixelSize * width}
            height={pixelSize * width}
            style={{ border: "1px solid #646cff" }}
        />
    );
}