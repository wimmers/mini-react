import { renderRoot } from './MyReact.js';
// The code to actually drawing to the DOM. The "renderer" in React speak.

const createTextNode = (node) => {
    return document.createTextNode(node.props.value)
}

const createDomNode = (node) => {
    const domNode = document.createElement(node.type)
    for (const key in node.props) {
        if (key === 'children') {
            continue
        } else if (key === 'style') {
            Object.assign(domNode[key], node.props[key])
        } else {
            domNode[key] = node.props[key]
        }
    }
    return domNode
}

const paint = (node, domRoot) => {
    let domNode
    if (node.type === 'text') {
        domNode = createTextNode(node)
    } else {
        domNode = createDomNode(node)
    }
    domRoot.appendChild(domNode)
    const children = node.children
    if (children) {
        for (const child of children) {
            paint(child, domNode)
        }
    }
}

const paintRoot = (node, domRoot) => {
    domRoot.innerHTML = ''
    paint(node, domRoot)
}

export const render = (node, rootElement) => {
    const painter = (currentRenderedRoot) => paintRoot(currentRenderedRoot, rootElement)
    renderRoot(node, painter)
}