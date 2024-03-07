
import { useState } from "react";

import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const [imatge, setImatge] = useState();
    const [tipus, setTipus] = useState('Comestible');
    const redirect = useNavigate();


    const creaBolet = (e) => {

        e.preventDefault();

        const data = new FormData()
        data.append('foto', imatge);
        data.append("nom", nom);
        data.append("desc", '');
        data.append("tipus", tipus);

        const options = {
            method: "POST",
            body: data,
            credentials: 'include',
        }

        fetch(API_URL + '/bolets', options)
            .then(res => res.json())
            .then(data => {
                console.log("resp", data);
                redirect('/')
            })
            .catch(cosa => console.log(cosa))

    }

    return (



        <div className="w-full max-w-md">
            <form onSubmit={creaBolet} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setNom(e.target.value)}
                        value={nom}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="Comestible" name="tipus"
                            checked={tipus === 'Comestible'}
                            onChange={() => setTipus("Comestible")} />
                        Comestible
                    </label>
                </div>
                <div className="radio">

                    <label>
                        <input type="radio" value="No Comestible" name="tipus"
                            checked={tipus === 'No Comestible'}
                            onChange={() => setTipus("No Comestible")} />
                        No Comestible
                    </label>
                </div>
                <div className="radio">

                    <label>
                        <input type="radio" value="Perillós" name="tipus"
                            checked={tipus === 'Perillós'}
                            onChange={() => setTipus("Perillós")} />
                        Perillós
                    </label>


                </div>
                <label for="formfile" className="form-label">File</label>
                <input className="form-control " id="formfile" type="file" name="file" onChange={(e) => setImatge(e.target.files[0])} />

                <div >
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Desar
                    </button>

                </div>
            </form>

        </div>

    )
}


