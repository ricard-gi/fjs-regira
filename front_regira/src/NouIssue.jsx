import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Contexte from "./Contexte";



const IssueForm = ({ issue, handleChange, save, cancel, validIssue }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  return (
    <form className="max-w-lg mx-auto" onSubmit={save}>
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
        <label htmlFor="description" className="block font-medium text-gray-700 mb-1">Descripció</label>
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
          onClick={cancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
        >
          Cancel.la
        </button>
      </div>
    </form>
  );
};



export default () => {


    const [issue, setIssue] = useState({title:'', desc:'', type: 'task', priority: 'medium'});
    const [validIssue, setValidIssue] = useState(false);

    const redirect = useNavigate();
    const { logout, API_URL } = useContext(Contexte)
    const { projectid } = useParams()


    //const handleChange = (e) => setIssue({...issue, [e.target.name]: e.target.value});
    const handleChange = (name, value) => setIssue({...issue, [name]: value});
    

    const creaIssue = (e) => {
        e.preventDefault();

        const options = {
            method: "POST",
            body: JSON.stringify({ title: issue.title, desc: issue.desc, type: issue.type, priority: issue.priority }),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch(API_URL + '/issues/project/' + projectid, options)
            .then(res => res.json())
            .then(data => {
                data.error == 'Unauthorized' ? logout() : redirect('/kanban/' + projectid);
            })
            .catch(cosa => console.log(cosa))
    }

    useEffect(()=>{
        if (issue.title && issue.desc){
            setValidIssue(true)
        } else {
            setValidIssue(false)
        }
    }, [issue])

    return (

        <IssueForm issue={issue} validIssue={validIssue} handleChange={handleChange} save={creaIssue} cancel={()=>redirect('/kanban/' + projectid)}/>
    )
    /*
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
                        onInput={handleChange}
                        value={issue.titol}
                        name='titol'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Desc
                    </label>
                    <textarea
                        onInput={handleChange}
                        value={issue.desc}
                        name='desc'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Nom" />
                </div>
                <div className="border p-4 bg-blue-200 m-4">
                    <div className="radio">
                        <label>
                            <input type="radio" value="bug" name="tipus"
                                checked={issue.tipus === 'bug'}
                                onChange={handleChange} />
                            Bug
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="feature" name="tipus"
                                checked={issue.tipus === 'feature'}
                                onChange={handleChange} />
                            User story / Feature
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="task" name="tipus"
                                checked={issue.tipus === 'task'}
                                onChange={handleChange} />
                            Task
                        </label>
                    </div>
                </div>
                <div className="border p-4 bg-red-200 m-4">
                    <div className="radio">
                        <label>
                            <input type="radio" value="high" name="prioritat"
                                checked={issue.prioritat === 'high'}
                                onChange={handleChange} />
                            High
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="medium" name="prioritat"
                                checked={issue.prioritat === 'medium'}
                                onChange={handleChange} />
                            Medium
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="low" name="prioritat"
                                checked={issue.prioritat === 'low'}
                                onChange={handleChange} />
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
    */
}


