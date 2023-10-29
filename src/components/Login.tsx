import 'react';
import './Login.css'

export const Login = () => {
    return (
        <div className='login-container'>
            <button className='create-game-button'>
                Create Game
            </button>
            <div className='join-game-container'>
                <div className='join-game-list'>
                </div>
            </div>
        </div>
    );
}