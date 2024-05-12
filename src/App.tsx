import { useState } from 'react';
import wordList from './assets/wordList.json'
import './scsss/style.scss'

function App() {

  type ObjStringBool = { letter: string, isClicked: boolean, userGuess: boolean }
  type ObjStringString = { letter: string, click: string }

  const [tryLeft, setTryLeft] = useState<number>(6)
  const [keyWordLetters, setKeyWordLetters] = useState<ObjStringString[]>(() => {
    return Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)).map(letter => ({ letter: letter, click: '' }))
  })
  const [chosenWord, setChosenWord] = useState<ObjStringBool[]>(() => {
    return wordList[Math.floor(Math.random() * wordList.length)].split('').map(letter => ({ letter: letter, isClicked: false, userGuess: false }))
  })
  const [winOrLose, setWinOrLose] = useState<string>('')
  const [lettersToGuess, setLettersToGuess] = useState<number>(chosenWord.length)

  console.log('chosenWord', chosenWord)

  function onClickLetter(letter: string): void {

    if (winOrLose) return
    ///////////////
    let letterExist = false
    let updatedLetterToGuess = lettersToGuess
    const updatedChosenWord: ObjStringBool[] = chosenWord.map((letterObj, idx) => {
      if (letterObj.letter === letter && !letterObj.isClicked) {
        updatedLetterToGuess--
        letterExist = true
        const updateKeyWordLetters: ObjStringString[] = keyWordLetters.map(keyWordLetter => {
          if (keyWordLetter.letter === letter) return { ...keyWordLetter, click: 'clicked-and-contains' }
          else return keyWordLetter
        })
        setKeyWordLetters(updateKeyWordLetters)
        if (lettersToGuess - 1 === 0) win()
        return { ...letterObj, isClicked: true, userGuess: true }
      }
      else return letterObj
    })
    setChosenWord(updatedChosenWord)
    setLettersToGuess(updatedLetterToGuess)

    if (!letterExist) {
      setTryLeft(tryLeft - 1)
      if (tryLeft === 1) gameOver()
    }
    ///////////////


    // const foundLetterIdx: number = chosenWord.findIndex(letterObj => letterObj.letter === letter && !letterObj.isClicked)

    // if (foundLetterIdx === -1 && tryLeft === 1) gameOver()

    // if (foundLetterIdx === -1) setTryLeft(tryLeft - 1)

    // else {
    // const updateChosenWord: ObjStringBool[] = chosenWord.map((letter, idx) => {
    //   if (idx === foundLetterIdx) return { ...letter, isClicked: true, userGuess: true }
    //   else return letter
    // })
    // setChosenWord(updateChosenWord)
    // setLettersToGuess(lettersToGuess - 1)

    // const updateKeyWordLetters: ObjStringString[] = keyWordLetters.map(keyWordLetter => {
    //   if (keyWordLetter.letter === letter) return { ...keyWordLetter, click: 'clicked-and-contains' }
    //   else return keyWordLetter
    // })
    // setKeyWordLetters(updateKeyWordLetters)

    // if (lettersToGuess - 1 === 0) win()
    // }
  }

  function gameOver(): void {
    const updateChosenWord: ObjStringBool[] = chosenWord.map((letter, idx) => ({ ...letter, isClicked: true }))
    setChosenWord(updateChosenWord)
    setWinOrLose('lose')
  }

  function win(): void {
    setWinOrLose('win')
  }

  function startOver(): void {
    setTryLeft(6)
    setWinOrLose('')
    setKeyWordLetters(Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)).map(letter => ({ letter: letter, click: '' })))
    const tempChosenWord: ObjStringBool[] = wordList[Math.floor(Math.random() * wordList.length)].split('').map(letter => ({ letter: letter, isClicked: false, userGuess: false }))
    setChosenWord(tempChosenWord)
    setLettersToGuess(tempChosenWord.length)
  }


  return (
    <section className='main-app'>

      <p>Lives: {tryLeft}</p>

      <ul>
        {chosenWord.map((letter, idx) => (
          <li className={letter.userGuess ? '' : 'user-didnt-guess'} key={idx}>{letter.isClicked ? letter.letter : ''}</li>
        ))}
      </ul>

      <ul className='keyword'>
        {keyWordLetters.map((keyWordLetter, idx) => (
          <li className={`${keyWordLetter.click} ${winOrLose}`} key={idx} onClick={() => onClickLetter(keyWordLetter.letter)}>{keyWordLetter.letter}</li>
        ))}
      </ul>

      {winOrLose === 'lose' && <p className='lose-message'>You lose! <button onClick={startOver}>Play again</button></p>}
      {winOrLose === 'win' && <p className='win-message'>You won! <button onClick={startOver}>Play again</button></p>}

    </section>
  )
}

export default App
