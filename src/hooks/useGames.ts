import { useQuery } from 'react-query';
import { Game } from '../types';

export const getGames = async (origin:string=''):Promise<Game[]> => {
  const {games} = await fetch(`${origin}/api/tic-tac-toe/play`).then(res=>res.json())
  return games;
};

const useGames = () => {
  return useQuery('GAMES', ()=>getGames(), {
    staleTime: 1000 * 60 * 60,
  });
};

export default useGames;
