import * as ReactDOM from 'react-dom/client';
import { MainApp } from 'visualizer/MainApp';

const container = document.getElementById('container');

if (!container) {
    throw new Error('Document does not contain a container.');
}

const root = ReactDOM.createRoot(container);

root.render(<MainApp />);
