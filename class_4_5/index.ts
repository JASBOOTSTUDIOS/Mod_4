/*

Problem statement: Client that uses this API to store values
complains that saving values doesn't work.

Apparently, API will say that it saved items, but return
incorrect values when queried. Also, deleting items is erratic,
causing items to "go back in time" or return nonsensical values.

*/
import express, { type Request, type Response } from "express";
import cors from "cors";
import { savedItems, MemoryItem, isValidId } from "./controllers";

const app = express();
app.use(express.json());
app.use(cors());

// Insertando Elementos;
app.post("/items", (req: Request, res: Response) => {
    try {
        console.info(req.body);
        const { id, value } = req.body;

        // Validaciones
        console.info("2. Validaciones.");
        
        if (isValidId(id)) {
            console.info("3. Validaciones.");
            res.status(400).json({ msg: "ID inválido, debe cumplir el formato esperado." });
            return;
        }
        console.info("4. Validaciones.");
        
        const exists = savedItems.some(item => item.id === id);
        console.info("5. Validaciones.");
        if (exists) {
            console.info("6. Validaciones.");
            res.status(400).json({ msg: "Este Id ya existe." });
            return;
        }
        console.info("7. Validaciones.");
        
        const newItem: MemoryItem = { id, value };
        savedItems.push(newItem);
        res.status(201).json(newItem);
        console.info("8. Validaciones.");

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error interno, contacte al soporte técnico." });
    }
});

// Obtener todos los items
app.get("/items/all", (req: Request, res: Response) => {
    try{
        if(!savedItems) {res.status(400).json({msg:"No hay datos para mostrar."});return;}
        res.json(savedItems);
    }catch(error){
        res.status(400).json({msg:"Hubo un error interno, contacte al soporte técnico para resolverlo."})
    }
});

// Obtener un item por ID
app.get("/items/:id", (req: Request, res: Response) => {
    const item = savedItems.find(item => item.id === req.params.id);
    if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
    }

    res.json(item);
});

// Eliminar un item
app.delete("/items/:id", (req: Request, res: Response) => {
    const index = savedItems.findIndex(item => item.id === req.params.id);

    if (index === -1) {
        res.status(404).json({ msg: "Item not found" });
        return;
    }

    const deletedItem = savedItems.splice(index, 1);
    console.info(deletedItem[0]);
    res.json({ msg: "Item deleted successfully!" });
});

app.listen(8099, () => {
    console.log("Running on port http://localhost:8099/items/all");
});

// Manejo de errores no controlados
process.on("uncaughtException", (err) => {
    console.error("Error no manejado:", err);
});
