import React, {  useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import { extractTrueObj } from './Helpers';

export default function NewFilterButton(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleTaskChange = (evt, task) => {
        const newTaskSelect = { 
            ...props.taskSelect, 
            [task]: !props.taskSelect[task]
        }
        props.setTaskSelect(newTaskSelect);
        const selectedTasks = extractTrueObj(newTaskSelect);
        if (selectedTasks.length === 0) {
            props.setDisplayedVolunteers(props.volunteers);
            return;
        }
        const result = props.volunteers.filter(user => selectedTasks.every(v => user.offer.tasks.indexOf(v) !== -1));
        props.setDisplayedVolunteers(result);
    }

    const dropdownToggle = (newValue, event, metadata) => {
        if (metadata.source === 'select') {
            setDropdownOpen(true);
        } else {
            setDropdownOpen(newValue);
        }
    }

    const mobileStyling = () => {
        if (props.mobile) {
            return {width: 5, marginLeft: 'auto', marginRight: 90}
        }
        return {}
    }

    return (
        <Dropdown drop = 'up' show={dropdownOpen} alignRight className="mobileDrop"
                  onToggle={dropdownToggle} style={mobileStyling()}>
            <Dropdown.Toggle size = 'sm' variant="secondary" id="filterButton">
                <strong>Filters</strong>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {props.resources.map((task, i) => {
                return <Dropdown.Item key={i}
                            onSelect = {(evt) => { handleTaskChange(evt, task)}}
                            active = {props.taskSelect[task]}> 
                            {task}
                        </Dropdown.Item >
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}