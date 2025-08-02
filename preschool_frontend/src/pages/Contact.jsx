
import '../css/Contact.css';
import location from  '../assets/location.png';
import mail from  '../assets/email.jpg';
import cll from  '../assets/telephone.png';
import bdy from  '../assets/contactpage.png';


function Contact(){
    return(<div className="bkgrd" style={{ backgroundImage: `url(${bdy})` }}>
        <div>
            <h2 className='contct-topic'>Contact us</h2>
            <div className='cntct'>
               <div className='con-item'>
                <img src={location} className='icon'/><br/>
                <label>Visit us</label><br/>
                <label>567/A, Colombo Road, Eheliyagoda</label>
               </div>
               <div className='con-item'>
                <img src={cll} className='icon' /><br/>
                <label>Let's talk</label><br/>
                <label>011 2345678</label>
               </div>
               <div className='con-item'>
                <img src={mail} className='icon' /><br/>
                <label>Email us</label><br/>
                <label>Sigithi@gmail.com</label>
               </div>
            </div>
        </div>
        <div className='contact-form-container'>
        <div className='contact_form'>
            <label className='tpc'>We'd love to hear from you...</label><br/>
            <input placeholder='Your name' className='text'/><br/>
            <input placeholder='Your email'className='text'/><br/>
            <input placeholder='Your phone number' className='text'/><br/>
            <input placeholder='Message' className='text_con'/><br/>
            <button className='con_btn'>SUBMIT</button>

        </div>
        </div>
        
    </div>);
    
}
export default Contact