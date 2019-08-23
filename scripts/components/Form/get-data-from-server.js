const BASE_URL = "http://127.0.0.1:3002/";

export const getCountries = () => {
  return fetch(`${BASE_URL}countries`)
    .then(response => response.json())
    .then(data => data);
};
