import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeMain from "./components/HomeMain";
import DocsMain from "./components/DocsMain";
import HomonymFinder from "./components/HomonymFinder";
import ModelMain from "./components/ModelMain";
import GamesLanding from "./games/GamesLanding";
import FamilyByGenus from "./games/FamilyByGenus";
import GeneraByFamily from "./games/GeneraByFamily";
import SpeciesByGenus from "./games/SpeciesByGenus";
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
        <Route path="/games/family-by-genus">
          <FamilyByGenus />
        </Route>
        <Route path="/games/species-by-genus">
          <SpeciesByGenus />
        </Route>
        <Route path="/games/genera-by-family">
          <GeneraByFamily />
        </Route>
        <Route path="/games" exact>
          <GamesLanding />
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
