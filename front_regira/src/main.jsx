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
          <Route path="/projects" element={<LlistaProjectes />} />
          <Route path="/kanban/:id" element={<Kanban />} />
          <Route path="/project/new" element={<NouProjecte />} />
          <Route path="/issue/new/:projectid" element={<NouIssue />} />
          
        </Route>
      </Routes>
    </BrowserRouter>

)
