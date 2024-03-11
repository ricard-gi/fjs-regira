import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";


export default () => {
    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const redirect = useNavigate();
    const { logout, API_URL } = useContext(Contexte)


    // funció que crea el projecte, fent FETCH a API
    const creaProjecte = (e) => {
        e.preventDefault();
        const options = {
            method: "POST",
            body: JSON.stringify({ name: nom, desc }),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(API_URL + '/projects', options)
            .then(res => res.json())
            .then(data => {
                // si rebem "unathorized" vol dir que la cookie no és vàlida o està caducada
                // en aquest cas forcem LOGOUT (perdem dades de projecte que s'anava a desar...)
                (data.error == 'Unauthorized') ? logout() : redirect('/projects');
                
                // equivalent a: if (data.error == 'Unauthorized')  logout() ; else redirect('/projects');
                // o a:
                /*
                if (data.error == 'Unauthorized') {
                    logout()
                } else {
                    redirect("/projects")
                }
                */
            })
            .catch(err => console.log(err))
    }


    return (
        <div className="w-1/2">
            <form onSubmit={creaProjecte} className="bg-white  px-8 pt-6 pb-8 mb-4">
                <h1 className="">Nou projecte</h1>
                <hr />
                <br />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setNom(e.target.value)}
                        value={nom}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Descripcio
                    </label>
                    <textarea
                        onInput={(e) => setDesc(e.target.value)}
                        value={desc}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Desc" />
                </div>
                <div >
                    <br />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Desar
                    </button>
                </div>
            </form>
        </div>
    )
}


