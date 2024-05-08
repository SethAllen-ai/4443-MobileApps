import axios from 'axios';

async function authenticate(mode, firstname, lastname, email, user, password) {
  const url = `http://167.99.57.236:8084/${mode}`;
  
  await axios.post(url, {
    first: firstname,
    last: lastname,
    email: email,
    user: user,
    password: password
  });
}

export function createUser(first, last, email, user, password) {
  return authenticate('register', first, last, email, user, password);
}