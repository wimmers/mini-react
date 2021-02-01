import { renderRoot } from './MyReact.js';

const mountEffects = (node, effects) => {
    if (node.props.onclick) {
        effects.push(node.props.onclick)
    }
}

const paint = (node, effects) => {
    mountEffects(node, effects)
    const children = node.children
    if (children) {
        for (let child of children) {
            paint(child, effects)
        }
    }
}

const paintRoot = (node, effects) => {
    console.log(node)
    effects.length = 0 // Clear effects
    paint(node, effects)
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

export const render = (node, numSteps) => {
    const effects = []
    const painter = (currentRenderedRoot) => paintRoot(currentRenderedRoot, effects)
    renderRoot(node, painter)
    console.log(effects)
    for (let i = 0; i < numSteps; i++) {
        const eventHandler = choose(effects)
        eventHandler()
    }
}