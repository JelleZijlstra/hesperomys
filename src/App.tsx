import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ModelMain from "./components/ModelMain";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:callSign/:oid">
          <ModelMain />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
