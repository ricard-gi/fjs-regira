
import { useState, useContext, useEffect } from "react";

import { useNavigate, useParams } from 'react-router-dom';
import Contexte from "./Contexte";


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [titol, setTitol] = useState('');
    const [desc, setDesc] = useState('');
    const [tipus, setTipus] = useState('task');
    const [prioritat, setPrioritat] = useState('medium');
    const redirect = useNavigate();
    const { loguejat } = useContext(Contexte)
    const { projectid } = useParams()

    useEffect(() => {
        if (!loguejat) {
            redirect('/login')
        }
    }, [loguejat])


    const creaIssue = (e) => {

        e.preventDefault();

        const issue = { title: titol, desc, type: tipus, priority: prioritat }

        const options = {
            method: "POST",
            body: JSON.stringify(issue),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(API_URL + '/issues/project/' + projectid, options)
            .then(res => res.json())
            .then(data => {
                //console.log("resp", data);
                redirect('/kanban/'+projectid)
            })
            .catch(cosa => console.log(cosa))

    }

    return (



        <div className="w-full max-w-md">
            <form onSubmit={creaIssue} className="bg-white px-8 pt-6 pb-8 mb-4">
            <h1 className="">Nova isssue</h1>
            <br />

            <hr />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Titol
                    </label>
                    <input
                        onInput={(e) => setTitol(e.target.value)}
                        value={titol}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Desc
                    </label>
                    <textarea
                        onInput={(e) => setDesc(e.target.value)}
                        value={desc}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>

                <div className="border p-4 bg-blue-200 m-4">

                    <div className="radio">
                        <label>
                            <input type="radio" value="bug" name="tipus"
                                checked={tipus === 'bug'}
                                onChange={() => setTipus("bug")} />
                            Bug
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="feature" name="tipus"
                                checked={tipus === 'feature'}
                                onChange={() => setTipus("feature")} />
                            User story / Feature
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="task" name="tipus"
                                checked={tipus === 'task'}
                                onChange={() => setTipus("task")} />
                            Task
                        </label>
                    </div>
                </div>

                <div className="border p-4 bg-red-200 m-4">
                    <div className="radio">
                        <label>
                            <input type="radio" value="high" name="prioritat"
                                checked={prioritat === 'high'}
                                onChange={() => setPrioritat("high")} />
                            High
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="medium" name="prioritat"
                                checked={prioritat === 'medium'}
                                onChange={() => setPrioritat("medium")} />
                            Medium
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="low" name="prioritat"
                                checked={prioritat === 'low'}
                                onChange={() => setPrioritat("low")} />
                            Low
                        </label>
                    </div>
                </div>


                <br />
                <br />


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


