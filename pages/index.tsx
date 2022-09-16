
import Head from 'next/head'
import Image from 'next/image'
import toast from 'react-hot-toast'
import styles from '../styles/Home.module.css'
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Button, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Game, GameCreate, MyError } from '@/src/types';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient, useMutation, useQueryClient } from 'react-query';
import useGames,{getGames} from '@/src/hooks/useGames'
import {winnerDetails} from '@/lib/tools'


export default function Home() {
  const [huChar,setHuChar] = useState<'x'|'o'>();
  const [aiChar,setAiChar] = useState<'x'|'o'>();

  const [games,setGames] = useState<Game[]>()
  const [gameSelected,setGameSelected] = useState<Game>()
  const queryClient = useQueryClient()

  const {data} = useGames()
  const createGameMutation = useMutation((payload:GameCreate|{})=>{
    return fetch('/api/tic-tac-toe/play',{
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(r=>r.json())
  },{
    onMutate: (variables) => {
      //this a good place for optimistic ui as well
    },
    onSettled: (data, error, variables, context) => {debugger;
      //refresh server side cache
      queryClient.invalidateQueries('GAMES');
      if(error){
          toast.error((error as MyError).message||'Server Error')
      }
    },
  })

  const editGameMutation = useMutation((payload:{partidaId:string})=>{
    return fetch('/api/tic-tac-toe/play',{
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    }).then(r=>r.json())
  },{
    onMutate: (variables) => {
      //this a good place for optimistic ui as well
    },
    onSettled: (data, error, variables, context) => {debugger;
      //refresh server side cache
      queryClient.invalidateQueries('GAMES');
      if(error){
          toast.error((error as MyError).message||'Server Error')
      }
    },
  })

  useEffect(()=>{
    if(data && data.length){
      setGames(()=>data)
      const gs = data.slice(-1)[0];
      setGameSelected(()=>gs)
      setAiChar(()=>gs.botChar)
      setHuChar(()=>gs.botChar=='x'?'o':'x')

    }
    console.log(games,'games')
  },[data])

  useEffect(()=>{
    console.log('aiChar',aiChar),console.log('huChar',huChar)
  },[aiChar,huChar])

  const handlerHuCharSelection = (e:any,char:'x'|'o')=>{
    setHuChar(()=>char)
    setAiChar(()=>char=='x'?'o':'x')

  }
  const handlerNewMove = (e:any,idx:number)=>{
    console.log(idx)
    if(gameSelected){
      createGameMutation.mutate({
        partidaId:gameSelected?.id,
        siguienteMovimiento: {
          caracter: huChar,
          posicion: idx
        }
  
      })

    }
    else
      toast.success('Select a game o create new one to start')
  }

  const handlerSelectGame = (e:any,gameId:string)=>{
    const g = games?.find(i=>i.id==gameId)
    setAiChar(()=>g?.botChar)
    setHuChar(()=>g?.botChar=='x'?'o':'x')
    setGameSelected(()=>g);
  }

  const renderGames = ()=>{
    if(!games)return <></>;
   return <ul>
                {games.map(g=><li className="my-2" key={g.id}>
                  <Button  disabled={gameSelected && g.id==gameSelected.id} onClick={(e)=>handlerSelectGame(e,g.id)}>
                    Computer play as: {g.botChar} | Created on: {(new Date(g.createdAt).toLocaleString())}
                  </Button>
                  </li>)}
              </ul>
  }

  const renderButtonsMoveAction = (idx:number)=>{
    let classW =''
    if(gameSelected){
      if(gameSelected.finished){
        let estadoTablero = ['-','-','-','-','-','-','-','-','-'];
        gameSelected.moves.forEach(m=>{
          estadoTablero[m.index] = m.character
        })
        const wd = winnerDetails(estadoTablero);
        if(wd.indexes.includes(idx))classW='bg-info'
      }
      const f = gameSelected.moves.find(i=>i.index==idx)
      const lbl = f ? f.character : '-';
    return <Button disabled={gameSelected.finished || lbl!='-'} 
    className={`p-5 border-1 border-success cursor-pointer ${classW}`}
     onClick={(e)=>handlerNewMove(e,idx)} 
     variant="light">
      {lbl}
     </Button>
    }
     return <Button className={`p-5 border-1 border-success`} onClick={(e)=>handlerNewMove(e,idx)} variant="light"/>
  }

  const handlerCreateGame = (char?:'x'|'o')=>{
    createGameMutation.mutate({
      siguienteMovimiento: {
        caracter: char,
        posicion: -1
      }
    })
  }

  const handlerUndoLastMove = ()=>{
    if(gameSelected){
      editGameMutation.mutate({
        partidaId:gameSelected.id
      })
    }
  }

  return (
    <SimpleLayout title="">
        <div className={styles.container}>
      <Head>
        <title>TIC TAC TOE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <section>
          <Row>
            <Col>
          {/* {!gameSelected ? <div>
            <p>Play with:</p>
            <Button onClick={(e)=>handlerHuCharSelection(e,'x')}>x</Button>{` or `}
            <Button onClick={(e)=>handlerHuCharSelection(e,'o')}>o</Button>
          </div>:''} */}

              <table>
                <tbody>
                  <tr>
                    <td>{renderButtonsMoveAction(0)}</td>
                    <td>{renderButtonsMoveAction(1)}</td>
                    <td>{renderButtonsMoveAction(2)}</td>
                  </tr>

                  <tr>
                    <td>{renderButtonsMoveAction(3)}</td>
                    <td>{renderButtonsMoveAction(4)}</td>
                    <td>{renderButtonsMoveAction(5)}</td>
                  </tr>

                  <tr>
                    <td>{renderButtonsMoveAction(6)}</td>
                    <td>{renderButtonsMoveAction(7)}</td>
                    <td>{renderButtonsMoveAction(8)}</td>
                  </tr>

                  
                </tbody>
                
              </table>
                <Button className="me-2 my-2" variant='warning' onClick={()=>handlerCreateGame()}>Create new game</Button>
                {gameSelected && (!gameSelected.finished && gameSelected.moves.length>=2) ? <><Button className="me-2 my-2" variant='danger' onClick={()=>handlerUndoLastMove()}>Undo last move</Button></>: <></>}
                <br/>
            <Button className="me-2" onClick={()=>handlerCreateGame('x')}>Create new game with x</Button>
            <Button className="me-2" onClick={()=>handlerCreateGame('o')}>Create new game with o</Button>
            </Col>
            <Col>
            

              <h2>Select from games saved:</h2>
              {renderGames()}
            </Col>
          </Row>
          
        </section>
        
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
   
    </SimpleLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient() 
debugger;
  const origin = process.env.NEXT_PUBLIC_WEBAPP_URL
  let games = await getGames(origin);
  await queryClient.prefetchQuery('GAMES',()=>games)
   
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
