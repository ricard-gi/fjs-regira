
import { useState, useContext, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";

const API_URL = 'http://localhost:3000/api';


export default () => {

    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const [tipus, setTipus] = useState('');
    const redirect = useNavigate();
    const { loguejat } = useContext(Contexte)

    useEffect(() => {
        if (!loguejat) {
            redirect('/login')
        }
    }, [loguejat])



    const creaProjecte = (e) => {

        e.preventDefault();

        const projecte = { name:nom, desc}

        const options = {
            method: "POST",
            body: JSON.stringify(projecte),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }

        }

        fetch(API_URL + '/projects', options)
            .then(res => res.json())
            .then(data => {
                //console.log("resp", data);
                redirect('/projects')
            })
            .catch(cosa => console.log(cosa))

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

