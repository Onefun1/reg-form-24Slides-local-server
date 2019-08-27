import { GET_COUNTRIES } from "../constans/constans";

const countries = (state = [], { type, countries }) => {
  switch (type) {
    case GET_COUNTRIES:
      return countries;
    default:
      return state;
  }
};
export default countries;
