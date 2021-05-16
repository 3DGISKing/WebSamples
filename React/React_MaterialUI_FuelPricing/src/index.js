import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Quote from './pages/Quote';
import History from './pages/History';
import NotFound from './pages/NotFound';

const routing = (
    <BrowserRouter>
      <div>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} /> 
        <Route path="/join" component={Register} /> 
        <Route path="/profile" component={Profile} /> 
        <Route path="/quote" component={Quote} /> 
        <Route path="/history" component={History} /> 
        <Route component = {NotFound} /> 
      </Switch>  
      </div>
    </BrowserRouter>
  );

ReactDOM.render(routing, document.getElementById('root'));
