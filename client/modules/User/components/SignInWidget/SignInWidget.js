import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { signInRequest, getRatings } from '../../UserActions';

// Import Style
import styles from './SignInWidget.css';

export class SignInWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      let user = { email: this.state.email, password: this.state.password };
      this.props.dispatch(signInRequest(user, this.props.onClose));
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  };

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input className={styles["email-input"]} onChange={this.onChange} name="email" placeholder={this.props.intl.formatMessage({id: "email_input_placeholder"})} type="text" value={this.state.email}/>
          <input className={styles["password-input"]} onChange={this.onChange} name="password" placeholder={this.props.intl.formatMessage({id: "password_input_placeholder"})} type="password" value={this.state.password}/>
          <button className={styles["submit-btn"]} type="submit"><FormattedMessage id="signin_action"/></button>
          <p><FormattedMessage id="or_text"/> <a onClick={this.props.onSignUp}><FormattedMessage id="signup_action"/></a></p>
        </form>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
  };
}

export default connect(mapStateToProps)(injectIntl(SignInWidget));
