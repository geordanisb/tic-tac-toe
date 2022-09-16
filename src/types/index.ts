export interface Move {
    id:number;       
    index:number;    
    byBot:boolean;       
    character:string;  
    gameId:number;    
}
export interface Game {
    id:string;
    moves:Move[];
    botChar:'x'|'o';
    finished:boolean;
    createdAt:string;
}

export interface MoveCreate {
    gameId: string;
    index: [0,1,2,3,4,5,6,7,8]; 
    byBot:boolean;       
    character:string; 
}
export interface GameCreate {
    partidaId:string;
     siguienteMovimiento: {
        caracter: 'o'|'x'; 
        posicion: number
    }
}

export interface CancelLastMove {
    gameId: string;
    byBot:boolean;       
    character:string; 
}

export interface MyError{
    message?:string;
    
}


