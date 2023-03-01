## Hopfield Network

This is an implementation of a **Hopfield network**, a simple model of associative memory. When given a pattern, it will recall a similar pattern from its set of memorized patterns.

A Hopfield network consists of $I$ neurons, with the value of the $i$th neuron denoted as $x_i \in \{0,1\}$.
The neurons are fully connected, and the strength of the connection between neuron $i$ and $j$ is quantified through the weight matrix $w_{ij}$.
The value of the neurons and the weight matrix determines the _state_ of the network.

The dynamics of the network are determined by the _activity rule_: each neuron updates its state according to:

$$
x_i \to x_i' = \Theta \left(\sum_{j} w_{ij}x_j\right)
$$

The idea of using this network to encode a memory is to tune the weight matrix of the network so that when it is placed in a given state, the activity rule causes the state to converge on a desired memory.
We denote the set of memories as $\{\mathbf{x}^{(n)}\}$. Then we can use the [Hebb rule](https://en.wikipedia.org/wiki/Hebbian_theory#Principles) for the weight matrix (although the weight matrix does not evolve in the course of the dynamics, unlike Hebbian learning):

$$
w_{ij} = \sum_{n}x_{i}^{(n)}x_{j}^{(n)}
$$

However, we can do better, by optimizing the weights so that the binary error function $\epsilon(w_{ij})$ is minimized:

$$
\epsilon(w_{ij}) = \sum_{i,n} x_i^{(n)} \log(y_i^{(n)}) + (1-x_i^{(n)})\log(1-y_i^{(n)})
$$

where

$$
y_{i}^{(n)} = \frac{1}{1+\exp \left(-\sum_j w_{ij}x_j^{(n)}\right)}
$$

The minimization is done in `train.ts` via gradient descent.

-----

## References

- _Information Theory, Inference, and Learning Algorithms_: http://www.inference.org.uk/itprnn/book.pdf