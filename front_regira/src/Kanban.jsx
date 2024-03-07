
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [projecte, setProjecte] = useState(null);
    const [error, setError] = useState('');

    const { id } = useParams()


    useEffect(() => {

        const opcions = {
            credentials: 'include',
        }

        fetch(API_URL + '/projects/' + id, opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(error)
                } else {
                    console.log(data)
                    setBolet(data);
                }
            })

    }, [])


    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
    }

    if(!bolet){
        return <h1>Loading...</h1>
    }

    return (
        <>
            <h1>Bolet: {bolet?.nom}</h1>
            <img src={'/img/'+bolet.foto} alt={bolet.nom} width="300px" />

        </>
    )
}