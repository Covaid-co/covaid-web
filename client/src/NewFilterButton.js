import React, {  useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown'


export default function NewFilterButton(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleTaskChange = (evt, task) => {
        var noTasksSelected = true;
        const selectedTasks = [];
        // change current one to true
        if (props.taskSelect[task] === false) {
            selectedTasks.push(task);
            noTasksSelected = false;
        }

        for (const taskFound in props.taskSelect) {
            if (taskFound === task) {
                continue;
            }
            if (props.taskSelect[taskFound]) {
                selectedTasks.push(taskFound);
                noTasksSelected = false;
            }
        }

        props.setTaskSelect(prev => ({ 
            ...prev,
            [task]: !props.taskSelect[task],
        }));

        // display all users
        if (noTasksSelected) {
            props.setDisplayedVolunteers(props.volunteers);
            return;
        }
        const result = props.volunteers.filter(user => selectedTasks.some(v => user.offer.tasks.indexOf(v) !== -1));
        props.setDisplayedVolunteers(result);
    }

    const dropdownToggle = (newValue, event, metadata) => {
        if (metadata.source === 'select') {
            setDropdownOpen(true);
        } else {
            setDropdownOpen(newValue);
        }
    }

    return (
        <Dropdown drop = 'up' 
                show={dropdownOpen}
                onToggle={dropdownToggle}
                style={{textAlign: 'right'}}
                alignRight>
            <Dropdown.Toggle size = 'sm' 
                            variant="secondary"
                            id="filterButton">
                <strong>Resource Filter</strong>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {props.resources.map((task, i) => {
                return <Dropdown.Item
                            key={i}
                            onSelect = {(evt) => { handleTaskChange(evt, task)}}
                            active = {props.taskSelect[task]}> {task}
                        </Dropdown.Item >
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}