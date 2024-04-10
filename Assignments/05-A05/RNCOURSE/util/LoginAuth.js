import axios from 'axios';

async function authenticate(mode, email, password) {
  const url = `http://167.99.57.236:8084/${mode}`;
  
  try {
    const response = await axios.get(url);

    console.log(response);

    if (response.data.length === 0) {
      // No users found
      return null;
    }

    // Iterate over all users
    for (const user of response.data) {
      if (user.password === password && user.email === email) {
        // If email and password match, return the token
        const token = user.token;
        return token;
      }
    }

    // If no matching user is found, return null
    return null;
  } catch (error) {
    return null; // Return null if there's an error
  }
}

export function login(email, password) {
  return authenticate('users', email, password);
}
