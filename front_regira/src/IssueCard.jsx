

const State = ({value}) => <h2>{value}</h2> 
const Priority = ({value}) => <h2>{value}</h2> 
const Type = ({value}) => <h2>{value}</h2> 
const getColorByType  = ({type}) => {
    if (type==='bug'){
        return 'bg-red-400';
    } else if (type==='feature'){
        return 'bg-green-400';
    } else { // task
        return 'bg-blue-400'
    }
}


export default ({data, theRef, isDragging}) =>  {





    return (
        <>
            <div ref = {theRef} style={{ opacity: isDragging ? 0.5 : 1 }} className={"border p-2 m-3 "+getColorByType(data)}>
                <h1>{data.title}</h1>
                <Type value={data.type} />
                <Priority value={data.priority} />
                <State value={data.state} />
            </div>
        </>
    )
}