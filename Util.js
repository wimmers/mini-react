// Utilities for creating components.

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