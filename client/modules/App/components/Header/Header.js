import React, {PropTypes, Component} from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import Flag from 'react-flags';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import SignUpWidget from '../../../User/components/SignUpWidget/SignUpWidget';
import SignInWidget from '../../../User/components/SignInWidget/SignInWidget';
import {signOut} from '../../../User/UserActions';

// Import Style
import styles from './Header.css';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {isShowingModal: false, modal: ''};
  }

  handleClick = (modal) => {
    this.setState({isShowingModal: true, modal: modal});
  };

  handleClose = () => this.setState({isShowingModal: false});

  onSignOut = () => {
    this.props.dispatch(signOut())
  };

  render() {
    const languageNodes = this.props.languages.map(
      lang => {
        //костыль
        let icon = '';
        if (lang == 'en') {
          icon = 'GB'
        } else if (lang == 'uk') {
          icon = 'UA';
        } else {
          icon = lang.toUpperCase();
        }
        return (
          <li key={lang} onClick={() => this.props.switchLanguage(lang)}
              className={lang === this.props.intl.locale ? styles.selected : ''}>
            <Flag
              name={icon}
            />
          </li>
        )
      }
    );

    return (
      <div className={styles.header}>
        <div className={styles['logo']}>
          <a href="/">
            <span className={styles['full-project-name']}>
              <FormattedMessage id="project_name_long"/>
            </span>
            <span className={styles['short-project-name']}>
              <FormattedMessage id="project_name_short"/>
            </span>
          </a>
        </div>
        <div className={styles['language-switcher']}>
          <ul>
            {languageNodes}
          </ul>
        </div>
        <div className={styles['user-bar']}>
          {!this.props.isLoggedIn &&
          <div><a href="#" onClick={this.handleClick.bind(this, 'signin')}><FormattedMessage id="signin_action"/></a>
             <FormattedMessage id="or_text"/><a href="#"
                                                onClick={this.handleClick.bind(this, 'signup')}><FormattedMessage
              id="signup_action"/></a></div>}
          {this.props.isLoggedIn && <a href="#" onClick={this.onSignOut.bind(this)}><FormattedMessage id="signout_action"/></a>}
        </div>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={this.handleClose}>
            <ModalDialog onClose={this.handleClose}>
              {this.state.modal === "signin" && <SignInWidget onClose={this.handleClose.bind(this)}/>}
              {this.state.modal === "signup" && <SignUpWidget onClose={this.handleClose.bind(this)}/>}
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  switchLanguage: PropTypes.func.isRequired,
  languages: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(Header);
