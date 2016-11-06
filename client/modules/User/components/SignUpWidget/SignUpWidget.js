import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

// Import Style
import styles from './SignUpWidget.css';

export class SignUpWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input className={styles["email-input"]} placeholder={this.props.intl.formatMessage({id: "email_input_placeholder"})} type="text" value={this.state.email}/>
          <input className={styles["password-input"]} placeholder={this.props.intl.formatMessage({id: "password_input_placeholder"})} type="password" value={this.state.password}/>
          <input className={styles["password-repeat-input"]} placeholder={this.props.intl.formatMessage({id: "password_repeat_input_placeholder"})} type="password" value={this.state.password}/>
          <button className={styles["submit-btn"]} type="submit"><FormattedMessage id="signup_action"/></button>
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
