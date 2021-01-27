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

const MyCounter = (props) => {
    let counterText = "Counter value: undefined"
    let counterNode = div({ style: { 'margin-bottom': '1em' } }, text(counterText))
    const buttonText = "Click me"
    const btn = button(
        {},
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
    return (
        {
            type: 'div',
            props: {
                children: [
                    {
                        type: "h2",
                        props: {
                            children: [
                                greeting
                            ]
                        }
                    },
                    {
                        type: MyCounter,
                        props: {}
                    }
                ]
            }
        }
    )
}

const render = (component) => {
    if (typeof component.type === 'string') {
        // host component, proceed to children
        const children = component.props.children
        let newChildren
        if (children) {
            newChildren = children.map(render)
        } else {
            newChildren = []
        }
        props = Object.assign({}, component.props)
        props.children = newChildren
        node = Object.assign({}, component)
        node.props = props
        return node
    } else {
        // composite component, evaluate
        const newNode = component.type(component.props)
        // ... and recurse
        return render(newNode)
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
    const children = node.props.children
    if (children) {
        for (child of children) {
            paint(child, domNode)
        }
    }
}

const app = comp(
    App,
    {}
)

const vDom = render(app)

paint(vDom, rootElement)