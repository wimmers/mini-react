// import './MyReact.js';

const rootElementName = "#container"
const rootElement = document.getElementById(rootElementName)

const App = (props) => {
    const greetingText = "Hi, I am a child!"
    const greeting = text(greetingText)
    // Invariant: numCounters should always be non-negative
    const [numCounters, setNumCounters] = useState(1)
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

const app = comp(
    App,
    {}
)

renderAppToDOM(app, rootElement)