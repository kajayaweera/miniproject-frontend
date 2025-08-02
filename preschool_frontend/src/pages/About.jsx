
import '../css/About.css';
import hasara from '../assets/imagessir4.jpg';
import bob from  '../assets/imagessir2.jpg';
import roshi from  '../assets/downloadt1.jpg';
import kushi from  '../assets/imagesteacher.jpg';
import madura from  '../assets/imagessir1.jpg';
import chathura from  '../assets/imagessir3.jpg';
import perera from  '../assets/downloadtea2.jpg';
import kanthi from  '../assets/download.jpg';


function About(){
    return(<div className='about'>
    <div className='purpose'>
    <div className='mission'>
        <h1>Our Mission</h1>
        <p className='purex'>To provide a digital platform that simplifies preschool management, tracks child development, and keeps parents actively informed through real-time updates and smart tools.
        </p>
        </div>
        <div className='vision'>
            <h1>Our vision</h1>
            <p className='purex'>To create a smart, connected, and caring preschool environment that supports every child’s growth and strengthens the parent-teacher relationship.</p>
            </div>
            </div>
            <div><label className='staff_topic'>Preschool Staff</label><br/>
            <div className='staff'>
            <div className='staff_part'>
                <label>Principle</label><br/>
                <label>Mr.Hasara</label><br/>
                <img src={hasara} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Vise Principle</label><br/>
                <label>Mr.Bob</label><br/>
                <img src={bob} className='pic'/>
                
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Ms.Roshi</label><br/>
                <img src={roshi} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Ms.Kushi</label><br/>
                <img src={kushi} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Mr.Madura</label><br/>
                <img src={madura} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Mr.Chathura</label><br/>
                <img src={chathura} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Ms.Perera</label><br/>
                <img src={perera} className='pic'/>
            </div>
            <div className='staff_part'>
                <label>Teacher</label><br/>
                <label>Ms.Kanthi</label><br/>
                <img src={kanthi} className='pic'/>
            </div>
            </div>
            </div></div>);
    
}
export default About