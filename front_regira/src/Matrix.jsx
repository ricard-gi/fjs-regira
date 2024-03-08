// App.js
import React, { useCallback } from 'react';
import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Test.css';

const ItemType = 'ITEM';

const ELEMENTS = [
    { nom: "poma", caixa: "caixa1" },
    { nom: "pera", caixa: "caixa1" },
    { nom: "patata", caixa: "caixa2" },
    { nom: "ceba", caixa: "caixa4" },
    { nom: "préssec", caixa: "caixa3" },
    { nom: "maduixa", caixa: "caixa3" },
]

const CAIXES = [
    { id: "caixa1", label: "important i urgent" },
    { id: "caixa2", label: "important i no urgent" },
    { id: "caixa3", label: "no important i urgent" },
    { id: "caixa4", label: "no important i no urgent" }
]


const Item = ({ name, caixa, eliminaItem }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { type: ItemType, name },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    let color;
    if (caixa=="caixa1") color="red"
    if (caixa=="caixa2") color="blue"
    if (caixa=="caixa3") color="pink"
    if (caixa=="caixa4") color="green"

    return (
        <div
            ref={drag}
            className={`border p-4 bg-${color}-500 mb-4 flex justify-between`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {name} {caixa == "caixa4" && <button className="border bg-white text-black px-2 tex-2xl" onClick={() => eliminaItem(name)}>X</button>}
        </div>
    );
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
        <div ref={drop} className={`bg-slate-100 p-8 min-h-[400px] border ${isOver ? 'bg-blue-500' : ''}`}>
            <h2 className="text-xl text-center mb-4" >{box_label}</h2>
            {children}
        </div>
    );
};


const Matrix = () => {

    const [items, setItems] = useState(ELEMENTS);

    const [novaTasca, setNovaTasca] = useState("")

    // funció que "Mou" un element d'una caixa a l'altra
    const mouItem = (item, caixa) => {
        const nousItems = items.map(it => {
            if (it.nom === item) {
                it.caixa = caixa;
            }
            return it;
        })
        setItems(nousItems)

    }

    const afegirTasca = useCallback(() => {
        setItems([...items, { nom: novaTasca, caixa: "caixa1" }]);
        setNovaTasca("")
    }, [novaTasca])



    const eliminaItem = useCallback((nom) => {
        const items2 = items.filter(e => e.nom !== nom)
        setItems(items2)
    }, [items])

 
    return (
        <>

            <div className="w-1/2 flex justify-center mb-8 mx-auto">
                <input className="border mr-8 p-4" onChange={(e) => setNovaTasca(e.target.value)} value={novaTasca} />
                <button className="border p-4 bg-white" onClick={afegirTasca}>Afegir</button>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-2 gap-6">
                    {
                        CAIXES.map(caixa => (
                            <Box key={caixa.id} box_label={caixa.label} box_id={caixa.id} mouItem={mouItem}  >
                                {
                                    items.filter(e => e.caixa == caixa.id).map(e => <Item eliminaItem={eliminaItem} key={e.nom} caixa={e.caixa} name={e.nom} />)
                                }
                            </Box>
                        ))
                    }
                </div>
            </DndProvider>


        </>
    );
};

export default Matrix;
