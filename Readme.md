# Minimal Virtual DOM Implementation

This is a minimal implementation of a virtual DOM (like React).
The implementation features a few examples and randomized testing.
My intention is too replace randomized testing by *symbolic* testing.

## Graphical Rendering

So far the setup is minimal, no server or webpacker has been configured.
However, you can use Parcel:
```
parcel index.html
```

## Testing
Run `npm test` to run the current test suite.

## Missing Configuration
A `package-lock.json` is not yet tracked because the current setup is highly experimental and
the package list is a moving target.

## Features

- Components: functions, no classes
- Hooks: only `useState`
- Events: no synthetic events like React but native DOM events
- JSX: only homebrew pre-JSX creation functions

## Roadmap

Here are some features that are currently high on my TODO list:

- TypeScript
- JSX

## Alternatives

There are much better small/minimal implementations of a React-style virtual DOM, e.g.:

- [Inferno](https://infernojs.org/)
- [Preact](https://preactjs.com/)

The long-term goal of this project would be to achieve symbolic analysis for something that
comes close to Preact.