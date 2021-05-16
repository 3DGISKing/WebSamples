import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import ErrorDialog from './../components/ErrorDialog'
import {Redirect} from 'react-router-dom'

import {tryLogin} from './../helpers/Helper'

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
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        textTransform: "none"
    },
    paperForm: {
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(3),
            padding: theme.spacing(2),
        },
    },

    paperBottomTitle: {
        width: '100%', // Fix IE 11 issue.
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2),
        },
    },
});

class Login extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {
            userName: null,
            password: null,
            errorDialogOpen: false,
            errorMessage: "",
            loginSuccess: null
        };
    }

    handleTextFieldUserNameChange = (event) => {
        this.setState({userName: event.target.value});
    };

    handleTextFieldPasswordChange = (event) => {
        this.setState({password: event.target.value});
    };

    validate = () => {
        if (this.state.userName == null) {
            this.setState({
                errorMessage: "Please input user name!",
                errorDialogOpen: true
            });

            return false;
        }

        if (this.state.password == null) {
            this.setState({
                errorMessage: "Please input password!",
                errorDialogOpen: true
            });

            return false;
        }

        return true;
    };

    handleSubmit = (event) => {
        event.preventDefault();

        if (!this.validate())
            return;

        let self = this;

        let successCallback = function() {
            self.setState({loginSuccess: true});
        };

        let failedCallback = function(message) {
            self.setState({
                errorDialogOpen: true,
                errorMessage: message
            });
        };

        tryLogin(this.state.userName, this.state.password, successCallback, failedCallback);
    };

    handleErrorDialogClose = () => {
        this.setState({errorDialogOpen: false});
    };

    signupLinkClicked = () => {
        this.props.history.push("join");
    };

    goToHomeLinkClicked = () => {
        this.props.history.push("/");
    };

    render() {
        const {classes} = this.props;

        if (this.state.loginSuccess)
            return <Redirect to='/'/>;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Sign in to Fuel Pricing
                    </Typography>

                    <Paper className={classes.paperForm}>
                        <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                name="userName"
                                autoFocus
                                autoComplete=""
                                onChange={this.handleTextFieldUserNameChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.handleTextFieldPasswordChange}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>

                        </form>
                    </Paper>

                    <Paper className={classes.paperBottomTitle}>
                        <Grid container justify="center">
                            <Grid item>
                                Don't have an account?
                                <Link href="#" variant="body2" onClick={this.signupLinkClicked}>
                                    {" Sign Up"}
                                </Link>
                                &nbsp; &nbsp;
                                <Link href="#" variant="body2" onClick={this.goToHomeLinkClicked}>
                                    {" Go to Home"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                    <ErrorDialog open={this.state.errorDialogOpen} handleClose={this.handleErrorDialogClose}
                                 message={this.state.errorMessage}/>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Login);
