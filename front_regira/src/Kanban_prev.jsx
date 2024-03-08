
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";
import IssueCard from './IssueCard';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Test.css';


const API_URL = 'http://localhost:3000/api';

const states = ['backlog', 'in_progress', 'review', 'done', 'closed']
const CAIXES = states.map(e => { return { id: e, label: e }});







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

        fetch(API_URL + '/project/' + id + '/issues', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                } else {
                    setProjecte({name:data.name,  desc: data.desc})
                    setIssues(data.Issues);
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

            <div className="grid grid-cols-4">
                {issues.map(issue => <IssueCard key={issue.id} data={issue} /> )}

            </div>
        
        </>
    )
}