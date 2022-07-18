import 'reflect-metadata';
import React from 'react';
import { render } from 'react-dom';

import App from './app';

const rootEle = document.getElementById('root');

render(React.createElement(App, {}), rootEle);
