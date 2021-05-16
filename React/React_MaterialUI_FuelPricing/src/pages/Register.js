import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Appbar from './../components/Appbar'
import ErrorDialog from './../components/ErrorDialog'
import { Redirect } from 'react-router-dom'
import {existsSavedLoginInfo, tryLoginWithSavedLoginInfo, signUp} from './../helpers/Helper'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    textTransform: "none",
    margin: theme.spacing(3, 0, 2),
  },
});

class Register extends React.Component {
  constructor(prop){
    super(prop);

    this.state = {
      signupSuccess: false,
      determinedLogin: false,
      userName: null,
      password: null,
      errorDialogOpen: false,
      errorMessage: ""
    }
  }
  
  handleErrorDialogClose = () => {
    this.setState({errorDialogOpen: false})
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if(!this.validate())
      return;

    let self = this;

    let successCallback = function() {
      self.setState({signupSuccess: true});
    };

    let failedCallback = function(message) {
      self.setState({
        errorDialogOpen: true,
        errorMessage: message
      });
    };

   signUp(this.state.userName, this.state.password, successCallback, failedCallback);
  };

  validate = () => {
    if(this.state.userName == null){
      this.setState({
        errorMessage: "Please input user name!",
        errorDialogOpen: true,
        signupSuccess: false
      });

      return false;
    }

    if(this.state.password == null){
      this.setState({
        errorMessage: "Please input password!",
        errorDialogOpen: true
        });

      return false;
    }

    return true;
  };

  handleTextFieldUserNameChange = (event) => {
    this.setState({userName: event.target.value});
  };

  handleTextFieldPasswordChange = (event) => {
    this.setState({password: event.target.value});
  };

  componentDidMount(){
    if(!existsSavedLoginInfo()) {
      this.setState({determinedLogin: true});
      this.setState({logined: false});
      return;
    }

    let self = this;

    let successCallback = function() {
      self.setState({
        determinedLogin: true,
        logined: true
      });
    };

    let failedCallback = function(message) {
        self.setState({
            determinedLogin: true, 
            logined: false,
            errorDialogOpen: true,
            errorMessage: message
        });
    };

    tryLoginWithSavedLoginInfo(successCallback, failedCallback);
  }

  render() {
    if(this.state.determinedLogin === false) {
      return (
        <div>Loading</div>
      );
    }

    if (this.state.logined) {
      return <Redirect to='/'/>;
    }

    const { classes } = this.props;

    if (this.state.signupSuccess) {
      return <Redirect to='/'/>;
    }

    return(
      <div>
        <Appbar activeButton = "signup"/>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h4">
              Join Fuel Pricing
            </Typography>

            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="email"
                onChange = {this.handleTextFieldUserNameChange}
                autoFocus
                autoComplete = ""
              />

              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange = {this.handleTextFieldPasswordChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create an account
              </Button>
            </form>
            <ErrorDialog open = {this.state.errorDialogOpen} handleClose = {this.handleErrorDialogClose} message = {this.state.errorMessage} />
          </div>

      </Container>
    </div>
    )
  }
} 

export default withStyles(styles, { withTheme: true })(Register);
