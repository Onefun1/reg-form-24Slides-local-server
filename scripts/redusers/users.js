import { ADD_USER } from "../constans/constans";

const USERS = [
  {
    name: "John",
    phone: 193932923942,
    email: "john@gmail.com",
    country: "US",
    password: "qwerty",
    password_conf: "qwerty",
    confirm: true
  }
];

const users = (
  state = USERS,
  { name, phone, email, country, password, password_conf, confirm, type }
) => {
  switch (type) {
    case ADD_USER:
      return [
        ...state,
        {
          name,
          phone,
          email,
          country,
          password,
          password_conf,
          confirm
        }
      ];
    default:
      return state;
  }
};
export default users;
