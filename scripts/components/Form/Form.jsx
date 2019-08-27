import React, { Component } from "react";

import { connect } from "react-redux";
import { addUser, getCountries } from "../../actions/actionCreator";

import { getCountriesFromServer, BASE_URL } from "./get-data-from-server";
import Error_message from "../Error_message";
import Succsess_message from "../Succsess_message";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_message: false,
      form_sending: false,
      succsess: false,
      errors: [],
      length: 0,
      activeField: ""
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
    const countries = await getCountriesFromServer();

    const { getCountries } = this.props;
    getCountries(countries);

    this.setState({
      isLoaded: true
    });
  }

  handleSubmit = e => {
    e.preventDefault();

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
      passwordConfirmation: this.inputPasswordConfirmRef.current.value,
      confirm: this.inputCheckboxConfirmRef.current.checked
    };

    fetch(`${BASE_URL}register`, {
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
            form_sending: false
          });

          const { addUser } = this.props;

          addUser(
            this.inputNameRef.current.value,
            this.selectCodeRef.current.value,
            this.inputNumberRef.current.value,
            this.inputEmailRef.current.value,
            this.selectCountriesRef.current.value,
            this.inputPasswordRef.current.value,
            this.inputPasswordConfirmRef.current,
            this.inputCheckboxConfirmRef.current.checked
          );

          this.inputNameRef.current.value = null;
          this.selectCodeRef.current.value = null;
          this.inputNumberRef.current.value = null;
          this.inputEmailRef.current.value = null;
          this.selectCountriesRef.current.value = null;
          this.inputPasswordRef.current.value = null;
          this.inputPasswordConfirmRef.current.value = null;
          this.inputCheckboxConfirmRef.current.checked = false;
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

  handleField = ({ target }) => {
    this.setState({
      activeField: target.getAttribute("data-name")
    });
  };

  render() {
    const {
      error_message,
      isLoaded,
      form_sending,
      succsess,
      errors,
      length,
      activeField
    } = this.state;

    const { countries } = this.props;

    const passValidate = error_message
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
            <label
              className={`form__label ${activeField === "name" ? "show" : ""}`}
              htmlFor="name"
            >
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
              onFocus={this.handleField}
              data-name={"name"}
            />
            <Error_message error_message={errors.includes("name")} />
            <label
              className={`form__label ${
                activeField === "phone" || activeField === "code" ? "show" : ""
              }`}
              htmlFor="phone"
            >
              Phone
            </label>
            <div className="form__wrapper">
              <select
                className="form__select"
                defaultValue="null"
                ref={this.selectCodeRef}
                id="code"
                onFocus={this.handleField}
                data-name={"code"}
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
                onFocus={this.handleField}
                data-name={"phone"}
              />
            </div>
            <Error_message error_message={errors.includes("dialCode")} />
            <label
              className={`form__label ${activeField === "email" ? "show" : ""}`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="form__input"
              type="email"
              id="email"
              autoComplete="off"
              placeholder="Email address"
              ref={this.inputEmailRef}
              onFocus={this.handleField}
              data-name={"email"}
            />
            <Error_message error_message={errors.includes("email")} />
            <label
              className={`form__label ${
                activeField === "country" ? "show" : ""
              }`}
              htmlFor="country"
            >
              Country
            </label>
            <div className="form__wrapper">
              <select
                className="form__select"
                id="country"
                placeholder="Select country"
                ref={this.selectCountriesRef}
                defaultValue="null"
                onFocus={this.handleField}
                data-name={"country"}
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
            <label
              className={`form__label ${
                activeField === "password" ? "show" : ""
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`form__input ${passValidate} `}
              type="password"
              id="password"
              autoComplete="off"
              placeholder="Password"
              ref={this.inputPasswordRef}
              onChange={this.hendleChange}
              onFocus={this.handleField}
              data-name={"password"}
            />
            <Error_message error_message={errors.includes("password")} />
            <label
              className={`form__label ${
                activeField === "password_conf" ? "show" : ""
              }`}
              htmlFor="password_conf"
            >
              Confirm password
            </label>
            <input
              className={`form__input ${passValidate}`}
              type="password"
              id="password_conf"
              autoComplete="off"
              placeholder="Confirm your password"
              ref={this.inputPasswordConfirmRef}
              onChange={this.handlePasswordValidation}
              onFocus={this.handleField}
              data-name={"password_conf"}
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
                onFocus={this.handleField}
                data-name={"checkbox"}
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
        </div>
      </main>
    );
  }
}

export default connect(
  state => ({
    users: state.users,
    countries: state.countries
  }),
  { addUser, getCountries }
)(Form);
