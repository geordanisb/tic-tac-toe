
export function winning(board:string[],player:string){
  if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
        return true;
    } else {
        return false;
    }
}

export function winnerDetails(board:string[]){
  if(board[0] == board[1] && board[1] == board[2] )return {indexes:[0,1,2],char:board[0]};
  else if(board[3] == board[4] && board[4] == board[5] )return {indexes:[3,4,5],char:board[3]};
  else if(board[6] == board[7] && board[7] == board[8] )return {indexes:[6,7,8],char:board[6]};
  else if(board[0] == board[3] && board[3] == board[6] )return {indexes:[0,3,6],char:board[0]};
  else if(board[1] == board[4] && board[4] == board[7] )return {indexes:[1,4,7],char:board[1]};
  else if(board[2] == board[5] && board[5] == board[8] )return {indexes:[2,5,8],char:board[2]};
  else if(board[0] == board[4] && board[4] == board[8] )return {indexes:[0,4,8],char:board[0]};
  else if(board[2] == board[4] && board[4] == board[6] )return {indexes:[2,4,6],char:board[2]};
  return {indexes:[],char:''};
}

export const getIndex = (newBoard:string[],aiPlayer:string):number=>{
  var huPlayer = aiPlayer == 'o' ? 'x' : 'o';
  let allWinCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  const positions:Record<string,number[]> = {
    '-':[],
    [aiPlayer]:[],
    [huPlayer]:[]
  };

  newBoard.forEach((i,idx)=>{
    if(i=='-')positions['-'].push(idx)
    else if(i==huPlayer)positions[huPlayer].push(idx)
    else if(i==aiPlayer)positions[aiPlayer].push(idx)
  });
  const huPositions = positions[huPlayer];
  const aiPositions = positions[aiPlayer];
  const indixesAvailable = positions['-'];

  //get only possible winner combinations for the aiPlayer
  const winCombinations:number[][] = []
  allWinCombinations.forEach((wc)=>{
    const idxHup = huPositions.findIndex(i=>wc.includes(i))
    if(idxHup==-1){
      winCombinations.push(wc)
    }
  })
  debugger;
  //TODO could add a score logic like a backtraking to get the best win combination but the cpu always win or tied
  let winCombination:number[]=[];
  
  for(let i=0;i<winCombinations.length;i++){
    if(winCombination.length)break;
    const wc = winCombinations[i];
    for(let j=0;j<aiPositions.length;j++){
      const p = aiPositions[j];
      if(wc.includes(p)){
        winCombination = wc;
        break;
      }
    }
  }
  //remove existing positions 
  aiPositions.forEach(p=>{
    winCombination = winCombination.filter(i=>i!=p);
  })

  //there are some chance to win
  if(winCombination && winCombination.length)return winCombination[0]

  //not way ai to win, tied or loss
  if(indixesAvailable.length)
    return indixesAvailable[0];
  return -1;//match end
}





  