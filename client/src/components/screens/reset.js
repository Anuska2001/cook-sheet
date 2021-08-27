import React,{useState, useContext,} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
      M.toast({html: "Invalid Email"})
      return
    }
    fetch("/reset-password", {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
      })
    }).then(res=>res.json())
    .then(data =>{
      if(data.error){
      M.toast({html: data.error})
    }
    else{
      M.toast({html: data.message})
      history.push('/login')
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
        <button className="btn waves-effect waves-darken"
        onClick={()=>PostData()}
        > Reset Password
  </button>
      </div>
    </div>
 )
}

export default Reset