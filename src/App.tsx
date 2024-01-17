import { useState } from "react";
import "./output.css";
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const api_key = import.meta.env.VITE_REACT_APP_API_KEY

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [main, setMain] = useState(true);

  type Answer = {
    answer_a: string;
    answer_b: string;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };

  type CorrectAnswer = {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string | null;
    answer_d_correct: string | null;
    answer_e_correct: string | null;
    answer_f_correct: string | null;
  };

  type Question = {
    id: number;
    question: string;
    answers: Answer;
    correct_answers: CorrectAnswer;
  };

  type ApiResponse = {
    data: Question[];
  };

  const getRandomQuiz = async () => {
    console.log('fetching random quiz...')
    try {
       const response = await axios.get("https://quizapi.io/api/v1/questions", {
         params: {
           apiKey: `${api_key}`,
           limit: 10,
         },
       });
      const data = response as ApiResponse;
      console.log(data + " <- before if in getrandomquiz");
      console.log(data);
      if (data.data) {
        console.log(data + " <- after if in getrandomquiz");
        setQuestions(data.data);
        console.log(questions + " <- questions inside getrandomquiz");
      }
      setMain(false);
    } catch (error) {
      console.log("Error fetching random questions: ", error);
    }
  };

  const getParamQuiz = async () => {
    console.log('fetching param quiz...')
    try {
      const response = await axios.get("https://quizapi.io/api/v1/questions", {
        params: {
          apiKey: api_key,
          tags: tag,
          difficulty: difficulty,
          limit: 10,
        },
      });
      const data = response as ApiResponse;
      console.log(data + ' <- before if in getparamquiz');
      if (data.data) {
        console.log(data) + ' <- after if in getparamquiz';
        setQuestions(data.data);
        console.log(questions + ' <- questions inside getparamquiz');
      }
      setMain(false);
    } catch (error) {
      console.log("Error fetching param questions: ", error);
    }
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    console.log(difficulty);
    e.preventDefault();
    getParamQuiz();
  };

  const isCorrect = (question: Question, answerKey: string): boolean => {
    console.log(question);
    const key = `${answerKey}_correct` as keyof CorrectAnswer;
    return question.correct_answers[key] === "true";
  };

  const renderAnswers = (question: Question) => {
    console.log(question);
    return Object.entries(question.answers)
      .filter(([, answer]) => answer != null)
      .map(([key, answer]) => (
        <Button
          key={key}
          variant="outline"
          onClick={() => setScore(score + (isCorrect(question, key) ? 1 : 0))}
        >
          {answer}
        </Button>
      ));
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }
    setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <>
      <div className="h-screen grid grid-rows-12 grid-cols-12 gap-1 bg-yellow-50">
        <header className="bg-amber-300 col-start-2 col-end-12 px-8 py-2">
          <a href="" onClick={() => setMain(true)}>
            <h1 className="text-4xl font-Neue">Quizzz</h1>
          </a>
          <ul></ul>
        </header>
        <div className="col-start-3 col-end-11 row-start-3 row-end-12 p-8 bg-white/50 text-center border-2 border-slate-800 rounded-lg">
          {main && (
            <div
              id="start"
              className="flex flex-col items-center place-content-around p-0 m-0 h-full"
            >
              <h2 className="text-6xl font-Neue bg-emerald-500 p-4 w-full">
                Test your computer science skills
              </h2>
              <p className="p-text">
                You can start a completely random quiz or select difficulty and
                category
              </p>
              <button
                className="btn-main"
                id="randomQuiz"
                onClick={getRandomQuiz}
              >
                Get Random Quiz
              </button>
              <form onSubmit={formSubmitHandler} className="w-full">
                <div className="section">
                  <label
                    id="categoryLabel"
                    className="p-text"
                    htmlFor="category"
                  >
                    Pick a category{" "}
                  </label>
                  <select
                    id="selectCategory"
                    className="selectCategory "
                    name="category"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option value="HTML">HTML</option>
                    <option value="BASH">BASH</option>
                    <option value="Javascript">Javascript</option>
                    <option value="PHP">PHP</option>
                  </select>
                </div>
                <div className="section">
                  <label className="p-text" htmlFor="difficulty">
                    Pick a difficulty
                  </label>
                  <input
                    className="radio"
                    type="radio"
                    id="easy"
                    name="difficulty"
                    value="easy"
                    checked={difficulty === "easy"}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  <label htmlFor="easy" className="p-text">
                    Easy
                  </label>
                  <input
                    className="radio"
                    type="radio"
                    id="medium"
                    name="difficulty"
                    value="medium"
                    checked={difficulty === "medium"}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  <label htmlFor="medium">Medium</label>
                  <input
                    className="radio"
                    type="radio"
                    id="hard"
                    name="difficulty"
                    value="hard"
                    checked={difficulty === "hard"}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  <label htmlFor="hard">Hard</label>
                </div>
                <button className="btn-main w-full" type="submit">
                  Get Quiz
                </button>
              </form>
            </div>
          )}

          <div id="questions">
            {questions.length > 0 && (
              <div className="card">
                <p>
                  Question {currentQuestion + 1}:{" "}
                  {questions[currentQuestion].question}
                </p>
                <div className="answer">
                  {renderAnswers(questions[currentQuestion])}
                </div>
                {currentQuestion > 0 && (
                  <button className="prev" onClick={previousQuestion}>
                    Prev
                  </button>
                )}
                {currentQuestion < questions.length - 1 && (
                  <button className="next" onClick={nextQuestion}>
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
