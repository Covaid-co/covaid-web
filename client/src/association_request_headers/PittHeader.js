import React from "react";

export default function PittHeader() {
    return (
        <>
            <h1 id="small-header">Pittsburgh Mutual Aid Form</h1>
            <p id="regular-text">
                If you need support or have resources to offer as we navigate the COVID-19 crisis as a community, 
                please use this form. Your responses to this form will only be seen by a team of volunteers working 
                to match resources with needs. You can find more public resources at <a href="www.pittsburghmutualaid.com" target="_blank">www.pittsburghmutualaid.com</a>.
            </p>
            <p id="regular-text">
                We are prioritizing folks who are sick, disabled, quarantined without pay, elderly, undocumented, 
                queer, Black, Indigenous, and/or people of color -- including those displaced from Pittsburgh to the nearby areas. 
            </p>
            <p id="regular-text">
                This form is being managed by a group of all-volunteer Pittsburgh community members involved in local organizing efforts. 
                Thank you for your patience and grace. 
            </p>
            <p id="regular-text">
                If you have questions or need help filling out this form, please contact the moderators:<br/>
                --> Gabriel M, g.mcmorland@gmail.com <br/>
                --> Madeline P, madelinejaneee@gmail.com
            </p>
            <p id="regular-text">
                Let’s take care of each other. By us for us. <br/>
                Vamos a cuidarnos unes a otres. Por nosotres, para nosotres. 
            </p>
            <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                please call <br /><span id="phoneNumber">(412) 301-6127</span></p>
        </>
    );
}