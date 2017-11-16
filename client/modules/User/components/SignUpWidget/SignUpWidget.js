import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { signUpRequest } from '../../UserActions';

// Import Style
import styles from './SignUpWidget.css';

export class SignUpWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMessage: '' }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({errorMessage: ''});
    if (this.state.email && this.state.password && this.state.password_repeat) {
      if (this.state.password == this.state.password_repeat) {
        let user = {email: this.state.email, password: this.state.password};
        this.props.dispatch(signUpRequest(user, (err)=> {
          if (err) {
            this.setState({errorMessage: this.props.intl.formatMessage({id: "user_exists"})});
          } else {
            this.props.onClose();
          }
        }));
      } else {
        this.setState({errorMessage: this.props.intl.formatMessage({id: "password_not_equal"})});
      }
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
          <input className={styles["password-repeat-input"]} onChange={this.onChange} name="password_repeat" placeholder={this.props.intl.formatMessage({id: "password_repeat_input_placeholder"})} type="password" value={this.state.password_repeat}/>
          <button className={styles["submit-btn"]} type="submit"><FormattedMessage id="signup_action"/></button>
          { this.state.errorMessage && <p className={styles["error-message"]} >{this.state.errorMessage}</p>}
          <p><FormattedMessage id="already_have_account"/> <a onClick={this.props.onSignIn}><FormattedMessage id="signin_action"/></a></p>
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

export default connect(mapStateToProps)(injectIntl(SignUpWidget));
