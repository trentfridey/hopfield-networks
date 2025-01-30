import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Pattern,
  plotPattern,
} from './utils';

interface IProps {
    pattern: Pattern;
    pixelSize: number;
    width: number;
    onDraw: (index: number) => void
}

export default function Bitmap({ pattern, pixelSize, width, onDraw }: IProps) {
    const [isDrawing, setIsDrawing] = useState(false)
    const [mousePixel, setMousePixel] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
            let ctx = canvasCtxRef.current;
            plotPattern(ctx, pattern, pixelSize, width);
        }
    }, [pattern]);
    const getMousePixel = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const col = Math.floor(x / pixelSize)
        const row = Math.floor(y / pixelSize)
        return row * width + col
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setIsDrawing(() => true)
        const newMousePixel = getMousePixel(e)
        setMousePixel(() => newMousePixel)
        onDraw(newMousePixel)
    }
    const handleMouseUp = () => {
        setIsDrawing(() => false)
    }
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const newMousePixel = getMousePixel(e)
        if (isDrawing && mousePixel !== newMousePixel) {
            onDraw(newMousePixel)
        }
        setMousePixel(newMousePixel)
    }
    return (
        <canvas
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={canvasRef}
            width={pixelSize * width}
            height={pixelSize * width}
            style={{ border: "1px solid #646cff", height: pixelSize*width, width: pixelSize*width, margin: 'auto 0' }}
        />
    );
}