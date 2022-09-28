import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Jujuhome from './Jujuhome';
//import reportWebVitals from './reportWebVitals';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

// if (module.hot && process.env.NODE_ENV !== 'production') {
//   module.hot.accept();
//   console.log('hot');
// }

// if ( WebGL.isWebGL2Available() === false ) {
//   document.body.appendChild( WebGL.getWebGL2ErrorMessage() );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    { WebGL ? <Jujuhome/> : <div>WebGL.getWebGL2ErrorMessage()</div> }
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);