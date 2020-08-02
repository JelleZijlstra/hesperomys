import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Name from "./components/Name";

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/n/:id">
          <Name />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
