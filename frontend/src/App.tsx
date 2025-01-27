import React from 'react';
import {AppRouter} from "./App.router";
import {PrimeReactProvider} from "primereact/api";
import './styles.css';
function App() {
  return (
      <PrimeReactProvider>
        <AppRouter />
    </PrimeReactProvider>
  );
}

export default App;
