import * as actionTypes from './actions';

const createJobStart = () => {
	return {
		type: actionTypes.CREATEJOBSTART
	};
};
const createJobSuccess = () => {
	return {
		type: actionTypes.CREATEJOBSUCCESS
	};
};
const createJobFail = () => {
	return {
		type: actionTypes.CREATEJOBFAIL
	};
};

export const createJob = (jobData, authData) => {
	return async dispatch => {
		dispatch(createJobStart());
		try {
			const res = await fetch('http://localhost:5000/api/jobs', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authData.token}`
				},
				body: JSON.stringify({
					jobTitle: jobData.jobTitle,
					company: jobData.company,
					description: jobData.description,
					city: jobData.city,
					region: jobData.region,
					jobDescription: jobData.jobDescription,
					jobQualification: jobData.jobQualification,
					technicalRequirement: jobData.technicalRequirement,
					level: jobData.level,
					employment: jobData.employment,
					jobFunction: jobData.jobFunction,
					benefit: jobData.benefit,
					expiredDate: jobData.expiredDate,
					salary: jobData.salary,
					companyId: authData.userId
				})
			});
			if (!res.ok) {
				throw new Error('Could not create job, please try again');
			}
			const responseJSON = await res.json();
			console.log(responseJSON);
			dispatch(createJobSuccess());
			return responseJSON;
		} catch (err) {
			dispatch(createJobFail());
			return err;
		}
	};
};