import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from './components/Appbar'
import Typography from '@material-ui/core/Typography';
import Image from "./gasoline.jpg" 
import {tryLoginWithSavedLoginInfo, existsSavedLoginInfo} from './helpers/Helper'
import ErrorDialog from './components/ErrorDialog'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      logined: false,
      errorDialogOpen: false,
      determinedLogin: false,
    }
  }

  handleErrorDialogClose = () => {
    this.setState({errorDialogOpen: false});
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

    const { classes } = this.props;
  
    return (
      <div className={classes.root}>
        <AppBar logined = {this.state.logined}/>  
        <Typography component="h1" variant="h3" style = {{margin: "30px"}}>
          <center> Fuel Pricing</center>
        </Typography>
        <center>
        <img src= {Image} alt="thumbnail" className="img-thumbnail" />
        </center>
        <ErrorDialog open={this.state.errorDialogOpen} handleClose={this.handleErrorDialogClose}
                                 message={this.state.errorMessage}/>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
