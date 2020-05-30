import React from "react";
import ReactDOM from 'react-dom';
import { render } from "@testing-library/react";
import {shallow, mount} from 'enzyme';
import OrganizationPortal from "./OrganizationPortal";
import { ToastProvider } from "react-toast-notifications";
import { act } from 'react-dom/test-utils';

function OrganizationPortalPage(props) {
	return (
		<ToastProvider>
			<OrganizationPortal {...props}/>
		</ToastProvider>
	);
}

describe ('<OrganizationPortal />', () => {
	const props = {
	    location: {
	    	orgReset: true,
	    },
	};

	const container = mount(<OrganizationPortalPage {...props}/>);
	it('should match the snapshot', () => {
		expect(container.html()).toMatchSnapshot();
	});

	describe('Organization Login <OrgLogin />', () => {
		it('should have proper props for email field', () => {

	    	expect(container.find('input[type="email"]').find('input[id="emailOrg"]').props()).toEqual({
	      		onChange: expect.any(Function),
	      		placeholder: 'Email',
	      		type: 'email',
	      		className: "form-control",
    	   		id: "emailOrg",
    	   		readOnly: undefined,
    	  		value: "",
		    });
		});

		it('should have proper props for password field', () => {
		    expect(container.find('input[type="password"]').props()).toEqual({
		      	placeholder: 'Password',
		      	onChange: expect.any(Function),
		      	type: "password",
		      	readOnly: undefined,
		      	className: "form-control",
       			id: "passOrg",
       			value: "",
		    });
		});

		// it('should set the email value on change event', () => {
		// 	beforeAll(() => {
		// 	    container.find('input[id="emailOrg"]').prop('onChange')({
		// 	      	target: {
		// 	      		id: 'emailOrg',
		// 	        	value: 'somenewemail@gmail.com',
		// 	      	},
		// 	    })
		// 	})
		//     expect(container.find('input[id="emailOrg"]').prop('value')).toEqual(
		//       	'somenewemail@gmail.com',
		//     );
		// });

		// it('should set the password value on change event', () => {
		//     container.find('input[type="password"]').prop('onChange')({
		//       	target: {
		//       		id: 'passOrg',
		//         	value: 'somenewpassword',
		//       	},
		//     });
		//     expect(container.find('input[type="password"]').prop('value')).toEqual(
		//       	'somenewpassword',
		//     );
		// });

	});


});



