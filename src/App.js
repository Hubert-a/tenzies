import React from 'react'
import Die from './components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
import Timer from './components/Timer'
export default function App(){
    
    const [dice , setDice ]= React.useState(allNewDice())
    const [tenzies, setTenzies]= React.useState(false)
    const [isActive, setIsActive] = React.useState(false)
    const [isPaused, setIsPaused] = React.useState(true)
    const [count, setCount] = React.useState(0)
    const [time, setTime] = React.useState(0)

     
    //generating new dice
    function allNewDice(){
        const newDice = []
        for(let i = 0; i<10;i++){
            newDice.push(generateNewDie())
        }
        return newDice
    }
    //function to push new die values to array
    function generateNewDie(){
       return {
            value:Math.ceil(Math.random()*6),
            isHeld:false,
            id:nanoid()
        }
    }
    // function to check if the game has been won or not 
    React.useEffect(()=>{
        const allHeld = dice.every(die=>die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die =>die.value === firstValue)
        if(allHeld && allSameValue){
            setTenzies(true)
            handlePauseResume()
        }
        
    },[dice])

    React.useEffect(()=>{
        let interval = null

        if(isActive && isPaused===false){
            interval = setInterval(()=>{
                setTime(time=>time +10)

            },10)
        }else{
            clearInterval(interval)
        }
        return ()=>{
            clearInterval(interval)
        }
    },[isActive, isPaused])

    const handleStart = ()=>{
        setIsActive(true)
        setIsPaused(false)
    }
    const handlePauseResume = () => {
        setIsPaused(!isPaused);
      };
      
      const handleReset = () => {
        setIsActive(false);
        setTime(0);
      };



    function rollDice(){
        setCount()
        if(!tenzies){
            setDice(oldDice => oldDice.map(die=>{
                return die.isHeld ? die : generateNewDie()

            }))
            
        }else{
            handleReset()
            setTenzies(false)
            setDice(allNewDice())

        }
    }
    const diceElements = dice.map(die=>(
    <Die
        key= {die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice = {()=>holdDice(die.id)}
    />
    ))
    // function to check if all dice of same number is  held
    function holdDice(id){
        // Probably where to start counting from 
        handleStart()
        setDice(prevDice=>prevDice.map(die=>{
            return die.id===id?{...die, isHeld:!die.isHeld}:die
        }))
        
    }
    
    


    return(
        <main>
            {tenzies && <Confetti/>}
            <h1 className='title'>Tenzies</h1>
            <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its currect value between rolls.</p>
            <div className='dice--container'>
                {diceElements}
            </div>
            <button className='roll-dice'onClick={rollDice}>{tenzies?'New Game':'Roll Dice'}</button>
            <Timer 
                time ={time}
            />
            <p>{count}</p>
            
            
        </main>
    )
}