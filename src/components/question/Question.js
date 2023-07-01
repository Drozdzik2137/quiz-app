import Answer from '../answer/Answer';
import './Question.css';
import React from 'react';

export default function Question(props) {
    function holdAnswer(id) {
        props.holdAnswer(id, props.id);
    }

    const answerInstance = props.answers.map(answer => {
        return (
            <Answer 
                key={answer.id}
                id={answer.id}
                answer={answer.answer}
                checked={answer.checked}
                correct={answer.correct}
                heldCorrect={answer.heldCorrect}
                heldIncorrect={answer.heldIncorrect}
                isHeld={answer.isHeld}
                holdAnswer={() => holdAnswer(answer.id)}
            />
        )
    })

    return (
        <div className='single-question mb-3'>
            <div className='row'>
                <div className='question-head mb-2'>
                    <span className='question-title' dangerouslySetInnerHTML={{ __html: props.question }}></span>
                </div>
                <div className='question-body d-flex'>
                    <div className='row'>
                        {answerInstance}
                    </div>
                </div>
            </div>
        </div>
    )
}