import './Start.css';
import React from 'react';

export default function Start(props) {
    return (
        <div className='hello-box col-12 d-flex justify-content-center align-items-center'>
            <div className='row'>                
                <span className='hello-title text-center'>Quizzical</span>
                <span className='hello-description text-center mb-4'>Choose from the options below</span>
                <div className='hello-btns d-flex justify-content-center align-content-center'>
                    <div className='row'>
                        <div className='hello-btns d-flex justify-content-center align-content-center mb-3'>
                            <button className='start-btn' onClick={props.startQuiz}>Start quiz</button>
                        </div>
                        <div className='hello-btns d-flex justify-content-center align-content-center mb-3'>
                            <button className='start-btn' onClick={props.showSettings}>Settings</button>
                        </div>    
                        <div className='hello-btns d-flex justify-content-center align-content-center'>
                            <button className='start-btn' onClick={props.showStatistics}>Show statistics</button>
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    )
}