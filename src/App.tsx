import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeMain from "./components/HomeMain";
import DocsMain from "./components/DocsMain";
import HomonymFinder from "./components/HomonymFinder";
import ModelMain from "./components/ModelMain";
import NewMain from "./components/NewMain";
import SearchMain from "./components/SearchMain";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/docs/*">
          <DocsMain />
        </Route>
        <Route path="/search">
          <SearchMain />
        </Route>
        <Route path="/homonym-finder">
          <HomonymFinder />
        </Route>
        <Route path="/new/:callSign">
          <NewMain />
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
