import React,{ createContext, useState } from "react";

export const AuthUserContext = createContext();

export const AuthUserProvider = ({ children }) =>{
    const[userAuth, setUserAuth ] = useState(false);

    return(
        <AuthUserContext.Provider value={{userAuth, setUserAuth}}>
            {children}
        </AuthUserContext.Provider>
    )
};