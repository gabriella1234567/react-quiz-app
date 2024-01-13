import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const api_key = import.meta.env.VITE_REACT_APP_API_TOKEN



function App() {
const [difficulty, setDifficulty] = useState('easy')
const [tag, setTag] = useState(undefined)
const [questions, setQuestions] = useState([])
const [currentQuestion, setCurrentQuestion] = useState(0)
const [score, setScore] = useState(0)
const [main, setMain] = useState(true)
  
  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      return
    }
  setCurrentQuestion(currentQuestion + 1)
  }
  
  const previousQuestion = () => { 
    if (currentQuestion === 0) {
      return
    }
    setCurrentQuestion(currentQuestion - 1)
  }

const getRandomQuiz = async () => {
  try {
  const response = await axios.get('https://quizapi.io/api/v1/questions', {
    params: {
      apiKey: api_key,
      limit: 10
    },
  })
  if (response.data) {
    setQuestions(response.data)
    }
  setMain(false)
  } catch (error) {
    console.log('Error fetching random questions: ', error)
  }
}
  
  const getParamQuiz = async () => {
    try {
      const response = await axios.get('https://quizapi.io/api/v1/questions', {
        params: {
          apiKey: api_key,
          tags: tag,
          difficulty: difficulty,
          limit: 10
        },
      });
      if (response.data) {
        setQuestions(response.data)
      }
      setMain(false)
    } catch (error) { 
      console.log('Error fetching param questions: ', error)
    }
  }
  
  const formSubmitHandler = (e) => {
    e.preventDefault()
    getParamQuiz()
  }

  const isCorrect = (question, answerKey) => {
    console.log(question)
    return question.correct_answers[`${answerKey}_correct`] === "true";

  }

  const renderAnswers = question => {
    return Object.keys(question.answers).filter(answerKey => question.answers[answerKey] != null).map(answerKey => (
      <button 
        key={answerKey} 
        onClick={() => alert(isCorrect(question, answerKey) ? "Correct!" : "Wrong")}
        className={isCorrect(question, answerKey)? "correct" : "wrong"}
        >
          {question.answers[answerKey]}
        </button>
    ))
  }

  return (
    <>
      <div className="main">
        {main && (
          <div id="start">
        <h1>Quizzz</h1>
        <p>You can start a completely random quiz or select difficulty and category</p>
        <button id="randomQuiz" onClick={getRandomQuiz}>Get Random Quiz</button>
        <form onSubmit={formSubmitHandler}>
          <div className="section">
        <label id="categoryLabel" className="categoryLabel" htmlFor="category">Pick a category </label>
        <select id="selectCategory" className="selectCategory "name="category" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="HTML">HTML</option>
          <option value="BASH">BASH</option>
          <option value="Javascript">Javascript</option>
          <option value="PHP">PHP</option>
            </select>
          </div>
          <div className="section">
          <label className="categoryLabel" htmlFor="difficulty">Pick a difficulty</label>
                <input
                  className="radio"
                  type="radio"
                  id="easy"
                  name="difficulty"
                  value="easy"
                  checked={difficulty === 'easy'}
                  onChange={(e) => setDifficulty(e.target.value)} />
            <label htmlFor="easy">Easy</label>
                <input
                  className="radio"
                  type="radio"
                  id="medium"
                  name="difficulty"
                  value="medium"
                  checked={difficulty === 'medium'}
                  onChange={(e) => setDifficulty(e.target.value)} />
            <label htmlFor="medium">Medium</label>
                <input
                  className="radio"
                  type="radio"
                  id="hard"
                  name="difficulty"
                  value="hard"
                  checked={difficulty === 'hard'}
                  onChange={(e) => setDifficulty(e.target.value)} />
            <label htmlFor="hard">Hard</label>
          </div>
          <button type="submit">Get Quiz</button>
        </form>
          </div>)}
      
        <div id="questions">
        {questions.length > 0 && (
          <div className="card">
            <p>Question {currentQuestion + 1}: {questions[currentQuestion].question}</p>
              <div className="answer">
                {renderAnswers(questions[currentQuestion])}
              </div>
              {currentQuestion > 0 && <button
                className="prev"
                onClick={previousQuestion}>Prev
              </button>}
              {currentQuestion < questions.length - 1 && <button
                className="next"
                onClick={nextQuestion}>Next
              </button>}
          </div>
        )}
      </div>
    </div>
  </>

  )
}

export default App
