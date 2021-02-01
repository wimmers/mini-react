import * as ReactDOM from './Renderer.js';
import { app } from './App.js';


const rootElementName = "#container"
const rootElement = document.getElementById(rootElementName)

ReactDOM.render(app, rootElement)