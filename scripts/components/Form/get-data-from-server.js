// export const BASE_URL = "http://127.0.0.1:3002/";

export const BASE_URL = "https://reg-form-local-server.herokuapp.com/";

export const getCountriesFromServer = () => {
  return fetch(`${BASE_URL}countries`)
    .then(response => response.json())
    .then(data => data);
};
