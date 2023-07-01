import './Answer.css'
import React from 'react'

export default function Answer(props) {
    let answerStyle = {};
    if(props.checked && props.heldCorrect){
        answerStyle = {
            backgroundColor: "#94d7a2",
            border: "2px solid #1eb300",
        };
    }else if(props.checked && props.heldIncorrect){
        answerStyle = {
            backgroundColor: "#f7dadc",
            border: "2px solid red"
        };
    }else if(props.checked && props.correct){
        answerStyle = {
            backgroundColor: "#94d7a2",
            border: "2px solid #94d7a2",
        };
    }else {
        answerStyle = {
            backgroundColor: props.isHeld ? "#D6DBF5" : "white",
            border: props.isHeld ? "2px solid #4d5b9e" : "2px solid #D6DBF5",
        };
    }
    return (
        <div className='question-anserws pb-4'>
            <button className="answer py-1 px-3 me-3" style={answerStyle} 
                    dangerouslySetInnerHTML={{ __html: props.answer }} 
                    onClick={props.holdAnswer} 
                    disabled={props.checked && !props.heldCorrect && !props.heldIncorrect}>
            </button>
        </div>
    )
}