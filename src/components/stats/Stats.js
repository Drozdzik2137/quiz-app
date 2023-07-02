import './Stats.css';
import React from 'react';

export default function Stats(props) {
    const [userStats, setUserStats] = React.useState(() => {
        const data = JSON.parse(localStorage.getItem('quiz'));
        return data;
    });

    function msToTime(s) {
        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
          z = z || 2;
          return ('00' + n).slice(-z);
        }
    
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        if(ms > 0 && secs < 1){
          return '.' + ms + ' ms';
        }else if(secs > 0 && mins < 1){
          return secs + 's ' + ms/10;
        }else if(mins > 0 && hrs < 1){
          return mins +'m ' + pad(secs) + 's';
        }else{
          return hrs + 'h ' +  mins + 'm ' + secs + 's';
        }
    }

    React.useEffect(() => {
        const handleStorageChange = (event) => {
          if (event.key === 'quiz') {
            const newGameInfo = JSON.parse(event.newValue);
            setUserStats(newGameInfo);
          }
        };
      
        // Rejestrujemy nasłuchiwanie zdarzenia storage
        window.addEventListener('storage', handleStorageChange);
      
        // Czyszczenie nasłuchiwania po zakończeniu
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    return (
        <div className='stats-container col-12 d-flex justify-content-center align-items-center'>
            <div className='row d-flex justify-content-center align-items-center'>                
                <span className='stats-title text-center'>Game stats</span>
                <span className='stats-description text-center mb-4'>Check your statistics below</span>
                <div className='stats-info d-flex justify-content-center align-items-center mb-4'>
                    <div className='row'>
                        <div className='last-game mb-4'>
                            <div className='row'>
                              <span className='last-game-title text-center mb-2'>Last game stats</span>
                                <span>Number of questions: <b>{userStats?.lastGame?.answers ? userStats?.lastGame?.answers : 'No data'}</b></span>
                                <span>Correct answers: <b>{userStats?.lastGame?.correct ? userStats?.lastGame?.correct : 'No data'}</b></span>
                                <span>% of correct answers: <b>{userStats?.lastGame?.correct && userStats?.lastGame?.answers ? (userStats?.lastGame?.correct / userStats?.lastGame?.answers) * 100 + ' %' : 'No data'}</b></span>
                                <span>Time: <b>{userStats?.lastGame?.time ? msToTime(userStats?.lastGame?.time) : 'No data'}</b></span>
                                <span>Time per question: <b>{userStats?.lastGame?.timePerQuestion ? msToTime(userStats?.lastGame?.timePerQuestion) : 'No data'}</b></span>
                            </div>
                        </div>
                        <div className='all-games mb-3'>
                            <div className='row'>
                                <span className='all-games-title text-center mb-2'>All games stats</span>
                                <span>Number of questions: <b>{userStats?.allGames?.answers ? userStats?.allGames?.answers: 'No data'}</b></span>
                                <span>Correct answers: <b>{userStats?.allGames?.correct ? userStats?.allGames?.correct: 'No data'}</b></span>
                                <span>% of correct answers: <b>{(userStats?.allGames?.correct/userStats?.allGames?.answers) * 100 ? ((userStats.allGames?.correct/userStats.allGames?.answers) * 100) + ' %': 'No data'} </b></span>      
                                <span>Time per question: <b>{userStats?.allGames?.timePerQuestion ? msToTime(userStats?.allGames?.timePerQuestion) : 'No data'}</b></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='stats-btns d-flex justify-content-center align-content-center'>
                    <div className='row'>
                        <div className='d-flex justify-content-center align-content-center mb-3'>
                            <button className='return-btn' onClick={props.showStats}>Back</button>  
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    )
}