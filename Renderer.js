// The code to actually drawing to the DOM. The "renderer" in React speak.

const createTextNode = (node) => {
    return document.createTextNode(node.props.value)
}

const createDomNode = (node) => {
    domNode = document.createElement(node.type)
    for (key in node.props) {
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
        for (child of children) {
            paint(child, domNode)
        }
    }
}

const paintRoot = (node, domRoot) => {
    domRoot.innerHTML = ''
    paint(node, domRoot)
}

const renderAppToDOM = (node, rootElement) => {
    currentDomRoot = rootElement
    currentRootInstance = createInstance(node)
    const currentRenderedRoot = render(currentRootInstance)
    paintRoot(currentRenderedRoot, rootElement)
}