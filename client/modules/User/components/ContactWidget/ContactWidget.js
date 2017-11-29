import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { sendContactForm } from '../../UserActions';

// Import Style
import styles from './ContactWidget.css';

export class ContactWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {errorMessage: '' };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({errorMessage: ''});
    if (this.state.subject && this.state.email && this.state.content) {
      let data = { email: this.state.email, subject: this.state.subject, text: this.state.content };
      this.props.dispatch(sendContactForm(data, (err)=> {
        if (err) {
          this.setState({errorMessage: this.props.intl.formatMessage({id: "internal_error"})});
        } else {
          this.props.onClose();
        }
      }));
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  };

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input className={styles["email-input"]} onChange={this.onChange} name="email" placeholder={this.props.intl.formatMessage({id: "email_input_placeholder"})} type="email" required="required" value={this.state.email}/>
          <input className={styles["subject-input"]} onChange={this.onChange} name="subject" placeholder={this.props.intl.formatMessage({id: "subject_input_placeholder"})} type="text" required="required" value={this.state.subject}/>
          <textarea placeholder={this.props.intl.formatMessage({id: "content_input_placeholder"})} required="required" rows="8" className={styles["content-input"]} onChange={this.onChange} name="content"></textarea>
          <button className={styles["submit-btn"]} type="submit"><FormattedMessage id="send_contact_action"/></button>
          { this.state.errorMessage && <p className={styles["error-message"]} >{this.state.errorMessage}</p>}
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

export default connect(mapStateToProps)(injectIntl(ContactWidget));
