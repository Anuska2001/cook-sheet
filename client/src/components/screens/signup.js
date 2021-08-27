import React,{useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';



const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined)
  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])
  const uploadPic = () =>{
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "cooksheet")
    data.append("cloud_name","cooksheet")
    fetch("https://api.cloudinary.com/v1_1/cooksheet/image/upload", {
      method:"post",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      setUrl(data.url)
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const uploadFields=()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
    {
      M.toast({html: "Invalid Email"})
      return
    }
    fetch("/signup", {
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        password,
        email,
        pic: url
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
    })
    .catch(err =>{
      console.log(err);
    })

  }

  const PostData = ()=>{
    if(image){
      uploadPic()
    }
    else{
      uploadFields()
    }

  }
  return (
        <div className="mycard">
          <div className="card auth-card">
            <h2 class="brand-logo"> CookSheet </h2>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
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
            <div className="file-field input-field">
            <div className="btn">
              <span>Upload Profile Picture</span>
              <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text"/>
            </div>
          </div>
            <button className="btn waves-effect waves-darken" onClick={()=>PostData()} >SignUp
      </button>
        <h5>
            <Link to='/login'> Already have an Account?</Link>
        </h5>
          </div>
        </div>
     )
    }

export default Signup;
