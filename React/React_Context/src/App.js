import React from 'react';
import './App.css';
import MyContext from "./MyContext"

import Child from "./Child"

function App ()  {
    const [name, setName] = React.useState("ZhefengJin");
    const [age, setAge] = React.useState(38);

    const contextValue = {
        name,
        setName,
        age,
        setAge
    };

    return (
        <div className="App">
            <MyContext.Provider value = {contextValue}>
                <Child/>
            </MyContext.Provider>
        </div>
    );
}

export default App;
