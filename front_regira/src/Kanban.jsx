
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [projecte, setProjecte] = useState(null);
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState('');
    const redirect = useNavigate();

    const { id } = useParams()

    const { loguejat } = useContext(Contexte)

    useEffect(() => {
        if (!loguejat) {
            redirect('/login')
        }
    }, [loguejat])


    useEffect(() => {

        const opcions = {
            credentials: 'include',
        }

        fetch(API_URL + '/projects/' + id, opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                    throw error;
                } else {
                    setProjecte(data);
                }
            })
            .then(() => fetch(API_URL + '/issues/project/' + id, opcions))
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                } else {
                    setIssues(data);
                }
            })
            .catch(err => {
                console.log(err);
                setError(err)
            })

    }, [])


    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
    }

    if (!projecte) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <h1>Projecte: {projecte?.name}</h1>
            <hr />
            <h1>Issues</h1>

            <button className="border p-3 bg-red-200" onClick={() => redirect(`/issue/new/${id}`)}>Nova issue</button>
            <br />
            <br />
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table
                                className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                                <thead
                                    className="border-b border-neutral-200 font-medium dark:border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">#</th>
                                        <th scope="col" className="px-6 py-4">Titol</th>
                                        <th scope="col" className="px-6 py-4">Descripcio</th>
                                        <th scope="col" className="px-6 py-4">Tipus</th>
                                        <th scope="col" className="px-6 py-4">Prioritat</th>
                                        <th scope="col" className="px-6 py-4">Estat</th>
                                        <th scope="col" className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {issues.map(issue =>
                                    (<tr key={issue.id} className="border-b border-neutral-200 dark:border-white/10">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{issue.id}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{issue.title}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{issue.desc}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{issue.type}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{issue.priority}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{issue.state}</td>
                                    </tr>)
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}