import './App.css'
import { Outlet, Link } from "react-router-dom";
import Contexte from "./Contexte";
import { useState } from 'react';

function App() {

  const [loguejat, setLoguejat] = useState(null)

  const handleLogout = () => {
    // Clear the authentication token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Set the expiration date to a past date
    window.location.href = "/login"; // Redirect to the login page
  };

  const dades = {loguejat, setLoguejat}


  return (
    <Contexte.Provider value={dades}>

      <div className="p-[50px]">

        <div className="flex justify-between mb-10">
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/" >Inici</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projects">Projectes</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/project/new">Nou Projecte</Link>
          {!loguejat && <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>}
          {loguejat && <button className="border px-4 py-2 bg-blue-700 text-white" onClick={handleLogout}>Logout {loguejat.name}</button>}

        </div>

        <div className=" p-10">
          <Outlet />
        </div>

      </div>
    </Contexte.Provider>

  )
}

export default App