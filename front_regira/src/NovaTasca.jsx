import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Contexte from "./Contexte";


const tasca_per_defecte = { title: '', desc: '', type: 'task', priority: 'medium' };



export default () => {

    const [issue, setIssue] = useState(tasca_per_defecte);
    const [validIssue, setValidIssue] = useState(false);

    const redirect = useNavigate();
    const { logout, API_URL } = useContext(Contexte)
    const { projectid } = useParams(); //llegim projecte on cal crear la tasca des de la url

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIssue({ ...issue, [name]: value })
    };


    const creaTasca = (e) => {
        e.preventDefault(); //evitem enviament que el browser recarregui la pàgina

        //enviem dades a la api
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
                (data.error == 'Unauthorized') ? logout() : redirect('/kanban/' + projectid);
            })
            .catch(cosa => console.log(cosa))
    }

    // validació del form
    useEffect(() => {
        if (issue.title && issue.desc) {
            setValidIssue(true)
        } else {
            setValidIssue(false)
        }
    }, [issue])



    return (
        <>

            <form className="max-w-lg mx-auto" onSubmit={creaTasca}>
                <h2 className="text-xl font-semibold mb-4">Crea Tasca</h2>

                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="block font-medium text-gray-700 mb-1">Títol</label>
                    <input
                        type="text"
                        id="title"
                        required
                        name="title"
                        value={issue.title}
                        onChange={handleInputChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="desc" className="block font-medium text-gray-700 mb-1">Descripció</label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={issue.desc}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="type" className="block font-medium text-gray-700 mb-1">Tipus</label>
                        <select
                            id="type"
                            name="type"
                            value={issue.type}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="task">Tasca</option>
                            <option value="bug">Bug</option>
                            <option value="feature">Nova funcionalitat</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block font-medium text-gray-700 mb-1">Prioritat</label>
                        <select
                            id="priority"
                            name="priority"
                            value={issue.priority}
                            onChange={handleInputChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="high">Alta</option>
                            <option value="medium">Mitja</option>
                            <option value="low">Baixa</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`bg-blue-500 ${validIssue ? 'hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'} text-white font-semibold py-2 px-4 rounded mr-2`}
                        disabled={!validIssue}
                    >
                        Desa
                    </button>
                    <button
                        type="button"
                        onClick={()=>redirect('/kanban/' + projectid)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
                    >
                        Cancel.la
                    </button>
                </div>
            </form>
        </>
    )

}


