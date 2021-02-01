// I got this from: https://github.com/facebook/jest/issues/5634
// Both, the DOM and the node environment are not throwing on console.assert, so I rewire it here.
console.assert = (statement, message) => {
    if (!statement) throw new Error(message);
};