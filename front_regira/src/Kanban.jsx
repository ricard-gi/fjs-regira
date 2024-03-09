
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Contexte from "./Contexte";
import IssueCard from './IssueCard';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Test.css';
const ItemType = 'ITEM';

const API_URL = 'http://localhost:3000/api';

const states = ['backlog', 'in_progress', 'review', 'done', 'closed']
const STATES = states.map(e => { return { id: e, label: e }});


const Item = ({ eliminaItem, data }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { type: ItemType, name:data.title },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return  <IssueCard theRef={drag} data={data} isDragging={isDragging} remove={eliminaItem} />;

};

const Box = ({ children, box_label, box_id, mouItem }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemType,
        drop: (item, monitor) => {
            // Obtenir el nom del item que s'ha deixat anar
            const itemName = item.name;
            // Obtain el nom de la caixa on es deixa anar
            const caixa = box_id;
            // Moure l'item d'un lloc a l'altre
            mouItem(itemName, caixa)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });
    return (
        <div ref={drop} className={`bg-slate-100 p-3 min-h-[400px] border ${isOver ? 'bg-blue-500' : ''}`}>
            <h2 className="text-xl text-center mb-4" >{box_label}</h2>
            {children}
        </div>
    );
};




export default () => {

    const [projecte, setProjecte] = useState(null);
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState('');
    const redirect = useNavigate();

    const { id } = useParams()

    const { loguejat } = useContext(Contexte)


    const actualitzaBDD = (id,state) => {

        
        const opcions = {
            credentials: 'include',
            method : 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({state})

        }

        fetch(API_URL + '/issues/' + id , opcions);
           
    }

    const mouItem = (item, caixa) => {
        let litem = 0;
        const nousItems = issues.map(it => {
            if (it.title === item) {
                it.state = caixa;
                litem = it.id;
            }
            return it;
        })
        setIssues(nousItems);

        actualitzaBDD(litem, caixa);

    }

    
    
    const eliminaItem = useCallback((nom) => {
        const items2 = issues.filter(e => e.title !== nom)
        setIssues(items2)
    }, [issues])


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
                    console.log(data.Issues)
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

    if (!projecte || !issues.length) {
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

            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-5 gap-3">
                    {
                        STATES.map(caixa => (
                            <Box key={caixa.id} box_label={caixa.label} box_id={caixa.id} mouItem={mouItem}  >
                                {
                                    issues.filter(e => e.state == caixa.id).map(e => <Item eliminaItem={eliminaItem} key={e.id} data={e} />)
                                }
                            </Box>
                        ))
                    }
                </div>
            </DndProvider>


        
        </>
    )
}