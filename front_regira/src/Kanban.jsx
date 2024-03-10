
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";
import IssueCard from './IssueCard';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './Test.css';

const ItemType = 'ISSUE_ITEM';

const CAIXES = [
    { state: 'backlog', titol: 'Pendent' },
    { state: 'in_progress', titol: 'En curs' },
    { state: 'review', titol: 'Revisió' },
    { state: 'done', titol: 'Fet' },
    { state: 'closed', titol: 'Tancat' }
];


const Item = ({ eliminaItem, data }) => {
    const [{ isDragging }, drag_ref] = useDrag({
        type: ItemType,
        item: { type: ItemType, id: data.id }
    });
    return <IssueCard reference={drag_ref} isDragging={isDragging} data={data} remove={eliminaItem} />;
};

const Box = ({ children, caixa, mouItem }) => {
    const [{ isOver }, drop_ref] = useDrop({
        accept: ItemType,
        drop: (item) => {
            mouItem(item, caixa.state)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    return (
        <div ref={drop_ref} className={`bg-slate-100 p-3 min-h-[400px] border ${isOver ? 'border-blue-500' : ''}`}>
            <h2 className="text-xl text-center mb-4" >{caixa.titol}</h2>
            {children}
        </div>
    );
};



//KANBAN COMPONENT

export default () => {

    const [projecte, setProjecte] = useState(null);
    const [error, setError] = useState('');
    const redirect = useNavigate();
    const [actualitza, setActualitza] = useState(0)

    const { id } = useParams()

    const { logout, API_URL } = useContext(Contexte)

    const mouItem = (item, state) => {
        const opcions = {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ state })
        }
        fetch(API_URL + '/issues/' + item.id, opcions)
            .then(r => r.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();
                else setActualitza(actualitza + 1);
            })
            .catch(err => console.log(err))
    }

    const eliminaItem = (item) => {
        const opcions = {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        }
        fetch(API_URL + '/issues/' + item.id, opcions)
            .then(r => r.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();
                else setActualitza(actualitza + 1);
            })
            .catch(err => console.log(err))
    }



    useEffect(() => {
        const opcions = {
            credentials: 'include',
        }
        fetch(API_URL + '/project/' + id + '/issues', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error == 'Unauthorized') logout();

                if (data.error) {
                    setError(error)
                } else {
                    setProjecte(data)
                }
            })
            .catch(err => {
                console.log(err);
                setError(err)
            })
    }, [actualitza])


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

            <br />
            <button className="border p-3 bg-red-200" onClick={() => redirect(`/issue/new/${id}`)}>Nova issue</button>
            <br />
            <br />

            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-5 gap-3">
                    {
                        CAIXES.map(caixa => (
                            <Box key={caixa} caixa={caixa} mouItem={mouItem}  >
                                {
                                    projecte.Issues.filter(e => e.state == caixa.state).map(e => <Item key={e.id} eliminaItem={eliminaItem} data={e} />)
                                }
                            </Box>
                        ))
                    }
                </div>
            </DndProvider>



        </>
    )
}