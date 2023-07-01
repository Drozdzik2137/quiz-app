import './Main.css';
import React from 'react';
import Start from '../start/Start';
import {nanoid} from 'nanoid';
import Question from '../question/Question';
import Settings from '../settings/Settings';
import Stats from '../stats/Stats';

export default function Main() {
    const [welcome, setWelcome] = React.useState(true);
    const [questions, setQuestions] = React.useState([]);
    const [game, setGame] = React.useState(false);
    const [isAllHeld, setIsAllHeld] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [checked, setChecked] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [settings, setSettings] = React.useState(false);
    const [numOfQuestions, setNumOfQuestions] = React.useState(5);
    const [difficulty, setDifficulty] = React.useState('')
    const [stats, setStats] = React.useState(false);
    const [playAgain, setPlayAgain] = React.useState(false);
    const [time, setTime] = React.useState(0);

    function startQuiz() {
        setTime(0);
        setIsLoading(true);
        setWelcome((prevState) => !prevState);
        setGame((prevState) => !prevState);        
    }

    function newGame() {
        setIsLoading(true);
        setPlayAgain(true);
        setGame(true);
        setChecked(false);
        setScore(0);
        setIsAllHeld(false);
        setTime(0);
    }

    function showSettings() {
        setWelcome((prevState) => !prevState);
        setSettings((prevState) => !prevState);

    }

    function showStats() {
        setWelcome((prevState) => !prevState);
        setStats((prevState) => !prevState);
    }

    React.useEffect(() => {
        if((!welcome && !settings && !stats && game) || (playAgain && game)){
            const getQuestions = async() => {
                try {
                    const res = await fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}&difficulty=${difficulty}`);                    
                    if(!res.ok){
                        const message = `An error has occured: ${res.status}`;
                        throw new Error(message);
                    }
                    const data = await res.json();
                    // await new Promise(resolve => setTimeout(resolve, 500));
                    return data;
                }catch(err){
                    setIsLoading(false);
                }
            }
            getQuestions().then(questions => {
                const questionsArray = questions.results;
                const len = questions.results.length;
                if(len > 0){
                    const questionsList = questionsArray.map((question) => {
                        return {
                            id: nanoid(),
                            question: question.question,
                            correctAnswer: question.correct_answer,
                            answers: answersSetting(
                                shuffleArray([...question.incorrect_answers, question.correct_answer]),
                                question.correct_answer
                            ),
                        }
                    });                    
                    setQuestions(questionsList);
                    setIsLoading(false); 
                    return questionsList;
                }else{
                    setQuestions([]);
                    setIsLoading(false); 
                    return [];
                }           
            });       
        }else{
            setIsLoading(false); 
            return
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welcome, game, playAgain])


    function answersSetting(concatAnswers, correctAnswer){
        return concatAnswers.map((answer) => {
            return {
                id: nanoid(),
                isHeld: false,
                answer: answer,
                correct: answer === correctAnswer ? true : false,
                heldCorrect: false,
                heldIncorrect: false,
                checked: false
            }
        })
    }

    function shuffleArray(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const questionInstance = questions.map((question) => {
        return (
            <Question 
                key={question.id}
                id={question.id}
                question={question.question}
                answers={question.answers}
                holdAnswer={holdAnswer}                
            />
        )
    })

    function holdAnswer(answerId, questionId) {
        setQuestions((prevState) => 
            prevState.map((question) => {
                if(question.id === questionId){
                    const answers = question.answers.map((answer) => {
                        if(answer.id === answerId || answer.isHeld){
                            return {
                                ...answer,
                                isHeld: !answer.isHeld
                            }
                        }else{
                            return answer
                        }
                    });
                    return {
                        ...question,
                        answers: answers
                    }
                }else {
                    return question;
                }
            })
        )
    }

    React.useEffect(() => {
        let answersHeld = [];
        questions.map((question) => {
            question.answers.map((answer) => {
                if(answer.isHeld){
                    answersHeld.push(answer.id);

                    if(answersHeld.length === numOfQuestions){
                        setIsAllHeld(true);
                    }else{
                        setIsAllHeld(false)
                    }
                }
                return answer;
            })
            return question;
        })
        if(answersHeld.length < numOfQuestions){
            setIsAllHeld(false)
            setChecked(false);
        }
    }, [questions, numOfQuestions])

    function checkAnswers() {
        setQuestions((prevState) => 
            prevState.map((question) => {
                const checkedAnswers = question.answers.map((answer) => {
                    if(answer.correct && answer.isHeld){
                        setScore((prevState) => prevState + 1);
                        return {
                            ...answer,
                            heldCorrect: true,
                            checked: true 
                        }
                    }else if(!answer.correct && answer.isHeld){
                        return {
                            ...answer,
                            heldIncorrect: true,
                            checked: true
                        }
                    }else{
                        // No selected answer (there should be no such situation)
                        return {
                            ...answer,
                            checked: true
                        }
                    }
                });
                return {
                    ...question,
                    answers: checkedAnswers
                }                
            })
        );
        setChecked(true);
        setGame(false);
        setPlayAgain(false);
    }

    function changeGameSettings(num, diff) {
        setNumOfQuestions(num);
        setDifficulty(diff);
    }


    React.useEffect(() => {
        let intervalId;
        if (game) {
          intervalId = setInterval(() => setTime(time + 10), 10);
        }
        return () => clearInterval(intervalId);
      }, [game, time]);

      React.useEffect(() => {
        if(checked){
            const saveDataToLocalStorage = () => {
                const oldData = JSON.parse(localStorage.getItem('quiz'));
                if(oldData){
                    const quizGame = { 
                        lastGame: 
                        {
                            time: time, 
                            timePerQuestion: (time/numOfQuestions), 
                            answers: numOfQuestions, 
                            correct: score
                        }, 
                        allGames:
                        {
                            time: oldData.allGames.time + time, 
                            timePerQuestion: oldData.allGames.timePerQuestion + (time/numOfQuestions), 
                            answers: oldData.allGames.answers + numOfQuestions, 
                            correct: oldData.allGames.correct + score
                        }
                    };
                    localStorage.setItem('quiz', JSON.stringify(quizGame));
                }else{
                    const quizGame = { 
                        lastGame: 
                        {
                            time: time, 
                            timePerQuestion: (time/numOfQuestions), 
                            answers: numOfQuestions, 
                            correct: score
                        }, 
                        allGames:
                        {
                            time: time, 
                            timePerQuestion: (time/numOfQuestions), 
                            answers: numOfQuestions, 
                            correct: score
                        }
                    };
                    localStorage.setItem('quiz', JSON.stringify(quizGame));
                }      
            }
            saveDataToLocalStorage();
        }else{
            return
        }
      }, [score, game, checked, time, numOfQuestions])


    return (
        <div className='main-content col-12 d-flex justify-content-center align-items-center'>
            {isLoading ? (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            ) : (
            <div >
                {/* {welcome ? 
                    ( <Start startQuiz={startQuiz} showSettings={showSettings} showStatistics={showStats}/>) : 
                    ( <div className='quiz-content my-5'>
                        <div className='row'>                        
                            {questionInstance}
                        </div>
                        <div className='btns-container d-flex justify-content-center align-content-center mt-4'>
                            {checked ? 
                                (
                                    <div className='game-summary col-12 d-flex justify-content-center align-items-center'>
                                        <div className='row d-flex justify-content-center align-items-center'>
                                            <span className='game-score col-auto me-md-4 mb-4 mb-md-0 w-md-100'>You answered {score}/5 questions correctly</span>
                                            <button className='new-game-btn col-auto w-md-100' onClick={newGame}>Play again</button>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='col-12 d-flex justify-content-center align-items-center'>
                                        <div className='row d-flex justify-content-center align-items-center'>
                                            <button className='back-btn col-auto px-3 me-md-4 mb-4 mb-md-0 w-md-100' onClick={() => {startQuiz()}}>Wróć</button>
                                            <button className='check-btn col-auto px-3 w-md-100' disabled={!isAllHeld} onClick={checkAnswers}>{!isAllHeld ? "Zaznacz wszystkie odpowiedzi" : "Sprawdź"}</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>) 
                } */}

                {(() => {
                    if(welcome){
                        return (
                            <Start startQuiz={startQuiz} showSettings={showSettings} showStatistics={showStats}/>
                        )
                    }else if(settings){
                        return (
                            <Settings showSettings={showSettings} numOfQuestions={numOfQuestions} difficulty={difficulty} changeGameSettings={changeGameSettings}/>
                        )
                    }else if(stats){
                        return (
                            <Stats showStats={showStats}/>
                        )
                    }else if(game || (!game && checked)){
                        return (
                            <div className='quiz-content my-5'>
                                <div className='row'>                        
                                    {questionInstance}
                                </div>
                                <div className='btns-container d-flex justify-content-center align-content-center mt-4'>
                                    {checked ? 
                                        (
                                            <div className='game-summary col-12 d-flex justify-content-center align-items-center'>
                                                <div className='row d-flex justify-content-center align-items-center'>
                                                    <span className='game-score col-auto me-md-4 mb-4 mb-md-0 w-md-100'>You answered {score}/{numOfQuestions} questions correctly</span>
                                                    <button className='new-game-btn col-auto w-md-100' onClick={newGame}>Play again</button>
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className='col-12 d-flex justify-content-center align-items-center'>
                                                <div className='row d-flex justify-content-center align-items-center'>
                                                    <button className='back-btn col-auto px-3 me-md-4 mb-4 mb-md-0 w-md-100' onClick={() => {startQuiz()}}>Back</button>
                                                    <button className='check-btn col-auto px-3 w-md-100' disabled={!isAllHeld} onClick={checkAnswers}>{!isAllHeld ? "Mark all answers" : "Check answers"}</button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }else{
                        <div className='error col-12 d-flex justify-content-center align-items-center'>
                            <div className='row d-flex justify-content-center align-items-center'>
                                <p>Coś poszło nie tak...</p>
                                <button className='back-btn col-auto px-3 me-md-4 mb-4 mb-md-0 w-md-100' onClick={() => {startQuiz()}}>Back</button>
                            </div>
                        </div>
                    }
                })()}
            </div>
            )}
      </div>

    )
}