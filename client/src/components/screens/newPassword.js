import React,{useState, useContext,} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const {token} = useParams()
  console.log(token);
  const PostData = ()=>{
    fetch("/new-password", {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        token
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
          type="password"
          placeholder="enter a new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          />
        <button className="btn waves-effect waves-darken"
        onClick={()=>PostData()}
        > Update Password
  </button>
      </div>
    </div>
 )
}

export default NewPassword
