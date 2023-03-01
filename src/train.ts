import {
  diag,
  outerProduct,
  stack,
  tensor1d,
  Tensor2D,
  train,
  variable,
  zeros,
} from '@tensorflow/tfjs';

import { Pattern } from './utils';

export default function optimizeWeights(patterns: Pattern[]): Promise<number[][]> {
    // initialization via Hebb rule
    const patternsTensor = patterns.map(pattern => tensor1d(pattern))
    const nNeurons = patterns[0].length
    let initialWeights = zeros([nNeurons, nNeurons])
    for (let patternTensor of patternsTensor) {
        const outer = outerProduct(patternTensor, patternTensor)
        const diagonal = diag(patternTensor.square())
        initialWeights = initialWeights.add(outer.sub(diagonal))
    }
    const weights = variable(initialWeights)
    const learningRate = 0.2
    const optimizer = train.sgd(learningRate)
    const xs = stack(patternsTensor) as Tensor2D

    for (let i = 0; i < 100; i++) {
        optimizer.minimize(() => {
           const ys = weights.dot(xs.transpose()).sigmoid()
           const errors = xs.transpose().sub(ys)
           return errors.sum()
        })
    }

   return weights.array() as Promise<number[][]>
}