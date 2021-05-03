import { BehaviorSubject } from 'rxjs';
import handleResponse from '../helper/HandleResponse.js';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(), //test fail
    get currentUserValue () { return currentUserSubject.value }
};

function  login(email, password) {
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },    
        body: JSON.stringify({ email, password }),
    };

    return fetch("http://13.212.33.166/api/login", requestOptions)
        .then(handleResponse)
        .then(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

export default authenticationService;