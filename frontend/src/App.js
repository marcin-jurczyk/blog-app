import React from "react";
import {BrowserRouter, Router} from "react-router-dom";
import {history} from "./services/history";
// import {loginAutomatically} from "./services/user";
import {Routing} from "./Routing";
import './App.css';
import {loginAutomatically} from "./services/user";


// loginAutomatically()


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routing/>
            </BrowserRouter>
        </div>
    );
}

export default App;
