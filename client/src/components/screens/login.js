import React,{useState, useContext,} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css';

const Login = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
      M.toast({html: "Invalid Email"})
      return
    }
    fetch("/signin", {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password,
      })
    }).then(res=>res.json())
    .then(data =>{
      if(data.error){
      M.toast({html: data.error})
    }
    else{
      localStorage.setItem("jwt", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      dispatch({type:"USER", payload:data.user})
      M.toast({html: "SignedIn Successfully"})
      history.push('/')
    }
    }).catch(err =>{
      console.log(err)
    })

  }
 return (
    <div className="mycard">
      <div className="card auth-card">
        <h2 class="brand-logo"> CookSheet </h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        <button className="btn waves-effect waves-darken"
        onClick={()=>PostData()}
        > LogIn
  </button>
  <h5>
      <Link to='/signup'> Don't have an Account? Create one!</Link>
  </h5>
  <h6>
      <Link to='/reset'> Forgot password?</Link>
  </h6>
      </div>
    </div>
 )
}

export default Login
