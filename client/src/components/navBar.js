import React, {useContext, useRef, useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () =>{
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  }, [])
  const renderlist = ()=>{
    if(state){
      return [
        <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger">insert_search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/create">New Post</Link></li>,
        <li key="4">
        <button className="btn waves-effect waves-darken"
        onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('login')
        }}
        > LogOut
  </button>
        </li>
      ]
    }else{
      return [
        <li key="5"><Link to="/login">Login</Link></li>,
        <li key="6"><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results =>{
      setUserDetails(results.user)
    })
  }
  return(
    <nav>
    <div className="nav-wrapper">
      <Link to={state?"/": "/login"} className="brand-logo left">CookSheet</Link>
      <ul id="nav-mobile" className="right">
        {renderlist()}
      </ul>
    </div>
      <div id="modal1" class="modal" ref={searchModal} style={{color: 'black'}}>
      <div className="modal-content">
      <input
          type="text"
          placeholder="search users"
          value={search}
          onChange={(event) => fetchUsers(event.target.value)}
        />
          <div class="collection">
            {userDetails.map(item=>{
              return <Link to={item._id != state._id?'/profile/'+item._id: '/profile'} onClick={()=>{
                M.Modal.getInstance(searchModal.current).close()
                setSearch('')
              }}><a className="collection-item">{item.email}</a></Link>
            })}
      </div>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
      </div>
    </div>
  </nav>
  )
}

export default NavBar
