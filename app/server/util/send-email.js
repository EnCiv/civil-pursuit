'use strict';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'Zoho',
	auth: {
		user: process.env.ZOHO_USERS,
		pass: process.env.ZOHO_PASSWORD
	}
});

function sendEmail(options = {}) {
	console.log('Sending email', options);
	return new Promise(async (pass, fail) => {
		if (!options.to)
			return fail(new Error('Missing email recipient'));
		if (!options.subject)
			return fail(new Error('Missing email subject'));
		if (process.env.NODE_ENV !== 'production') {
			console.log('Not sending emails when not in production', process.env.NODE_ENV);
			return pass();
		}
		let results = await transporter.sendMail(options)
		if (results.response === '250 Message received')
			pass();
		else {
			console.error("sendEmail failed with:", results.response)
			fail(new Error(results.response));
		}
	});
}

export default sendEmail;
