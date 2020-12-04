import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { useForm } from '../../../../../shared/utils/useForm';
import moment from 'moment';

import * as actionTypes from '../../../../../store/actions/actions';
import * as actionCreators from '../../../../../store/actions/index';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../../../../shared/utils/validator';

import Modal from '../../../../../shared/UI_Element/Modal';
import SpinnerCircle from '../../../../../shared/UI_Element/Spinner/SpinnerCircle';
import Input from '../../../../../shared/UI_Element/Input';
import SaveButton from '../../../../../shared/UI_Element/SaveButton';

import classes from './EditSummary.module.css';

const EditSummary = props => {
	const { applicantid } = useParams();

	const [ data, setData ] = useState();

	const { getOneApplicant } = props;
	useEffect(
		() => {
			getOneApplicant(applicantid).then(res => {
				setData(res.applicant);
			});
		},
		[ getOneApplicant, applicantid ]
	);

	const [ formState, onInputHandler ] = useForm(
		{
			details: {
				value: data ? data.details : null,
				isValid: data && data.details ? true : false
			},
			dateOfBirth: {
				value: data ? data.dateOfBirth : null,
				isValid: data && data.dateOfBirth ? true : false
			}
		},
		false
	);

	const onSubmitHandler = async event => {
		event.preventDefault();

		if (!formState.formIsValid) {
			return props.updateApplicantFail();
		}

		const updatedAppSummary = {
			applicantId: applicantid,
			details: formState.inputs.details.value,
			dateOfBirth: formState.inputs.dateOfBirth.value
		};
		try {
			const res = await props.updateApplicantSummary(updatedAppSummary);
			console.log(res);
			if (res) {
				console.log(res);
			} else {
				console.log('no res detected');
			}
			props.history.push(`/ap/${applicantid}`);
		} catch (err) {
			console.log(err);
		}
	};

	let formContent = <SpinnerCircle />;

	if (!props.isLoading && data) {
		formContent = (
			<React.Fragment>
				<div className={classes.ContainerFlex}>
					<p className={classes.FormTitle}>Summary</p>

					<div className={classes.FormRow}>
						<div className={classes.EditLabel}>
							<Input
								inputType='textarea'
								id='details'
								inputClass='EditProfileTextArea'
								validatorMethod={[ VALIDATOR_MINLENGTH(20) ]}
								onInputHandler={onInputHandler}
								label='Details*'
								initValue={data.details}
								initIsValid={true}
							/>
						</div>

						<div className={classes.EditLabel}>
							<Input
								inputType='input'
								id='dateOfBirth'
								inputClass='AddJobInput'
								validatorMethod={[ VALIDATOR_REQUIRE() ]}
								onInputHandler={onInputHandler}
								label='Date of Birth (MM/DD/YYYY)*'
								initValue={moment(data.dateOfBirth).format('MM/ DD/ YYYY')}
								initIsValid={true}
							/>
						</div>
					</div>

					<SaveButton btnClass='SaveButton' disabled={!formState.formIsValid} placeholder='Save' />
				</div>
			</React.Fragment>
		);
	}

	const onCancelHandler = () => {
		props.resetApplicant();
	};

	return (
		<form onSubmit={onSubmitHandler} className={classes.Container}>
			<Modal show={props.error} onCancel={onCancelHandler}>
				Could not update changes at the moment, please try again later
			</Modal>
			{formContent}
		</form>
	);
};

const mapStateToProps = state => {
	return {
		isLoading: state.applicant.isLoading,
		error: state.applicant.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateApplicantFail: () => dispatch({ type: actionTypes.UPDATEAPPLICANTFAIL }),
		resetApplicant: () => dispatch({ type: actionTypes.APPLICANTRESET }),
		getOneApplicant: data => dispatch(actionCreators.getOneApplicant(data)),
		updateApplicantSummary: ApplicantData => dispatch(actionCreators.updateApplicantSummary(ApplicantData))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditSummary));
