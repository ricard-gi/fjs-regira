import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx'
import Inici from './Inici.jsx';
import Login from './Login.jsx';
import LlistaProjectes from './LlistaProjectes.jsx';
import Kanban from './Kanban.jsx';
import NouProjecte from './NouProjecte.jsx';
import NouIssue from './NouIssue.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/llista" element={<LlistaProjectes />} />
          <Route path="/projecte/:id" element={<Kanban />} />
          <Route path="/projecte/nou" element={<NouProjecte />} />
          <Route path="/issue/nou" element={<NouIssue />} />
          
        </Route>
      </Routes>
    </BrowserRouter>

)
