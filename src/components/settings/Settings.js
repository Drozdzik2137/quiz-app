import './Settings.css';
import React from 'react';
import Select from 'react-select';

export default function Settings(props) {
    const [numOfQuestions, setNumOfQuestions] = React.useState(props.numOfQuestions);
    const [difficulty, setDifficulty] = React.useState(props.difficulty);

    const diffOptions = [
        { value: '', label: 'Any Difficulty' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ]

    const numOptions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ]
    
    // const checkQuestionsValue = event => {
    //     let value = event.target.value;
    //     if(value > 20){
    //         value = 20;
    //     }else if(value < 5){
    //         value = 5
    //     }
    //     setNumOfQuestions(value);
    // }

    React.useEffect(() => {
        if(typeof(difficulty) !== typeof('')){
            setDifficulty(difficulty.value);
        }
        if(typeof(numOfQuestions) !== typeof(1)){
            setNumOfQuestions(numOfQuestions.value);
        }
    }, [difficulty, numOfQuestions])

    function changeGameSettings() {
        props.showSettings();
        props.changeGameSettings(numOfQuestions, difficulty);
    }

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          border: state.isFocused ? '3px solid #4d5b9e' : '3px solid #ccc',
          '&:hover': {
            border: '3px solid #4d5b9e',
          },
          borderRadius: 8,
          cursor: 'pointer',
        }),
        option: (provided, state) => ({
            ...provided,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#4d5b9e',
              color: 'white',
            },
            background: state.isSelected ? '#4d5b9e' : 'transparent',
            color: state.isSelected ? 'white' : 'black',
          }),
        singleValue: (provided) => ({
        ...provided,
        color: 'black'
        }),
      };
    
    return (
        <div className='settings-container col-12 d-flex justify-content-center align-items-center'>
            <div className='row'>                
                <span className='settings-title text-center'>Game settings</span>
                <span className='settings-description text-center mb-4'>Choose from the options below</span>
                <div className='settings-btns col-12 d-flex justify-content-center align-content-center'>
                    <div className='row'>
                        <div className="option-content col-12 d-flex justify-content-center align-content-center mb-4 p-0 ">
                            <div className='row d-flex justify-content-center'>
                                <label className='option-label text-start mb-2 '>Difficulty:</label>
                                <Select options={diffOptions} styles={customStyles} className='option-select' value={diffOptions.find(option => option.value === difficulty)} onChange={setDifficulty}/>
                            </div>
                        </div>
                        <div className="option-content col-12 d-flex justify-content-center align-content-center mb-4 p-0">
                            <div className='row d-flex justify-content-center'>
                                <label className='option-label text-start mb-2'>Number of questions:</label>
                                {/* <input type="number" className="form-control option-input" placeholder="From 5 to 20 questions" value={numOfQuestions} min='5' max='20' maxLength={2} onChange={checkQuestionsValue}/> */}
                                <Select options={numOptions} styles={customStyles} className='option-select' value={numOptions.find(option => option.value === numOfQuestions)} onChange={setNumOfQuestions}/>
                            </div>
                        </div>
                        <div className='col-12 d-flex justify-content-center align-content-center mb-3'>
                            <button className='option-btn' onClick={changeGameSettings}>Save</button>  
                        </div>       
                        <div className='col-12 d-flex justify-content-center align-content-center mb-3'>
                            <button className='return-btn' onClick={props.showSettings}>Back</button>  
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    )
}