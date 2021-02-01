import { useState } from './MyReact.js';
import { button, div, text, h3, comp } from './Util.js';

const MyCounter = (props) => {
    const [cnt, setCnt] = useState(0)

    const countUp = () => setCnt(cnt + 1)

    let counterText = `Counter value: ${cnt}`
    let counterNode = div({ style: { 'margin-bottom': '1em' } }, text(counterText))
    const buttonText = "Click me"
    const btn = button(
        {
            onclick: () => countUp(),
            className: 'btn btn-primary'
        },
        text(buttonText)
    )
    return (
        div(
            { style: { display: 'inline-block', 'margin-left': '1em' } },
            counterNode,
            btn
        )
    )
}

const row = (...children) => {
    return div(
        { className: "row" },
        ...children
    )
}

const App = (props) => {
    const greetingText = "Hi, I am a child!"
    const greeting = text(greetingText)
    // Invariant: numCounters should always be non-negative
    const [numCounters, setNumCounters] = useState(1)
    console.assert(numCounters >= 0)
    const addCounterBtn = button(
        {
            onclick: () => setNumCounters(numCounters + 1),
            className: "btn btn-success mx-1"
        },
        text("Add counter")
    )
    const removeCounterBtn = button(
        {
            onclick: () => setNumCounters(numCounters - 1),
            className: "btn btn-danger mx-1"
        },
        text("Remove counter")
    )
    const controls = div({},
        addCounterBtn,
        removeCounterBtn
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
        { style: { width: '100%' } },
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
        controls,
        h3({ className: "mt-2" }, text("Counters")),
        counterElement
    ]
    return (
        {
            type: 'div',
            props: { children }
        }
    )
}

export const app = comp(
    App,
    {}
)