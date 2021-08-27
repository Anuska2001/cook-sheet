import React,{useEffect, createContext, useReducer,useContext} from 'react';
import "./App.css";
import NavBar from './components/navBar';
import Home from './components/screens/home';
import Login from './components/screens/login';
import Profile from './components/screens/profile';
import Signup from './components/screens/signup';
import CreatePost from './components/screens/createPost';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import {reducer, initialState } from './reducers/userReducer'
import UserProfile from './components/screens/userProfile';
import NewPassword from './components/screens/newPassword';
import Reset from './components/screens/reset';


export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const{state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload: user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
          history.push('/login')
    }
  }, [])
  return (
    <Switch>
        <Route exact path = "/">
        <Home />
        </Route>
        <Route path = "/login">
        <Login />
        </Route>
        <Route path = "/signup">
        <Signup />
        </Route>
        <Route exact path = "/profile">
        <Profile />
        </Route>
        <Route path = "/create">
        <CreatePost />
        </Route>
        <Route path = "/profile/:userid">
        <UserProfile />
        </Route>
        <Route exact path = "/reset">
        <Reset />
        </Route>
        <Route path = "/reset/:token">
        <NewPassword />
        </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
        <NavBar />
        <Routing />
        </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
