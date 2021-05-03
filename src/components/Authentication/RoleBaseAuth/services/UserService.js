import authHeader from '../helper/AuthHeader.js';
import handleResponse from '../helper/HandleResponse.js';

 const userService = {
    getAll,
    getById
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`localhost:8080/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`{config.apiUrl$}/users/${id}`, requestOptions).then(handleResponse);
}

export default userService;