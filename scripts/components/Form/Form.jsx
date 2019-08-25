import React, { Component } from "react";
import PropTypes from "prop-types";

import { getCountries } from "./get-data-from-server";
import { log } from "util";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_message: false,
      form_sending: false,
      succsess: false,
      users: [],
      errors: [],
      length: 0
    };

    this.selectCountriesRef = React.createRef();
    this.inputNameRef = React.createRef();
    this.selectCodeRef = React.createRef();
    this.inputNumberRef = React.createRef();
    this.inputEmailRef = React.createRef();
    this.inputPasswordRef = React.createRef();
    this.inputPasswordConfirmRef = React.createRef();
    this.inputCheckboxConfirmRef = React.createRef();
  }

  async componentDidMount() {
    const countries = await getCountries();

    this.setState({
      isLoaded: true,
      countries
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    // if (
    //   this.inputCheckboxConfirmRef.current.checked === true &&                  // simple validation
    //   this.inputNameRef.current.value &&
    //   this.selectCodeRef.current.value &&
    //   this.inputNumberRef.current.value &&
    //   this.inputEmailRef.current.value &&
    //   this.inputPasswordRef.current.value &&
    //   this.inputPasswordConfirmRef.current.value &&
    //   this.selectCountriesRef.current.value &&
    //   this.inputPasswordRef.current.value ===
    //     this.inputPasswordConfirmRef.current.value
    // ) {
    this.setState({
      form_sending: true
    });

    let newUser = {
      name: this.inputNameRef.current.value,
      dialCode: this.selectCodeRef.current.value,
      number: this.inputNumberRef.current.value,
      email: this.inputEmailRef.current.value,
      country: this.selectCountriesRef.current.value,
      password: this.inputPasswordRef.current.value,
      passwordConfirmation: this.inputPasswordConfirmRef.current.value
    };

    fetch("http://127.0.0.1:3002/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.status === "success") {
          this.setState({
            succsess: true,
            form_sending: false,
            users: [...this.state.users, newUser]
          });

          this.inputNameRef.current.value = null;
          this.selectCodeRef.current.value = null;
          this.inputNumberRef.current.value = null;
          this.inputEmailRef.current.value = null;
          this.selectCountriesRef.current.value = null;
          this.inputPasswordRef.current.value = null;
          this.inputPasswordConfirmRef.current.value = null;
        }
        if (response.errors) {
          let errors = response.errors.map((error, index) => {
            return error.param;
          });
          this.setState({
            form_sending: false,
            errors
          });
        }
      })
      .catch(error => console.error("Error:", error));
  };

  checkServerResponse = errors => {
    console.log(errors);
  };

  handlePasswordValidation = () => {
    if (
      this.inputPasswordRef.current.value !==
      this.inputPasswordConfirmRef.current.value
    ) {
      this.setState({
        error_message: true
      });
    }

    if (
      this.inputPasswordRef.current.value ===
      this.inputPasswordConfirmRef.current.value
    ) {
      this.setState({
        error_message: false
      });
    }
  };

  hideSuccsessMessage = () => {
    this.setState({
      succsess: false
    });
  };

  hendleChange = () => {
    this.setState(({ length }) => ({
      length: this.inputPasswordRef.current.value.length
    }));
  };

  render() {
    const {
      error_message,
      isLoaded,
      countries,
      form_sending,
      succsess,
      errors,
      length
    } = this.state;

    const passValidator = error_message
      ? "form__input-not-valid"
      : length > 5
      ? "form__input-valid"
      : "";

    return (
      <main className="main">
        <Succsess_message succsess={succsess} hide={this.hideSuccsessMessage} />
        <div className="container">
          <div className="container__title">Sign up</div>

          <form
            onSubmit={e => this.handleSubmit(e)}
            className="container__form form"
          >
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              className="form__input"
              type="text"
              id="name"
              autoComplete="off"
              placeholder="Your name"
              ref={this.inputNameRef}
              required
            />
            <Error_message error_message={errors.includes("name")} />
            <label className="form__label" htmlFor="phone">
              Phone
            </label>
            <div className="form__wrapper">
              <select
                className="form__select"
                defaultValue="null"
                ref={this.selectCodeRef}
              >
                <option value="null" disabled>
                  Code
                </option>
                {isLoaded && countries.length > 0
                  ? countries.map(country => {
                      return (
                        <option
                          key={country.dial_code + country.name}
                          value={country.dial_code}
                        >
                          {`+ ${country.dial_code}`} &nbsp; &nbsp; &nbsp;
                          &nbsp;&nbsp; {`${country.name}`}
                        </option>
                      );
                    })
                  : null}
              </select>
              <input
                className="form__input"
                type="tel"
                id="phone"
                autoComplete="off"
                placeholder="Phone number"
                ref={this.inputNumberRef}
              />
            </div>
            <Error_message error_message={errors.includes("dialCode")} />
            <label className="form__label" htmlFor="email">
              Email
            </label>
            <input
              className="form__input"
              type="email"
              id="email"
              autoComplete="off"
              placeholder="Email address"
              ref={this.inputEmailRef}
            />
            <Error_message error_message={errors.includes("email")} />
            <label className="form__label" htmlFor="country">
              Country
            </label>
            <div className="form__wrapper">
              <select
                className="form__select"
                id="country"
                placeholder="Select country"
                ref={this.selectCountriesRef}
                defaultValue="null"
              >
                <option className="form-option" value="null" disabled>
                  Select country
                </option>
                {isLoaded && countries.length > 0
                  ? countries.map(country => {
                      return (
                        <option
                          key={country.id + country.name}
                          value={country.country_code}
                        >
                          {country.name} --- {country.country_code}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <Error_message
              error_message={errors.includes("country")}
              message="Invalid value (available only GB, US, UA)"
            />
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className={`form__input ${passValidator}`}
              type="password"
              id="password"
              autoComplete="off"
              placeholder="Password"
              ref={this.inputPasswordRef}
              onChange={this.hendleChange}
            />
            <Error_message error_message={errors.includes("password")} />
            <label className="form__label" htmlFor="password_conf">
              Confirm password
            </label>
            <input
              className={`form__input ${passValidator}`}
              type="password"
              id="password_conf"
              autoComplete="off"
              placeholder="Confirm your password"
              ref={this.inputPasswordConfirmRef}
              onChange={this.handlePasswordValidation}
            />
            <Error_message
              error_message={error_message}
              message={"Your password do not match"}
            />
            <label className="form__label-check" htmlFor="checkbox">
              <input
                className="form-label__input"
                type="checkbox"
                id="checkbox"
                ref={this.inputCheckboxConfirmRef}
              />
              <span className="check__box" />
              Yes, I'd like to recieve the very occasional email with
              information on new services and discounts
            </label>
            <button type="submit" className="form__button">
              {form_sending ? (
                <span className="form__button-icon" />
              ) : (
                "create an account"
              )}
            </button>
            <p className="form__paragraph">
              Already have a 24Slides account?{" "}
              <a className="form__paragraph-link" href="https://24slides.com/">
                Click here
              </a>{" "}
              to log in to your existing account and join a company team
            </p>
            <br /> <br /> <br />
          </form>
          {/* <form action="#!" className="container__form form">
            <label className="form__label" htmlFor="phone">
              Phone
            </label>

            <input  className="form__input1" />

            <div className="dial_list">
              <div className="dial_item">
                <div>123</div>
                <div>Amsterdam</div>
              </div>
              <div className="dial_item">
                <div>456</div>
                <div className="country">Paris</div>
              </div>
              <div className="dial_item">
                <div>987</div>
                <div>London</div>
              </div>
            </div>
          </form> */}
        </div>
      </main>
    );
  }
}

const Error_message = ({ error_message, message }) => {
  return (
    <span
      className={`form__error_message ${
        error_message ? "form__error_message-shown" : ""
      }`}
    >
      {message}
    </span>
  );
};

Error_message.propTypes = {
  error_message: PropTypes.bool.isRequired,
  message: PropTypes.string
};

Error_message.defaultProps = {
  message: "Invalid value"
};

const Succsess_message = ({ succsess, hide, message }) => {
  return (
    <div className={`main__success-message ${succsess ? "show" : ""}`}>
      <div className="message__tittle">
        <span className="message__tittle-icon" />
        Great!
        <span onClick={hide} className="message__tittle-close-icon" />
      </div>
      <div className="message__message">{message}</div>
    </div>
  );
};

Succsess_message.propTypes = {
  succsess: PropTypes.bool.isRequired,
  hide: PropTypes.func
};

Succsess_message.defaultProps = {
  message: "your account has been successfully created."
};

export default Form;
