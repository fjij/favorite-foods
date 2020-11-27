import axios from 'axios';
import qs from 'qs';

export async function getFood(page, limit) {
  try {
    const response = await axios.get('/api/food');
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't get food :(");
  }
}

export async function getAccount(username) {
  try {
    const response = await axios.get(`/api/account/${username}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't get user :(");
  }
}

export async function register(username, password) {
  try {
    const response = await axios.post(
      `/register`,
      qs.stringify({ username, password }),
      { headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    if (e.response) {
      throw {errors: e.response.data.errors};
    } else {
      throw new Error("Couldn't create account :(");
    }
  }
}

export async function login(username, password) {
  try {
    const response = await axios.post(
      `/login`,
      qs.stringify({ username, password }),
      { headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't login :(");
  }
}

export async function saveFood(name) {
  try {
    const response = await axios.post(
      `/api/account`,
      qs.stringify({ name }),
      { headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    if (e.response) {
      throw {errors: e.response.data.errors};
    } else {
      throw new Error("Couldn't save food :(");
    }
  }
}
