import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomeMain from "./components/HomeMain";
import CanonicalRedirect from "./components/CanonicalRedirect";

import "./App.css";

const DocsMain = lazy(() => import("./components/DocsMain"));
const HomonymFinder = lazy(() => import("./components/HomonymFinder"));
const ModelMain = lazy(() => import("./components/ModelMain"));
const GamesLanding = lazy(() => import("./games/GamesLanding"));
const FamiliesByOrder = lazy(() => import("./games/FamiliesByOrder"));
const OrderByFamily = lazy(() => import("./games/OrderByFamily"));
const FamilyByGenus = lazy(() => import("./games/FamilyByGenus"));
const GeneraByFamily = lazy(() => import("./games/GeneraByFamily"));
const SpeciesByGenus = lazy(() => import("./games/SpeciesByGenus"));
const NewMain = lazy(() => import("./components/NewMain"));
const SearchMain = lazy(() => import("./components/SearchMain"));

function App() {
  return (
    <Router>
      {/* Normalize URLs to no trailing slash (except root) */}
      <CanonicalRedirect />
      <Suspense fallback={<div className="route-loading">Loading...</div>}>
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
          <Route path="/games/families-by-order">
            <FamiliesByOrder />
          </Route>
          <Route path="/games/order-by-family">
            <OrderByFamily />
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
      </Suspense>
    </Router>
  );
}

export default App;
