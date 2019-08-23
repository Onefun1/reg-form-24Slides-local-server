import React from "react";
import { hot } from "react-hot-loader";

import Form from "./components/Form/Form";

import "../styles/main.scss";

const App = () => {
  return (
    <div className="app">
      <Form />
    </div>
  );
};

export default hot(module)(App);
