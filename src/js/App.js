import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {

    // Create initial state and pass props
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contacts: []
        }
    }

    // Lifecycle method triggered first
    componentWillMount() {
        // Check if item exists in the local storage
        // setState for contacts to localStorage
        // set loading to false
        localStorage.getItem('contacts') && this.setState({
            contacts: JSON.parse(localStorage.getItem('contacts')),
            isLoading: false
        })
    }

    // componentDidMount lifecycle
    // Fires immediately after the initial render
    componentDidMount() {

        // Get date from localStorage
        const date = localStorage.getItem('contactsDate');
        // Get data from localStorage and get new date timestamp
        const contactsDate = date && new Date(parseInt(date));
        // Get new date
        const now = new Date();

        // Get age of data and set value to minutes
        const dataAge = Math.round((now - contactsDate) / (1000 * 60));
        // Compare dataAge, returns true or false if greater than 15 minutes
        const tooOld = dataAge >= 15;

        // If older than 15 minutes
        if(tooOld){
            this.fetchData();
        } else {
            console.log(`using data from local storage that is ${dataAge} minutes old`);
        }
    }

    // Custom fetch data method
    fetchData() {

        // setState to load each update
        this.setState({
            isLoading: true,
            contacts: []
        })

        // Fetch data
        fetch('https://randomuser.me/api/?results=50&nat=us,dk,fr,gb')
        // Turn response into JSON
        .then(response => response.json())
        // Take parsedJSON and log results
        // Create individual object for each of the users
        .then(parsedJSON => parsedJSON.results.map(user => (
            {
                name: `${user.name.first} ${user.name.last}`,
                username: `${user.login.username}`,
                email: `${user.email}`,
                location: `${user.location.street}, ${user.location.city}`
            }
        )))
        // Overwrite empty array with new contacts
        // Set array to contacts state and set isLoading to false
        .then(contacts => this.setState({
            contacts,
            isLoading: false
        }))
        // Catch the errors
        .catch(error => console.log('parsing failed', error))
    }


    // Fires before initial render
    componentWillUpdate(nextProps, nextState) {
        // Save contacts into local storage
        localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
        localStorage.setItem('contactsDate', Date.now());
    }

    render() {
        // Export const's from state
        // Give access inside of render method
        const {isLoading, contacts} = this.state;
        return (
            <div>
                <header>
                    <img src={image} />
                    <h1>Fetching Data <button className="btn btn-sm btn-danger" onClick={(e) => this.fetchData()}>Fetch now</button></h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">
                        {
                            // If loading is not true & contacts length is greater than zero
                            // Return each contact form array using map function
                            // Otherwise return null
                            !isLoading && contacts.length > 0 ? contacts.map(contact => {
                                // Destruct each of the items in const
                                const {username, email, name, location} = contact;
                                return  <Collapsible key={username} title={name}>
                                            <p>{email}<br />{location}</p>
                                        </Collapsible>
                            }) : null
                        }
                    </div>
                    <div className="loader">
                        <div className="icon"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;
