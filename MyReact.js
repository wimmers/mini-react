let currentRootInstance = undefined
let rootPainter = undefined
let currentContext = undefined

const retrieveContext = () => {
    return currentContext
}

const rerender = () => {
    currentRootInstance = update(currentRootInstance, currentRootInstance.currentElement)
    const currentRenderedRoot = render(currentRootInstance)
    rootPainter(currentRenderedRoot)
}

export const useState = (initialValue) => {
    const context = retrieveContext()
    const hookIndex = context.hookIndex
    let state = context.state[hookIndex]
    if (state === undefined) {
        state = initialValue
    }
    const setState = (newValue) => {
        context.state[hookIndex] = newValue // Imperative
        rerender()
    }
    context.hookIndex++ // Imperative
    return [state, setState]
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

export const createInstance = (component) => {
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

export const render = (instance) => {
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

export const renderRoot = (node, paintRoot) => {
    rootPainter = paintRoot
    currentRootInstance = createInstance(node)
    rootPainter(render(currentRootInstance))
}