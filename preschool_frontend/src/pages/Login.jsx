import '../css/Login.css'
function Login(){
    return(
        <div className='loging_background'>
    <div className='loging_body'>
        
        <h1 className="topic_login">LOGIN</h1><br/>
        <div className="login_form">
        <input  type="text" placeholder="Eamil"/><br/>
        </div><br/>

        <div className="login_form">
        
        <input type="password" placeholder="password"/></div><br/>
        <div className='login_btn'> 
        <button>Sign In</button>
        </div> 
        <div>
            <input type='checkbox'/><label>Remember me</label>
        </div>
        <div className='forgot'><li><a>Forgot password</a></li></div>
        </div>
        
    </div>);
    
}
export default Login