import './App.css';
import 'katex/dist/katex.min.css';

import {
  useMemo,
  useState,
} from 'react';

import {
  BlockMath,
  InlineMath,
} from 'react-katex';

import Hopfield from './Hopfield';
import Memory from './Memory';
import optimizeWeights from './train';
import {
  emptyPattern,
  Pattern,
} from './utils';

function App() {
  const width = 6
  const neurons = width * width
  const testPatternOne = Array.from({ length: neurons }, (_, i) => i % 5 == 0 ? 1 : -1)
  const testPatternTwo = Array.from({ length: neurons }, (_, i) => i % 2 == 0 ? 1 : -1)
  const [patterns, setPatterns] = useState<Pattern[]>([testPatternOne, testPatternTwo])
  const [weights, setWeights] = useState<number[][]>(Array.from({ length: width }, () => Array.from({ length: width }, () => 0)))
  const [isTrained, setIsTrained] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const maxPatterns = useMemo(() => {
    return neurons * 0.138
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
      <h1>Hopfield Network Demo</h1>
      <div style={{ width: '100%' }}>
        <div style={{ width: '80ch', textAlign: 'left', margin: 'auto' }}>
          This is an implementation of a <b>Hopfield network</b>, a simple (yet imperfect) model of associative memory.
          When given a pattern, it will recall a similar pattern from its memories.

        </div>
        <div onClick={() => setShowInstructions(false)} style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', position: 'relative' }}>
            <h2>Memories</h2>
            {showInstructions && <div style={{ border: '1px solid #646cff', padding: 10, position: 'absolute', left: '-100%', top: 100, width: 100 }}>
              Try drawing on one of the patterns, or add your own, and hit 'Train'
              </div>}
            {patterns?.map((pattern, i) => (
              <Memory pattern={pattern} key={i} onDelete={() => deletePattern(i)} onEdit={(pixel) => handleDraw(i, pixel)} />
            ))}
            {(patterns.length < maxPatterns) && <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ border: '1px solid #646cff', margin: 20, backgroundColor: '#1a1a1a', width: width * 16, height: width * 16 }}>
              <div onClick={addPattern} style={{ border: '1px solid #646cff', backgroundColor: hovered ? '#aaa' : '#1a1a1a', width: width * 16, height: width * 16, color: 'white', fontSize: '48px', cursor: 'pointer' }}>
                <div style={{ margin: 'auto' }}>+</div>
              </div>
            </div>}
            <button onClick={train}>Train</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <h2>Network</h2>
            {showInstructions && <div style={{ border: '1px solid #646cff', padding: 10, position: 'absolute', left: '120%', top: 100, width: 100 }}>
              Try drawing on the network to see if it converges to a memory
            </div>}
            <Hopfield initialState={Array.from({ length: neurons }, (x, i) => i % 4 == 0 ? 1 : -1)} weights={weights} isRunning={isRunning} />
            <button disabled={!isTrained} onClick={toggleRunning}>{isRunning ? 'Stop' : 'Start'}</button>
          </div>
        </div>
      </div>
      <div style={{ width: '80ch', textAlign: 'left', margin: '40px auto' }}>
        <details><summary>Technical Details</summary>
          <p>
            A Hopfield network consists of <InlineMath>I</InlineMath> neurons, with the value of the <InlineMath>{'i^{th}'}</InlineMath> neuron denoted as <InlineMath>{"x_i\\in\\{-1, 1\\}"}</InlineMath>.
            The neurons are fully connected, and the strength of the connection between neuron <InlineMath>i</InlineMath> and <InlineMath>j</InlineMath> is quantified through the weight matrix <InlineMath>{"w_{ij}"}</InlineMath>.
            The value of the neurons and the weight matrix determines the <i>state</i> of the network.

            The dynamics of the network are determined by the <i>activity rule</i>: each neuron updates its state according to:

            <BlockMath>
              {"x_i \\to x_i' = \\Theta \\left(\\sum_{j} w_{ij}x_j\\right)"}
            </BlockMath>

            The idea of using this network to encode a memory is to
            tune the weight matrix of the network so that when it is
            placed in a given state, the activity rule causes the
            state to converge on a desired memory.
            We denote the set of memories as <InlineMath>{"\\{\\mathbf{x}^{(n)}\\}"}</InlineMath>

            <BlockMath>
              {"w_{ij} = \\sum_{n}x_{i}^{(n)}x_{j}^{(n)}"}
            </BlockMath>

            However, we can do better, by optimizing the weights so that the binary error function <InlineMath>{"\\epsilon(w_{ij})"}</InlineMath> is minimized:

            <BlockMath>
              {"\\epsilon(w_{ij}) = \\sum_{i,n} x_i^{(n)} \\log(y_i^{(n)}) + (1-x_i^{(n)})\\log(1-y_i^{(n)})"}
            </BlockMath>

            where

            <BlockMath>
              {"y_{i}^{(n)} = \\frac{1}{1+\\exp \\left(-\\sum_j w_{ij}x_j^{(n)}\\right)}"}
            </BlockMath>

            The weights are optimized by using gradient descent as provided by <a href="https://tensorflow.org/js">TensorFlow.js</a>. <br />

            Further analysis shows that a network with <InlineMath>I</InlineMath> neurons can store approximately <InlineMath>0.138*I</InlineMath> patterns.
          </p>
        </details>
      </div>
    </div>
  )
}

export default App
