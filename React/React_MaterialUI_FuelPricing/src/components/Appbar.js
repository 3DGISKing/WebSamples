import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {logout} from './../helpers/Helper'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});

const menuId = 'primary-search-account-menu';

const BootstrapButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
    },
    '&:active': {
      boxShadow: 'none',
    },
    '&:focus': {
    },
  },
})(Button);

class Appbar extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        activeButton: null
    }
  }

  onLoginButtonClicked = () =>{
    this.props.history.push("/login");
  };

  onSignupButtonClicked = () =>{
    this.props.history.push("/join");
  };

  onAccountCircleButtonClicked = (event) =>{
    this.setState({menuAnchor: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({menuAnchor: null});
  };

  handleMenuItemProfileClick = () => {
    const currentPath = this.props.location.pathname;

    if(currentPath === "/profile"){
        this.handleMenuClose();
        return    
    }

    this.props.history.push("/profile");
  };

  handleMenuItemLogoutClick = () => {
    logout();
    this.handleMenuClose();
    this.props.history.push("/login");
  };

  handleButtonHomeClick = (event) => {
    this.props.history.push("/");
  };

  handleButtonQuoteClick = (event) => {
    this.props.history.push("/quote");
  };

  handleButtonHistoryClick = (event) => {
    this.props.history.push("/history");
  };

  render() {
    const { classes } = this.props;

    const activeButtonStyle = {border: "1px solid"};
    const nonActiveButtonStyle = {border: "0px solid"};

    return (
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick = {this.handleButtonHomeClick}>
              <HomeIcon />
            </IconButton>

            <BootstrapButton color="inherit" size="medium" style = {{textTransform: "none"}} onClick = {this.handleButtonQuoteClick} >
              Fuel Quote
            </BootstrapButton>

            <BootstrapButton color="inherit" size="medium" style = {{textTransform: "none"}} onClick = {this.handleButtonHistoryClick} >
              Fuel Quote History
            </BootstrapButton>

            <Typography variant="h6" className={classes.title}/>

            {
              this.props.logined ? null:
              <BootstrapButton color="inherit" onClick={this.onLoginButtonClicked}>
                Sign in
              </BootstrapButton >
            }

            <div color="inherit" style={{width: 10}}/>
            {
              this.props.logined ? null :
              <BootstrapButton 
                color="inherit"
                style = { this.props.activeButton === "signup" ? activeButtonStyle: nonActiveButtonStyle }
                onClick={this.onSignupButtonClicked}>

                Sign up
              </BootstrapButton>  
            }
            {
                this.props.logined ?
                <IconButton
                    edge="end"
                    aria-label="Account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={this.onAccountCircleButtonClicked}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>    
                : null
            }

            <Menu
              id="simple-menu"
              anchorEl={this.state.menuAnchor}
              keepMounted
              open={Boolean(this.state.menuAnchor)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={this.handleMenuItemProfileClick}>Profile</MenuItem>
              <MenuItem onClick={this.handleMenuItemLogoutClick}>Logout</MenuItem>
            </Menu>

          </Toolbar>
        </AppBar> 
    );
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Appbar));
