import axios from 'axios';

async function authenticate(mode, email, password) {
  const url = `http://167.99.57.236:8084/${mode}`;
  
  try {
    const response = await axios.get(url, {
      params: {
        email: email,
        password: password
      }
    });

    if (response.data.error) {
      // Authentication failed, return null
      return null;
    }

    // Authentication successful, return user token
    return response.data.token;
  } catch (error) {
    return null; // Return null if there's an error
  }
}

export function login(email, password) {
  return authenticate('login', email, password);
}
