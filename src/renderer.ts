import { ipcRenderer } from 'electron';

ipcRenderer.send('message', 'it is renderer');

import 'reflect-metadata';
import React from 'react';
import { render } from 'react-dom';

import App from './app';

const rootEle = document.getElementById('root');

render(React.createElement(App, {}), rootEle);
