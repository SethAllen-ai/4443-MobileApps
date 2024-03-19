import axios from 'axios';

async function authenticate(email, password) {
  const urldb = `mongosh "mongodb+srv://dgc.psxjwi1.mongodb.net/" --apiVersion 1 --username sballen0425`;

  const responsedb = await axios.post(urldb, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = responsedb.data.idToken;

  return token;
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password);
}