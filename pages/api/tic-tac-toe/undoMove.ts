
import type { NextApiRequest, NextApiResponse } from 'next'

import {prisma} from '@/lib/prisma';
import {getIndex,winning} from '@/lib/tools';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.method === 'GET') {
      const games = await prisma.game.findMany({
        include:{
          moves:true
        }
      });
      return res.status(200).json({ games });
  }
  
  if (req.method === 'POST') {
    try {
      const { partidaId, siguienteMovimiento, estadoTablero:et } = req.body; //user start moving
      const { caracter:c,posicion:p=-1} = siguienteMovimiento||{};
      let posicion = parseInt(p);
      let caracter = c||'';
      let estadoTablero = et && et.length == 9 ? et : ['-','-','-','-','-','-','-','-','-'];
      
      const createMove = async (gameId:string,character:string,index:number,byBot:boolean)=>{//idx ->-1 require minimax calculation
        const newMove = await prisma.move.create({
          data:{
            byBot,
            index,
            character,
            game:{
              connect:{
                id:gameId
              }
            }  
          }
        })
        if(newMove){
          estadoTablero[index]=character;
          return newMove;
        }
        else return null
      }

      const createBotMove = async (gameId:string,character:string,index:number)=>{
        return createMove(gameId,character,index,true);
      }

      const createHumanMove = async (gameId:string,character:string,index:number)=>{
        return createMove(gameId,character,index,false);
      }

      if(!partidaId){//new game
        debugger;
        const random = Math.floor(Math.random()*8);//number between 0-8
        caracter = caracter 
          ? caracter=='x' ? 'o' : 'x'
          : random >= 4  ? 'x' : 'o';
        posicion = random;
        const newGame = await prisma.game.create({data:{botChar:caracter}});
        const botMove = await createBotMove(newGame.id,caracter,posicion);
        return res.status(201).json({ 
            partidaId: newGame.id,
            estadoTablero,
            siguienteMovimiento:null,
            historial: [
              { caracter,posicion }
            ], 
        });
      }
      else {//previous saved game
        if(!siguienteMovimiento)
          return res.status(400).json({error:true,message:'_Not valid payload format_'})

        if(!caracter || !['x','o'].includes(caracter))//wrong character used
          return res.status(400).json({error:true,message:'_Not valid move_'})
        if(posicion<0 || posicion >8)//wrong position
          return res.status(400).json({error:true,message:'_Not valid move_'})

        const game = await prisma.game.findFirst({
          where:{
            id:partidaId,
          },
          include:{
            moves:true
          }
          
        })

        if(game){
          if(game.finished)
            return res.status(400).json({error:true,message:'_Match has finished_'})

          const previousMoves = game.moves;
          const huPlayer = game.botChar == 'x' ? 'o' : 'x';
          if(previousMoves.length==9)//not more possible moves
            return res.status(400).json({error:true,message:'_Match has finished_'})
          
          const lastMove = previousMoves.slice(-1)[0]
          if(caracter == lastMove.character || !lastMove.byBot)//wrong move shift|turno
              return res.status(400).json({error:true,message:'_Not valid move_'})
            
          const idxPosicion = previousMoves.findIndex(m=>m.index==posicion)
          if(idxPosicion!=-1)
            return res.status(400).json({error:true,message:'_Not valid move_'})
                
          previousMoves.forEach((m)=>{
            estadoTablero[m.index] = m.character;
          });

          const humanMove = await createHumanMove(game.id,caracter,posicion)

          if(winning(estadoTablero,huPlayer)){
            const moves = await prisma.move.findMany({where:{gameId:game.id}});
            const historial = moves.map((m)=>({ caracter:m.character,posicion:m.index }));
            await prisma.game.update({where:{id:game.id},data:{finished:true}})
            return  res.status(201).json({ 
              partidaId: partidaId,
              estadoTablero,
              siguienteMovimiento:null,
              historial,
              campoPersonalizado1:'You has won the match!'
            });
            
          }

          if(humanMove){debugger;
            const index = getIndex(estadoTablero,game.botChar);
            await createBotMove(partidaId,game.botChar,index);

            const moves = await prisma.move.findMany({where:{gameId:game.id}});
            const historial = moves.map((m)=>({ caracter:m.character,posicion:m.index }))

            let aiWin=''
            if(winning(estadoTablero,game.botChar)){
              await prisma.game.update({where:{id:game.id},data:{finished:true}})
              aiWin='AI has won the match!'
            }
            
            return res.status(201).json({ 
              partidaId: partidaId,
              estadoTablero,
              siguienteMovimiento:null,
              historial,
              campoPersonalizado1:aiWin
          });
          }
          else return res.status(400).json({error:true,message:'_Not valid move_'})
        }
        else
          return res.status(400).json({error:true,message:'_Not valid matchId_'})
      }

    }
    catch (error) {//catch errors including some related to wrong payload structure
      return res.status(500).json({ ok: false, error:true,message: '_Not valid payload format_' });
    }
  } 

  if (req.method === 'PATCH') {
    try {
           return res.status(200).json({ ok: true });
    }
    catch (error) {
      return res.status(500).json({ error:true,message: 'Server Error' });
    }
  }

  
}
