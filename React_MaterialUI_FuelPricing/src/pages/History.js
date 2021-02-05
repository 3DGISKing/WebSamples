import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {getLoginUserName, existsSavedLoginInfo, tryLoginWithSavedLoginInfo, getHistory} from './../helpers/Helper'
import Appbar from './../components/Appbar'
import Typography from '@material-ui/core/Typography';
import {Redirect} from 'react-router-dom'
import ErrorDialog from './../components/ErrorDialog'
import {formattedNumber} from './../helpers/Helper'

const styles = theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

class History extends React.Component {
    constructor(prop) {
        super(prop);

        this.state = {
            determinedLogin: false,
            errorDialogOpen: false,
            errorMessage: "",
            history: []
        };
    }

    tryGetHistory = () => {
        this._isMounted = true;

        let self = this;

        let successCallback = function (data) {
            if(self._isMounted)
                self.setState({history: data});
        };

        let failedCallback = function (message) {
            if(self._isMounted) {
                self.setState({
                    errorDialogOpen: true,
                    errorMessage: message
                });
            }
        };

        getHistory(successCallback, failedCallback);
    }

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

          self.tryGetHistory();
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

    handleErrorDialogClose = () => {
        this.setState({errorDialogOpen: false})
    };

    renderHistory = () => {
        const {classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Gallons Requested </TableCell>
                            <TableCell align="right">Delivery Address </TableCell>
                            <TableCell align="right">Delivery Date </TableCell>
                            <TableCell align="right">Suggested Price </TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.history.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.gallon_requested}
                                </TableCell>
                                <TableCell align="right">{row.delivery_address}</TableCell>
                                <TableCell align="right">{row.delivery_date}</TableCell>
                                <TableCell align="right">{formattedNumber(row.suggested_price)}</TableCell>
                                <TableCell align="right">{formattedNumber(row.total_amount_due)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    };

    render() {
        if(this.state.determinedLogin === false) {
            return (
              <div>Loading</div>
            );
        }

        if (!this.state.logined) {
            return <Redirect to='/login'/>;
        }

        return (
            <div>
                <Appbar logined = {this.state.logined}/>
                <Typography component="h1" variant="h4" style={{margin: "20px"}}>
                    <center> {getLoginUserName()} 's Fuel Quote History</center>
                </Typography>

                {this.renderHistory()}
                <ErrorDialog open={this.state.errorDialogOpen} handleClose={this.handleErrorDialogClose}
                             message={this.state.errorMessage}/>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(History);
