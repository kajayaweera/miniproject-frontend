import '../css/Admindash.css'

function Admindashboard(){
    return(
        <div>
            <div className="a-dash-container">
                <label className='dash-name'>ADMIN DASHBOARD</label><br/>
                <button className='a-tab'>Home</button><br/>
                <button className='a-tab'>Child Profile</button><br/>
                <button className='a-tab'>Timetable</button><br/>
                <button className='a-tab'>Activities</button><br/>
                <button className='a-tab'>Digital Report</button><br/>
                <button className='a-tab'> Updates</button><br/>
                <button className='a-tab'>Special Noties</button><br/>
                <button className='a-tab'>Billing</button><br/>
                <button className='a-tab'>See My Child</button><br/>
                <button className='a-tab'>Events</button><br/>
                <button className='a-tab'>Gallery</button><br/>
                <button className='a-tab'>Log Out</button><br/>

            </div>
        </div>
    );
}
export default Admindashboard