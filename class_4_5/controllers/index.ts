


export interface MemoryItem {
    id: string;
    value: string;
}

export let savedItems:MemoryItem[] = [
    {id:"Mi valor 1",value:"El comtenido es valioso para el cliente."},
    {id:"Mi Valor 2",value:"El comentario de este es el fina de los finales."},
    {id:"123",value:"El comentario de este es el fina de los finales."}
];


export function isValidId(id:string):boolean{

    if(!id || id.length > 20 || id.length < 1 || /^[a-zA-Z0-9]+$/.test(id)){
        return false;
    }else{
        return true;
    }

}