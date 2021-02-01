import * as ReactDOM from './FakeRenderer.js';
import { app } from './App.js';

const repeat = (fn, numTimes) => {
    for (const _ of Array(numTimes).keys()) {
        fn()
    }
}

test('random-3', () => {
    expect(() => repeat(() => ReactDOM.render(app, 3), 5)).not.toThrow()
}
)