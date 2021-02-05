const axios = require('axios');
const queryString = require('query-string');

const serverUrl = "http://127.0.0.1:5000/";

let loginUserName = null;

let userInfo = {};

function _getSavedLoginInfo() {
    loginUserName = localStorage.getItem("loginUserName");
    let password = localStorage.getItem("password");

    return {
        userName: loginUserName,
        password: password
    };
}

function _saveLoginInfo(loginUserName, password, userInfo) {
    localStorage.setItem("loginUserName", loginUserName);
    localStorage.setItem("password", password);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

function _updateUserInfo(userInfo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

function _removeLoginInfo() {
    localStorage.removeItem("loginUserName");
    localStorage.removeItem("userInfo");
}

export function existsSavedLoginInfo() {
    var loginInfo = _getSavedLoginInfo();

    return loginInfo.userName !== null && loginInfo.userName !== "";
}

// this function will be invoked in case login info was saved
export function tryLoginWithSavedLoginInfo(successCallback, failedCallback) {
    var loginInfo = _getSavedLoginInfo();
        
    let previousUserName = loginInfo.userName;
    let password = loginInfo.password;

    tryLogin(previousUserName, password, successCallback, failedCallback);
}

export function tryLogin(userName, password, successCallback, failedCallback) {
    let data = {
        userName: userName,
        password: password
    };

    let query = queryString.stringify(data);

    let url = serverUrl + "login/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            if(userInfo === null)
                userInfo = {};

            userInfo.fullName = data.fullName;
            userInfo.address1 = data.address1;
            userInfo.address2 = data.address2;
            userInfo.city = data.city;
            userInfo.state = data.state;
            userInfo.zipCode = data.zipCode;

            loginUserName = userName;

            _saveLoginInfo(loginUserName, password, userInfo);

            successCallback();
        })
        .catch(function (error) {
            if(error.response === undefined) {
                failedCallback("Failed to connect server!");
                return;
            }

            // handle error
            if(error.response.status === 404) {
                failedCallback("Failed to connect server!");
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function logout() {
    loginUserName = null;
    _removeLoginInfo();
} 

export function getUserInfo() {
    try {
        let userInfoString = localStorage.getItem("userInfo");

        userInfo = JSON.parse(userInfoString);

        return userInfo;
    }
    catch(err) {
        console.error(err.message);

        return null;
    }
}

export function setUserInfo(i_userInfo, successCallback, failedCallback) {
    i_userInfo.userName = loginUserName;

    let query = queryString.stringify(i_userInfo);

    let url = serverUrl + "update_profile/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            userInfo = i_userInfo;

            _updateUserInfo(i_userInfo);
            successCallback();
        })
        .catch(function (error) {
            if(error.response === undefined) {
                failedCallback("Failed to connect server!");
                return;
            }

            // handle error
            if(error.response.status === 404) {
                failedCallback("Failed to connect server!");
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function signUp(userName, password, successCallback, failedCallback) {
    let data = {
        userName: userName,
        password: password
    };

    let query = queryString.stringify(data);

    let url = serverUrl + "join/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            if(userInfo == null)
                userInfo = {};

            userInfo.fullName = "";
            userInfo.address1 = "";
            userInfo.address2 = "";
            userInfo.city = "";
            userInfo.state = "";
            userInfo.zipCode = null;

            loginUserName = userName;
            _saveLoginInfo(userName, password, userInfo);
            successCallback();
        })
        .catch(function (error) {
            if(error.response === undefined) {
                if(error.message)
                    failedCallback(error.message);
                else 
                    failedCallback("Failed to connect server!");    

                return;
            }

            // handle error
            if(error.response.status === 404) {
                if(error.message)
                    failedCallback(error.message);
                else 
                    failedCallback("Failed to connect server!");    
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function getLoginUserName() {
    return loginUserName;
}

export function quote(gallonsRequested, deliverDate, successCallback, failedCallback) {
    let data = {
        userName: loginUserName,
        gallonsRequested: gallonsRequested,
        state: userInfo.state,
        deliveryDate: deliverDate
    };

    let query = queryString.stringify(data);

    let url = serverUrl + "pricing/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            successCallback(data.suggestedPrice, data.totalAmountDue);
        })
        .catch(function (error) {
            if(error.response === undefined) {
                if(error.message)
                    failedCallback(error.message);
                else 
                    failedCallback("Failed to connect server!");    
                return;
            }

            // handle error
            if(error.response.status === 404) {
                failedCallback("Failed to connect server!");
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function submitQuote(gallonsRequested, deliverDate, successCallback, failedCallback) {
    let address = "";

    if(userInfo) {
        if(userInfo.address1)
            address = userInfo.address1;

        if(userInfo.address2)
            address = address + " " + userInfo.address2;

        if(userInfo.city)
            address = address + " " + userInfo.city;

        if(userInfo.state)
            address = address + " " + userInfo.state;

        if(userInfo.zipCode)
            address = address + " " + userInfo.zipCode;
    }

    let data = {
        userName: loginUserName,
        gallonsRequested: gallonsRequested,
        state: userInfo.state,
        deliveryDate: deliverDate,
        address: address
    };

    let query = queryString.stringify(data);

    let url = serverUrl + "submit_quote/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            successCallback(data.suggestedPrice, data.totalAmountDue);
        })
        .catch(function (error) {
            if(error.response === undefined) {
                if(error.message)
                    failedCallback(error.message);
                else
                    failedCallback("Failed to connect server!");
                return;
            }

            // handle error
            if(error.response.status === 404) {
                failedCallback("Failed to connect server!");
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function getHistory(successCallback, failedCallback) {
    let data = {
        userName: loginUserName,
    };

    let query = queryString.stringify(data);

    let url = serverUrl + "history/?" + query;

    axios.get(url)
        .then(function (response) {
            // handle success
            if(response.status !== 200) {
                failedCallback("Unknown error!");
                return;
            }

            let data = response.data;

            if(data.errCode !== 0) {
                failedCallback(data.errMsg);
                return;
            }

            successCallback(data.history);
        })
        .catch(function (error) {
            if(error.response === undefined) {
                if(error.message)
                    failedCallback(error.message);
                else 
                    failedCallback("Failed to connect server!");
                return;
            }

            // handle error
            if(error.response.status === 404) {
                if(error.message)
                    failedCallback(error.message);
                else 
                    failedCallback("Failed to connect server!");    
            }
            else
            {

            }
        })
        .finally(function () {
            // always executed
        });
}

export function formattedNumber(number) {
    if(Math.floor(number) === number)
        return number;

    let decimalCount = number.toString().split(".")[1].length;

    if(decimalCount <= 3)
        return number;
       
    return number.toFixed(3);
}
