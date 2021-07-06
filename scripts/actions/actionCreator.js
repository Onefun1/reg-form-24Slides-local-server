import { ADD_USER, GET_COUNTRIES } from "../constans/constans";

export const addUser = (
  name,
  phone,
  email,
  country,
  password,
  password_conf,
  confirm
) => ({
  type: ADD_USER,
  name,
  phone,
  email,
  country,
  password,
  password_conf,
  confirm
});

export const getCountries = countries => ({
  type: GET_COUNTRIES,
  countries
});
