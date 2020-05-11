export const defaultResources = ['Food/Groceries', 'Medication', 'Emotional Support', 'Donate', 'Academic/Professional', 'Misc.'];
export const languages = ['English', 'Spanish', 'Chinese', 'French', 'Other'];
export const cookieNames = ['latitude', 'longitude', 'zipcode', 'neighborhoods', 'locality', 'state'];
export const availability = ['Morning', 'Afternoon', 'Evening', 'Weekdays', 'Weekends'];
export const defaultLinks = [
    {
        name: 'CDC',
        link: 'https://www.cdc.gov/coronavirus/2019-nCoV/index.html'
    }, {
        name: 'Mutual Aid Hub',
        link: 'https://www.mutualaidhub.org'
    }, {
        name: 'Call to Connect',
        link: 'https://www.calltoconnect.org/'
    }, {
        name: 'Unemployment',
        link: 'https://www.usa.gov/unemployment'
    }, {
        name: 'FindHelp',
        link: 'https://findhelp.org/'
    }, {
        name: 'State',
        link: 'https://www.usa.gov/state-health'
    }
]
export const toastTime = 2000;
export const paymentOptions = ['Call ahead to store and pay (Best option)', 'Have volunteer pay and reimburse when delivered', 'N/A'];
export const defaultTerms = [
    'I have not traveled out-of-country in the past 14 days',
    'I am not exhibiting any symptoms of COVID-19 (cough, fever, etc.)',
    'I have not come in contact with a sick person in the past 14 days',
    'I have been practicing social distancing -- staying indoors, avoiding crowds, staying 6 feet away from other people if you have to go outside',
    'I will take take every CDC-provided safety precaution',
    'I understand that Covaid is strictly a volunteer group established to help during these extraordinary times created by the COVID-19 pandemic and agree to release and hold them harmless for any damages, financial or otherwise, which may occur during fulfillment of the services which I have requested.'
];
export const UserType = {'volunteer': 1, 'organization': 2};
export const currURL = window.location.protocol + '//' + window.location.host;
export const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
C20.1,15.8,20.2,15.8,20.2,15.7z`;
export const MARKER_SIZE = 20;
export const generalRequestText = 'After submitting a general request for support, we will attempt to match you with a volunteer in your area.';

export const request_status = {
    UNMATCHED: 0,
    MATCHED: 1,
    COMPLETED: 2
}

export const volunteer_status = {
    PENDING: 0,
    IN_PROGRESS: 1,
    COMPLETE: 2,
    REJECTED: 3,
    DOES_NOT_EXIST: -1
}

export const current_tab = {
    UNMATCHED: 1,
    MATCHED: 2,
    COMPLETED: 3
}

export const sort_types = ['Name', 'Needed By', 'Last Updated', 'Time Posted'];