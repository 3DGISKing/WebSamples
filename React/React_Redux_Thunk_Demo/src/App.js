import React, { Component } from "react";
import { connect } from "react-redux";
import UserInfo from "./UserInfo";
import { thunk_action_creator } from "./actions/fetchAction";

class App extends Component {

  handleSubmit = e => {
    e.preventDefault();
    const username = this.getUsername.value;
    this.props.dispatch(thunk_action_creator(username));
    this.getUsername.value = "";
  };

  render() {
    console.log(this.props.data);
    return (
        <div className="container">
          <form onSubmit={this.handleSubmit} className="form">
            <h2 className="title">Enter the Github Username</h2>
            <input
                type="text"
                placeholder="Enter Github Username"
                required
                ref={input => (this.getUsername = input)}
            />
            <button className="button">Submit</button>
          </form>
          {this.props.data.isFetching ? <h3>Loading...</h3> : null}
          {this.props.data.isError ? (
              <h3 className="error">No such User exists.</h3>
          ) : null}
          {Object.keys(this.props.data.userData).length > 0 ? (
              <UserInfo user={this.props.data.userData} />
          ) : null}
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(mapStateToProps)(App);
