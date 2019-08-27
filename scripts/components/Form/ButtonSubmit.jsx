import React from "react";
import PropTypes from "prop-types";

const ButtonSubmit = ({ form_sending, isLoaded, message }) => {
  return (
    <button className="form__button">
      {form_sending || !isLoaded ? (
        <span className="form__button-icon" />
      ) : (
        message
      )}
    </button>
  );
};

ButtonSubmit.propTypes = {
  form_sending: PropTypes.bool,
  isLoaded: PropTypes.bool,
  message: PropTypes.string
};

ButtonSubmit.defaultProps = {
  message: "create an account"
};

export default ButtonSubmit;
