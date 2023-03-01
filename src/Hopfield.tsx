import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  tensor,
  tensor2d,
} from '@tensorflow/tfjs';

import Bitmap from './Bitmap';
import { Pattern } from './utils';

interface IProps {
    initialState: Pattern
    weights: number[][]
    isRunning: Boolean
}

export default function Hopfield({ initialState, weights, isRunning }: IProps) {
    const pixelSize = 32 // scale up pixels to 32x32 block
    const width = Math.sqrt(initialState.length)
    const loopRef = useRef<ReturnType<typeof setTimeout>>()
    const [bitmap, setBitmap] = useState<IProps['initialState']>(initialState)
    const [key, setKey] = useState(0)

    const handleDraw = (pixel: number) => {
        setBitmap(bitmap => bitmap.map((bit, index) => index === pixel ? -1*bit : bit) as Pattern)
    }

    // update neuron state & plot pattern
    useEffect(() => {
        const update = () => {
            let newState = bitmap
            let n = 0
            while (n < newState.length) {
                const neuronUpdate = tensor2d(weights).dot(tensor(newState)).dataSync()[n]
                newState[n] = neuronUpdate > 0 ? 1 : -1
                n++
            }
            setBitmap(newState)
            setKey(key => key+1) // force re-render
            return setTimeout(() => {loopRef.current = update()}, 700)
        }
        if (isRunning) loopRef.current = update()
        else clearTimeout(loopRef.current)
        return () => clearTimeout(loopRef.current)
    }, [isRunning])
    return <Bitmap width={width} pixelSize={pixelSize} pattern={bitmap} key={key} onClick={handleDraw}/>
}

