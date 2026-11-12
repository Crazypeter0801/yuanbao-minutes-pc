import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss';
// transitions.dev「生成动画」运行时样式（逐字拷贝，未改动）
import './lib/transitions/ui-generation.css';
import './lib/transitions/text-image-generation.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
