// Utilities for creating components.

export const comp = (type, props, ...children) => {
    props.children = children
    return {
        type: type,
        props: props
    }
}

const genNode = (type) => (props, ...children) => {
    return comp(type, props, ...children)
}

export const h1 = genNode('h1')
export const h2 = genNode('h2')
export const h3 = genNode('h3')
export const h4 = genNode('h4')
export const div = genNode('div')
export const span = genNode('span')
export const button = genNode('button')

export const text = (text) => {
    return {
        type: 'text',
        props: {
            'value': text
        }
    }
}