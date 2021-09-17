import React from 'react'

function Notification({notification}) {
    return (
        <div className="notification" style={{position: "fixed",bottom:"20px", right:"20px" , backgroundColor:"#bdb1b1", color:"#1e1b1b", padding:"10px", borderRadius: "10px", width: "200px", textAlign: "center"}}>
            {notification}
        </div>
    )
}

export default Notification
