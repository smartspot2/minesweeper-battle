import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import './index.css';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const deploymentURL = import.meta.env.VITE_CONVEX_URL;
const convex = new ConvexReactClient(deploymentURL);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);
