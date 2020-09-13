import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeMain from "./components/HomeMain";
import DocsMain from "./components/DocsMain";
import ModelMain from "./components/ModelMain";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/docs/:path">
          <DocsMain />
        </Route>
        <Route path="/:callSign/:oid">
          <ModelMain />
        </Route>
        <Route path="/" exact>
          <HomeMain />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
