import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import CreatePage from './pages/CreatePage';
import RecipesPage from './pages/RecipesPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" index element={<LoginPage />} />
      <Route path="/login" index element={<LoginPage />} />
      <Route path="/cards" index element={<CardPage />} />
      <Route path="/register" index element={<RegisterPage />} />
      <Route path="/create" index element={<CreatePage />} />
      <Route path="/settings" index element={<SettingsPage />} />
      <Route path="/recipes" index element={<RecipesPage />} />
      <Route path="/home" index element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;
