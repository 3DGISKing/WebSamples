import React from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Appbar from './../components/Appbar'
import {Redirect} from 'react-router-dom'
import ErrorDialog from './../components/ErrorDialog'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';

import {existsSavedLoginInfo, tryLoginWithSavedLoginInfo, getUserInfo, setUserInfo, getLoginUserName} from './../helpers/Helper'

const USAStates = require('./../data/usa_states_hash.json');

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            'Roboto'
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    select: {
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
    }
});

class Profile extends React.Component {
    constructor(prop) {
        super(prop);

        let userInfo = getUserInfo();

        if(userInfo === null)
            userInfo = {};

        this.state = {
            determinedLogin: false,
            errorDialogOpen: false,
            submitFormOpen: false,
            fullName: userInfo.fullName,
            address1: userInfo.address1,
            address2: userInfo.address2,
            city: userInfo.city,
            state: userInfo.state,
            zipCode: userInfo.zipCode,
        };

        this.state.uSAStates = [];

        for(let stateKey in USAStates){
            this.state.uSAStates.push({
                code: stateKey,
                label: USAStates[stateKey]
            });
        }
    }

    handleButtonEditProfileClick = (event) => {
        this.setState({submitFormOpen: true});
    };

    handleButtonCancelClick = (event) => {
        this.setState({submitFormOpen: false});
    };

    isValidUSZip = (sZip) => {
        return /^\d{5}(-\d{4})?$/.test(sZip);
     }

    validate = () => {
        if (this.state.fullName === null || this.state.fullName === "") {
            this.setState({
                errorMessage: "Please input full name!",
                errorDialogOpen: true
            });

            return false;
        }

        if (this.state.address1 === null || this.state.address1 === "") {
            this.setState({
                errorMessage: "Please input address1!",
                errorDialogOpen: true
            });

            return false;
        }

        if (this.state.city === null || this.state.city === "") {
            this.setState({
                errorMessage: "Please input city!",
                errorDialogOpen: true
            });

            return false;
        }

        if (this.state.zipCode === null || this.state.zipCode === "") {
            this.setState({
                errorMessage: "Please input zip code!",
                errorDialogOpen: true
            });

            return false;
        }

        var isValidZipcode = this.isValidUSZip(this.state.zipCode);

        if (!isValidZipcode) {
            this.setState({
                errorMessage: "Invalid zip code!",
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

        let userInfo = {
            fullName: this.state.fullName,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            zipCode: this.state.zipCode
        };

        let self = this;

        let successCallback = function () {
            self.setState({loginSuccess: true});
        };

        let failedCallback = function (message) {
            self.setState({
                errorDialogOpen: true,
                errorMessage: message
            });
        };

        setUserInfo(userInfo, successCallback, failedCallback);

        this.setState({submitFormOpen: false})
    };

    renderProfile = () => {
        const {classes} = this.props;

        return (
            <form className={classes.form} noValidate>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Full Name
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.fullName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Address 1
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.address1}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Address 2
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.address2}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            City
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.city}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            State
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.state}
                        </Typography>
                    </Grid>
                    </Grid>

                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Zip Code
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            {this.state.zipCode}
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        );
    };

    handleTextFieldFullNameChange = (event) => {
        this.setState({fullName: event.target.value});
    };

    handleTextFieldAddress1Change = (event) => {
        this.setState({address1: event.target.value});
    };

    handleTextFieldAddress2Change = (event) => {
        this.setState({address2: event.target.value});
    };

    handleTextFieldCityChange = (event) => {
        this.setState({city: event.target.value});
    };

    handleTextFieldZipCodeChange = (event) => {
        this.setState({zipCode: event.target.value});
    };

    handleStateSelectChange = (event) => {
        this.setState({state: event.target.value});
        console.log(this.state.state);
    };

    handleErrorDialogClose = () => {
        this.setState({errorDialogOpen: false});
    };

    renderProfileSubmitForm = () => {
        const {classes} = this.props;

        return (
            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Full Name
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            defaultValue={this.state.fullName}
                            margin="dense"
                            variant="outlined"
                            onChange={this.handleTextFieldFullNameChange}
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Address 1
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            defaultValue={this.state.address1}
                            margin="dense"
                            variant="outlined"
                            onChange={this.handleTextFieldAddress1Change}
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Address 2
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            defaultValue={this.state.address2}
                            margin="dense"
                            variant="outlined"
                            onChange={this.handleTextFieldAddress2Change}
                        />
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            City
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            defaultValue={this.state.city}
                            margin="dense"
                            variant="outlined"
                            onChange={this.handleTextFieldCityChange}
                        />
                    </Grid>
                </Grid>

                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            State
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid item xs={6}>
                            <FormControl className={classes.select}>
                                <Select
                                    className={classes.select }
                                    value={this.state.state}
                                    onChange={this.handleStateSelectChange}
                                    input={<BootstrapInput name="age" id="age-customized-select" />}
                                >
                                    {
                                        this.state.uSAStates.map(
                                            (item, index) =>
                                            {
                                                return (
                                                    <MenuItem key = {index} value={item.code} className={classes.select }> {item.code} </MenuItem>
                                                )
                                            }
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justify="center" spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography component="h3" variant="h6">
                            Zip Code
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            defaultValue={this.state.zipCode}
                            margin="dense"
                            variant="outlined"
                            onChange={this.handleTextFieldZipCodeChange}
                        />
                    </Grid>
                </Grid>

                <Grid container justify="flex-start" spacing={2} alignItems="center">
                    <Grid item xs={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            style={{textTransform: 'none'}}
                            className={classes.submit}
                        >
                            Save
                        </Button>
                    </Grid>

                    <Grid item xs={3}>
                        <Button variant="outlined" style={{textTransform: 'none'}} className={classes.submit}
                                onClick={this.handleButtonCancelClick}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
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

        if (!this.state.logined) {
             return <Redirect to='/login'/>;
        }

        const {classes} = this.props;

        return (
            <div>
                <Appbar logined = {this.state.logined}/>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h4" style={{margin: "20px"}}>
                            <center> {getLoginUserName()} 's Profile</center>
                        </Typography>
                        {this.state.submitFormOpen === true ? this.renderProfileSubmitForm() : this.renderProfile()}

                        {this.state.submitFormOpen === true ? null :
                            <Button
                                variant="outlined"
                                style={{textTransform: 'none'}}
                                className={classes.submit}
                                fullWidth
                                onClick={this.handleButtonEditProfileClick}
                            >
                                Edit Profile
                            </Button>
                        }
                    </div>
                    <ErrorDialog open={this.state.errorDialogOpen} handleClose={this.handleErrorDialogClose}
                                 message={this.state.errorMessage}/>
                </Container>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Profile);
