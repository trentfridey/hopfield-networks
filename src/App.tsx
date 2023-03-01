import './App.css';

import {
  useMemo,
  useState,
} from 'react';

import Hopfield from './Hopfield';
import Memory from './Memory';
import optimizeWeights from './train';
import {
  emptyPattern,
  Pattern,
} from './utils';

function App() {
  const width = 5
  const neurons = width * width
  const testPatternOne = Array.from({ length: neurons }, (x, i) => i % 5 == 0 ? 1 : -1)
  const testPatternTwo = Array.from({ length: neurons }, (x, i) => i % 2 == 0 ? 1 : -1)
  const [patterns, setPatterns] = useState<Pattern[]>([testPatternOne, testPatternTwo])
  const [weights, setWeights] = useState<number[][]>(Array.from({ length: width }, () => Array.from({ length: width }, () => 0)))
  const [isTrained, setIsTrained] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  const showWarning = useMemo(() => {
    return patterns.length / neurons > 0.138
  }, [patterns])

  const addPattern = () => {
    setPatterns((patterns) => {
      return [...patterns, emptyPattern(neurons)]
    })
    setIsRunning(false)
    setIsTrained(false)
  }
  const deletePattern = (index: number) => {
    setPatterns((patterns) => patterns.filter((_, i) => i !== index))
    setIsRunning(false)
    setIsTrained(false)
  }
  const train = async () => {
    const weights = await optimizeWeights(patterns)
    setWeights(weights)
    setIsTrained(true)
  }
  const toggleRunning = () => {
    setIsRunning(state => !state)
  }
  const handleDraw = (patternIndex: number, pixel: number) => {
    if (!isRunning) {
      setPatterns(
        patterns => patterns.map(
          (pattern, patternId) => patternId === patternIndex
            ? pattern.map((bit, i) => i === pixel ? -1 * bit : bit)
            : pattern) as Pattern[])
      setIsTrained(false)
    }
  }
  

  return (
    <div>
      <div style={{ width: '100%' }}>
        <h2>Memories</h2>
        {showWarning && <h3 style={{ color: 'red'  }}>Warning! Memory is past capacity</h3>}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', margin: '40px 0' }}>
          <button onClick={train}>Train</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', width: '400px' }}>
          {patterns?.map((pattern, i) => (
            <Memory pattern={pattern} key={i} onDelete={() => deletePattern(i)} onEdit={(pixel) => handleDraw(i, pixel)} />
          ))}
          <div onMouseEnter={()=>setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ border: '1px solid #646cff', backgroundColor: '#1a1a1a', width: 5 * 16, height: 5 * 16 }}>
            <div onClick={addPattern} style={{ border: '1px solid #646cff', backgroundColor: hovered ? '#aaa' : '#1a1a1a', width: 5 * 16, height: 5 * 16, color: 'white', fontSize: '48px', cursor: 'pointer' }}>+</div>
          </div>
        </div>
      </div>
      <hr />
      <h2>Hopfield Network</h2>
      <Hopfield initialState={Array.from({ length: neurons }, (x, i) => i % 4 == 0 ? 1 : -1)} weights={weights} isRunning={isRunning} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '40px 0' }}>
        <button disabled={!isTrained} onClick={toggleRunning}>{isRunning ? 'Stop' : 'Start'}</button>
      </div>
    </div>
  )
}

export default App
