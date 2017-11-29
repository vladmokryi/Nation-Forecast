import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { signInRequest, getRatings } from '../../UserActions';

// Import Style
import styles from './SignInWidget.css';

export class SignInWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {errorMessage: '' };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({errorMessage: ''});
    if (this.state.email && this.state.password) {
      let user = { email: this.state.email, password: this.state.password };
      this.props.dispatch(signInRequest(user, (err)=> {
        if (err) {
          this.setState({errorMessage: this.props.intl.formatMessage({id: "invalid_credential"})});
        } else {
          this.props.onClose();
        }
      }));
    } else {
      this.setState({errorMessage: this.props.intl.formatMessage({id: "invalid_credential"})});
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  };

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input required="required" className={styles["email-input"]} onChange={this.onChange} name="email" placeholder={this.props.intl.formatMessage({id: "email_input_placeholder"})} type="text" value={this.state.email}/>
          <input required="required" className={styles["password-input"]} onChange={this.onChange} name="password" placeholder={this.props.intl.formatMessage({id: "password_input_placeholder"})} type="password" value={this.state.password}/>
          <button className={styles["submit-btn"]} type="submit"><FormattedMessage id="signin_action"/></button>
          { this.state.errorMessage && <p className={styles["error-message"]} >{this.state.errorMessage}</p>}
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
