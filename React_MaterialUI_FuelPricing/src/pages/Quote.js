import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Appbar from './../components/Appbar'
import ErrorDialog from './../components/ErrorDialog'
import InputAdornment from '@material-ui/core/InputAdornment';
import {getUserInfo, existsSavedLoginInfo, tryLoginWithSavedLoginInfo, quote, submitQuote} from './../helpers/Helper'
import {Redirect} from 'react-router-dom'
import {formattedNumber} from './../helpers/Helper'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(0),
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
        margin: theme.spacing(1),
    },
});

class Quote extends React.Component {
    constructor(prop) {
        super(prop);

        const userInfo = getUserInfo();

        let today = new Date();

        let month = today.getMonth() + 1;

        let strMonth = '' + month;

        if(month < 10)
            strMonth = '0' + strMonth;

        let date = today.getDate();

        let strDate = '' + date;

        if(date < 10)
            strDate = '0' + strDate;

        let strToday = today.getFullYear() + '-' + strMonth + '-' + strDate;

        this.state = {
            determinedLogin: false,
            errorDialogOpen: false,
            errorMessage: "",
            address: "",
            deliveryDate: strToday,
            suggestedPrice: 0,
            totalAmountDue: 0,
            allInputted: false
        };

        if(userInfo) {
            if(userInfo.address1 != null && userInfo.address2 != null)
                this.state.address = userInfo.address1 + " " + userInfo.address2;    
            else if(userInfo.address1 != null && userInfo.address2 == null)
                this.state.address = userInfo.address1;
            else if(userInfo.address1 == null && userInfo.address2 != null)
                this.state.address = userInfo.address2;    
        }
            
    }

    handleErrorDialogClose = () => {
        this.setState({errorDialogOpen: false})
    };

    handleButtonGetPriceClick = () => {
        if (!this.validate())
            return;

        let self = this;

        let successCallback = function(suggestedPrice, totalAmountDue) {
            self.setState({suggestedPrice: suggestedPrice});
            self.setState({totalAmountDue: totalAmountDue});
        };

        let failedCallback = function(message) {
            self.setState({
                errorDialogOpen: true,
                errorMessage: message
            });
        };

        quote(this.state.gallonsRequested, this.state.deliveryDate, successCallback, failedCallback);
    };

    handleSubmit = (event) => {
        event.preventDefault();

        if (!this.validate())
            return;

        if (this.state.suggestedPrice === 0) {
            this.setState({
                errorMessage: "Please get price!",
                errorDialogOpen: true
            });

            return false;
        }

        let self = this;

        let successCallback = function(suggestedPrice, totalAmountDue) {
            self.setState({suggestedPrice: suggestedPrice});
            self.setState({totalAmountDue: totalAmountDue});

            alert("Successfully submitted!");
        };

        let failedCallback = function(message) {
            self.setState({
                errorDialogOpen: true,
                errorMessage: message
            });
        };

        submitQuote(this.state.gallonsRequested, this.state.deliveryDate, successCallback, failedCallback);
    };

    validate = () => {
        if (this.state.gallonsRequested == null) {
            this.setState({
                errorMessage: "Please input requested gallons!",
                errorDialogOpen: true
            });

            return false;
        }

        return true;
    };

    handleTextFieldGallonsRequestedChange = (event) => {
        let value = event.target.value;

        if (parseFloat(value)) {
            this.setState({allInputted: true});
        }
        else {
            this.setState({allInputted: false});
        }

        this.setState({suggestedPrice: 0});
        this.setState({totalAmountDue: 0});

        this.setState({gallonsRequested: event.target.value});
    };

    handleTextFieldDeliveryDateChange = (event) => {
        this.setState({deliveryDate: event.target.value});
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

        const {classes} = this.props;

        if (!this.state.logined) {
            return <Redirect to='/login'/>;
        }

        return (
            <div>
                <Appbar logined = {this.state.logined}/>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h4">
                            Fuel Pricing
                        </Typography>

                        <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="gallon"
                                label="Gallons Requested "
                                name="gallon"
                                onChange={this.handleTextFieldGallonsRequestedChange}
                                autoFocus
                                autoComplete=""
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Gallon</InputAdornment>,
                                }}
                            />

                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                name="address"
                                label="Delivery Address"
                                id="address"
                                autoComplete="current-password"
                                InputProps={{
                                    readOnly: true,
                                }}
                                defaultValue={this.state.address}
                            />

                            <TextField
                                variant="outlined"
                                margin="dense"
                                id="date"
                                label="Delivery Date"
                                type="date"
                                fullWidth
                                value={this.state.deliveryDate}
                                onChange = {this.handleTextFieldDeliveryDateChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="gallon"
                                label="Suggested Price"
                                name="gallon"
                                autoComplete=""
                                type="number"
                                value={formattedNumber(this.state.suggestedPrice)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    readOnly: true
                                }}
                            />

                            <TextField
                                variant="outlined"
                                margin="dense"
                                required
                                fullWidth
                                id="gallon"
                                label="Total Amount"
                                name="gallon"
                                autoComplete=""
                                type="number"
                                value={formattedNumber(this.state.totalAmountDue)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    readOnly: true
                                }}
                            />

                            <Paper className={classes.paperBottomTitle}>
                                <Grid container justify="center">
                                    <Grid item xs={5}>
                                        <Button
                                            onClick={this.handleButtonGetPriceClick}
                                            disabled={!this.state.allInputted}
                                            fullWidth
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Get Price
                                        </Button>
                                    </Grid>

                                    <Grid item xs={2}>
                                    </Grid>

                                    <Grid item xs={5}>
                                        <Button
                                            disabled={!this.state.allInputted}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Submit Quote
                                        </Button>
                                    </Grid>

                                </Grid>
                            </Paper>

                        </form>
                        <ErrorDialog open={this.state.errorDialogOpen} handleClose={this.handleErrorDialogClose}
                                     message={this.state.errorMessage}/>
                    </div>

                </Container>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Quote);
