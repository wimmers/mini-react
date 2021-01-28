const rootElementName = "#container"
const rootElement = document.getElementById(rootElementName)

const header = document.createElement('h1')
const header_text = document.createTextNode("Hey!")

header.appendChild(header_text)
rootElement.appendChild(header)

const comp = (type, props, ...children) => {
    props.children = children
    return {
        type: type,
        props: props
    }
}

const genNode = (type) => (props, ...children) => {
    return comp(type, props, ...children)
}

const h1 = genNode('h1')
const h2 = genNode('h2')
const h3 = genNode('h3')
const h4 = genNode('h4')
const div = genNode('div')
const span = genNode('span')
const button = genNode('button')

const text = (text) => {
    return {
        type: 'text',
        props: {
            'value': text
        }
    }
}

let currentRootInstance = undefined
let currentDomRoot = undefined
let currentContext = undefined

const retrieveContext = () => {
    return currentContext
}

const rerender = () => {
    currentRootInstance = update(currentRootInstance, currentRootInstance.currentElement)
    const currentRenderedRoot = render(currentRootInstance)
    paintRoot(currentRenderedRoot, currentDomRoot)
}

const useState = (initialValue) => {
    const context = retrieveContext()
    const hookIndex = context.hookIndex
    let state = context.state[hookIndex]
    if (!state) {
        state = initialValue
    }
    const setState = (newValue) => {
        context.state[hookIndex] = newValue // Imperative
        rerender()
    }
    context.hookIndex++ // Imperative
    return [state, setState]
}

const MyCounter = (props) => {
    const [cnt, setCnt] = useState(0)

    const countUp = () => setCnt(cnt + 1)

    let counterText = `Counter value: ${cnt}`
    let counterNode = div({ style: { 'margin-bottom': '1em' } }, text(counterText))
    const buttonText = "Click me"
    const btn = button(
        {
            onclick: () => countUp()
        },
        text(buttonText)
    )
    return (
        div(
            {},
            counterNode,
            btn
        )
    )
}

const App = (props) => {
    const greetingText = "Hi, I am a child!"
    const greeting = text(greetingText)
    // Invariant: numCounters should always be non-negative
    const [numCounters, setNumCounters] = useState(1)
    const addCounterBtn = button(
        {
            onclick: () => setNumCounters(numCounters + 1)
        },
        text("Add counter!")
    )
    const removeCounterBtn = button(
        {
            onclick: () => setNumCounters(numCounters - 1)
        },
        text("Remove counter!")
    )
    const counter = {
        type: MyCounter,
        props: {}
    }
    let counters = []
    for (let i = 0; i < numCounters; i++) {
        counters.push(counter)
    }
    const counterElement = div(
        {},
        ...counters
    )
    const children = [
        {
            type: "h2",
            props: {
                children: [
                    greeting
                ]
            }
        },
        addCounterBtn,
        removeCounterBtn,
        h3({}, text("Counters")),
        counterElement
    ]
    return (
        {
            type: 'div',
            props: { children }
        }
    )
}

const createContext = () => {
    return {
        state: [],
        hookIndex: 0
    }
}

const createCompositeInstance = (component) => {
    // Setup context
    const context = createContext()
    currentContext = context
    // Recurse on child
    const newNode = component.type(component.props)
    const instantiatedElement = createInstance(newNode)
    return {
        currentElement: component,
        instantiatedElement: instantiatedElement,
        context: context,
        type: 'composite'
    }
}

const createHostInstance = (component) => {
    const children = component.props.children
    let newChildren
    if (children) {
        newChildren = children.map(createInstance)
    } else {
        newChildren = []
    }
    return {
        currentElement: component,
        instantiatedChildren: newChildren,
        type: 'host'
    }
}

const createInstance = (component) => {
    if (typeof component.type === 'string') {
        // host component
        return createHostInstance(component)
    } else {
        // composite component
        return createCompositeInstance(component)
    }
}

const renderHost = (instance) => {
    const children = instance.instantiatedChildren.map(render)
    const component = instance.currentElement
    const props = Object.assign({}, component.props)
    delete props.children
    return {
        type: component.type,
        props: props,
        children: children
    }
}

const render = (instance) => {
    if (instance.type === 'host') {
        return renderHost(instance)
    } else if (instance.type === 'composite') {
        return render(instance.instantiatedElement)
    }
}

const updateCompositeInstance = (instance, next) => {
    // Setup context
    currentContext = instance.context
    currentContext.hookIndex = 0
    // Recurse on child
    const prevInstance = instance.instantiatedElement
    const nextElement = next.type(next.props)
    const updatedInstance = update(prevInstance, nextElement)
    return {
        ...instance,
        currentElement: next,
        instantiatedElement: updatedInstance
    }
}

// Basically the same as createHostInstance
const updateHostInstance = (instance, next) => {
    const children = next.props.children || []
    const oldInstances = instance.instantiatedChildren
    let newChildren = []
    // The "diffing" part. Compare by position and type.
    for (let i = 0; i < children.length; i++) {
        if (i >= oldInstances.length) {
            // No more child in the same position -> create new
            newChildren.push(createInstance(children[i]))
        } else {
            newChildren.push(update(oldInstances[i], children[i]))
        }
    }
    return {
        currentElement: next,
        instantiatedChildren: newChildren,
        type: 'host'
    }
}

const update = (instance, next) => {
    // Figure out whether we should update or create a new instance
    const isUpdate = instance.currentElement.type === next.type
    if (!isUpdate) {
        return createInstance(next)
    }
    if (typeof next.type === 'string') {
        // host component
        return updateHostInstance(instance, next)
    } else {
        // composite component
        return updateCompositeInstance(instance, next)
    }
}

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

const app = comp(
    App,
    {}
)

const renderAppToDOM = (node, rootElement) => {
    currentDomRoot = rootElement
    currentRootInstance = createInstance(node)
    const currentRenderedRoot = render(currentRootInstance)
    paintRoot(currentRenderedRoot, rootElement)
    console.log(currentRootInstance)
    console.log(currentRenderedRoot)
}

renderAppToDOM(app, rootElement)