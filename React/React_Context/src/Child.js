import React, {useEffect} from 'react';

import MyContext from "./MyContext"

function Child() {
    let myContext = React.useContext(MyContext);

    useEffect(() => {
        console.info("context 's age changed!");

        console.log("age", myContext.age);
    }, [myContext.age]);

    return (
        <div>
            <button onClick={() => myContext.setAge(myContext.age + 1)}>
                <h1> {myContext.name } : {myContext.age}</h1>
            </button>

            {
                myContext.age > 40 && <h1> Old </h1>
            }
        </div>
    );
}

export default Child;