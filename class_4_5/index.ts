/*

Problem statement: Client that uses this API to store values
complains that saving values doesn't work.

Apparently, API will say that it saved items, but return
incorrect values when queried. Also, deleting items is erratic,
causing items to "go back in time" or return nonsensical values.

*/

import express, { type Request, type Response } from "express";
import cors from "cors";

export interface MemoryItem {
    id: string;
    value: string;
}

let savedItems:MemoryItem[] = [
    {id:"Mi valor 1",value:"El comtenido es valioso para el cliente."},
    {id:"Mi Valor 2",value:"El comentario de este es el fina de los finales."},
    {id:"123",value:"El comentario de este es el fina de los finales."}
];

const app = express();
app.use(express.json());
app.use(cors());
// Insertando Elementos;
app.post("/items", (req: Request, res: Response) => {
try{
    const {id, value} = req.body;
    const data = savedItems.filter(item => item.id.includes(id));
    if(data){
        res.status(205).json({msg:"Este Id ya existe."});
    }
    console.info("esto es lo que retorno Keys:");
    console.info(data);
    if(!id || !value){
       res.status(400).json({msg:"Error, todos los campos deven de ser llenados."});
       return;        
    }
   const newItem: MemoryItem = {
       id,
       value,
   };

   console.log("retorno de fetch");
   console.log(newItem);
   savedItems.push(newItem);
   res.status(200).json(newItem);
}catch(error){
    res.status(400).json({msg:"Parace que hubo un error, contacte al servicio tecnico para mas informacion."});
}
});
app.get("/items/all", (req: Request, res: Response) => {
    res.json(savedItems); 
});

app.get("/items/:id", (req: Request, res: Response) => {
    const item = savedItems.find((item) => item.id === req.params.id); 

    if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
    }

    res.json(item);
});


app.delete("/items/:id", (req: Request, res: Response) => {
    const savedItem = savedItems.findIndex((item) => item.id === req.params.id); 
    if(!savedItem){}

    if (savedItem === -1) {
        res.status(404).json({ msg: "Item not found" }); 
        return;
    }

    const deletedItem = savedItems.splice(savedItem, 1);
    console.info(deletedItem[0]);
    res.json({msg:"item delete successfuly!"});
    return;
});

app.listen(8099, () => {
    console.log("Running on port 8099");
});