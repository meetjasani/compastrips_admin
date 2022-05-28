import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';
import { LastLocationProvider } from 'react-router-last-location';
import { Provider } from 'react-redux'
import store from './redux/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <LastLocationProvider>
            <Routes />
          </LastLocationProvider>
        </BrowserRouter>
      </Provider>

    </div>
  );
}

export default App;
