import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SupplyChainRoutes from './components/SupplyChainRoutes';
import Locations from './components/Locations';
import RoutesPage from './components/RoutesPage';
import ThemeProviderWrapper from './components/ThemeProviderWrapper';



ReactDOM.render(
  <BrowserRouter>
    <ThemeProviderWrapper>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<SupplyChainRoutes />} />
          <Route path='locations/' element={<Locations />} />
          <Route path='routes' element={<RoutesPage />} />
        </Route>
      </Routes>
    </ThemeProviderWrapper>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
