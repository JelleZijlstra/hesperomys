import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeMain from "./components/HomeMain";
import Docs from "./components/Docs";
import ModelMain from "./components/ModelMain";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/docs/:path">
          <Docs />
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
