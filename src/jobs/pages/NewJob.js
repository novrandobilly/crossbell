import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useForm } from '../../shared/utils/useForm';

import * as actionTypes from '../../store/actions/actions';
import * as actionCreators from '../../store/actions';
import Modal from '../../shared/UI_Element/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Spinner from '../../shared/UI_Element/Spinner/SpinnerCircle';
import Input from '../../shared/UI_Element/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_ALWAYSTRUE,
} from '../../shared/utils/validator';
import WorkFieldData from '../../shared/UI_Element/WorkFieldData';

import classes from './NewJob.module.css';

const NewJob = (props) => {
  const [maxSlot, setMaxSlot] = useState(null);

  // const [ fieldOfWork, setFieldOfWork ] = useState('');
  const [employment, setEmployment] = useState('');
  const [open, setOpen] = useState([false, false, false]);
  const [employmentOpen, setEmploymentOpen] = useState(false);

  const [formState, onInputHandler] = useForm(
    {
      jobTitle: {
        value: '',
        isValid: false,
      },
      jobDescriptions: {
        value: '',
        isValid: false,
      },
      jobQualification: {
        value: '',
        isValid: false,
      },
      technicalRequirement: {
        value: '',
        isValid: false,
      },
      placementLocation: {
        value: '',
        isValid: false,
      },

      emailRecipient: {
        value: '',
        isValid: true,
      },
      employment: {
        value: '',
        isValid: true,
      },
      salary: {
        value: '',
        isValid: true,
      },
      benefit: {
        value: '',
        isValid: true,
      },
      slotAllocation: {
        value: null,
        isValid: false,
      },
      fieldOfWork: {
        value: ['', '', ''],
        isValid: false,
      },
    },
    false
  );

  const { getOneCompany, auth } = props;
  useEffect(() => {
    const employment = document.getElementById('employment');
    const salary = document.getElementById('salary');
    const benefit = document.getElementById('benefit');

    onInputHandler('employment', employment.value, true);
    onInputHandler('salary', salary.value, true);
    onInputHandler('benefit', benefit.value, true);

    const getSlot = async () => {
      try {
        if (auth.userId) {
          const res = await getOneCompany({ userId: auth.userId });
          setMaxSlot(res.company.slotREG);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSlot();
  }, [onInputHandler, getOneCompany, auth]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!formState.formIsValid) {
      return props.createJobFail();
    }

    const jobData = {
      jobTitle: formState.inputs.jobTitle.value,
      placementLocation: formState.inputs.placementLocation.value,
      jobDescriptions: formState.inputs.jobDescriptions.value,
      jobQualification: formState.inputs.jobQualification.value,
      technicalRequirement: formState.inputs.technicalRequirement.value,
      emailRecipient: formState.inputs.emailRecipient.value,
      employment: formState.inputs.employment.value,
      benefit: formState.inputs.benefit.value,
      slot: formState.inputs.slotAllocation.value,
      salary: formState.inputs.salary.value,
      fieldOfWork: formState.inputs.fieldOfWork.value,
    };
    const authData = {
      token: props.auth.token,
      userId: props.auth.userId,
    };
    console.log(jobData);
    try {
      const res = await props.createJob(jobData, authData);
      console.log(res);
      props.history.push('/jobs-dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  const onSaveHandler = async (event) => {
    event.preventDefault();
    const jobData = {
      jobTitle: formState.inputs.jobTitle.value,
      placementLocation: formState.inputs.placementLocation.value,
      jobDescriptions: formState.inputs.jobDescriptions.value,
      jobQualification: formState.inputs.jobQualification.value,
      technicalRequirement: formState.inputs.technicalRequirement.value,
      emailRecipient: formState.inputs.emailRecipient.value,
      employment: formState.inputs.employment.value,
      benefit: formState.inputs.benefit.value,
      slot: formState.inputs.slotAllocation.value,
      salary: formState.inputs.salary.value,
      fieldOfWork: formState.inputs.fieldOfWork.value,
    };
    const authData = {
      token: props.auth.token,
      userId: props.auth.userId,
    };
    console.log(jobData);
    try {
      const res = await props.saveJobDraft(jobData, authData);
      console.log(res);
      props.history.push(`/co/${props.auth.userId}/jobList`);
    } catch (err) {
      console.log(err);
    }
  };

  const fowHandler = (e) => {
    let indexFow;
    switch (e.target.name) {
      case 'fieldOfWork-1':
        indexFow = 0;
        break;
      case 'fieldOfWork-2':
        indexFow = 1;
        break;
      case 'fieldOfWork-3':
        indexFow = 2;
        break;
      default:
        indexFow = 0;
    }
    const elementId = 'fieldOfWork';
    const elementArray = [...formState.inputs.fieldOfWork.value];
    elementArray[indexFow] = e.target.value;
    onInputHandler(elementId, elementArray, true);
    // setFieldOfWork(e.target.value);
  };

  const handleEmploymentChange = (e) => {
    const elementId = e.target.name;
    const elementValue = e.target.value;
    onInputHandler(elementId, elementValue, true);
    setEmployment(e.target.value);
  };

  const handleClose = () => {
    setOpen([false, false, false]);
  };

  const handleOpen = (e) => {
    let index;
    switch (e.target.id) {
      case 'fieldOfWork-1':
        index = 0;
        break;
      case 'fieldOfWork-2':
        index = 1;
        break;
      case 'fieldOfWork-3':
        index = 2;
        break;
      default:
        index = 0;
    }
    let openArray = [...open];
    openArray[index] = true;
    setOpen(openArray);
    // setOpen(true);
  };
  const handleEmploymentClose = () => {
    setEmploymentOpen(false);
  };

  const handleEmploymentOpen = () => {
    setEmploymentOpen(true);
  };

  let formContent = (
    <div className={classes.ContainerFlex}>
      <p className={classes.FormTitle}>Form Iklan Lowongan Pekerjaan</p>

      <div className={classes.Content}>
        <div className={classes.ContentLeft}>
          <div className={classes.ContentWrap}>
            <Input
              inputType='input'
              id='jobTitle'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_REQUIRE()]}
              onInputHandler={onInputHandler}
              label='Job Title*'
            />

            <Input
              inputType='input'
              id='placementLocation'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_REQUIRE()]}
              onInputHandler={onInputHandler}
              label='Lokasi Penempatan*'
            />
          </div>

          <div className={classes.ContentWrap}>
            <Input
              inputType='input'
              id='jobQualification'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_REQUIRE()]}
              onInputHandler={onInputHandler}
              label='Job Qualification*'
            />
            <Input
              inputType='input'
              id='technicalRequirement'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_REQUIRE()]}
              onInputHandler={onInputHandler}
              label='Technical Requirement*'
            />
          </div>

          <div className={classes.ContentWrap}>
            <FormControl
              className={classes.FormControl}
              style={{ marginTop: '.68rem' }}
            >
              <InputLabel id='employment' style={{ fontSize: '1rem' }}>
                Jenis Kontrak*
              </InputLabel>

              <Select
                id='employment'
                name='employment'
                open={employmentOpen}
                onClose={handleEmploymentClose}
                onOpen={handleEmploymentOpen}
                value={employment}
                onChange={handleEmploymentChange}
                style={{
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <MenuItem
                  id={0}
                  value='permanent'
                  style={{ fontSize: '0.9rem' }}
                >
                  Permanen
                </MenuItem>
                <MenuItem
                  id={0}
                  value='contract'
                  style={{ fontSize: '0.9rem' }}
                >
                  Kontrak
                </MenuItem>
                <MenuItem id={0} value='intern' style={{ fontSize: '0.9rem' }}>
                  Intern/Magang
                </MenuItem>
              </Select>
            </FormControl>

            <Input
              inputType='input'
              id='emailRecipient'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_REQUIRE()]}
              onInputHandler={onInputHandler}
              label='Email Recipient*'
              helperText='Please input a valid email address'
            />
          </div>

          <div className={classes.ContentWrap}>
            <FormControl
              className={classes.FormControl}
              style={{ marginTop: '.68rem' }}
            >
              <InputLabel id='fieldOfWorkLabel1' style={{ fontSize: '1rem' }}>
                Bidang pekerjaan (Wajib)
              </InputLabel>

              <Select
                labelId='fieldOfWorkLabel1'
                id='fieldOfWork-1'
                name='fieldOfWork-1'
                open={open[0]}
                onClose={handleClose}
                onOpen={handleOpen}
                value={formState.inputs.fieldOfWork.value[0]}
                onChange={fowHandler}
                style={{
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <MenuItem value='' style={{ fontSize: '0.9rem' }}>
                  <em>Pilih</em>
                </MenuItem>
                {WorkFieldData.sort().map((work, i) => {
                  return (
                    <MenuItem
                      id={i}
                      value={work}
                      style={{ fontSize: '0.9rem' }}
                      key={i}
                    >
                      {work}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl
              className={classes.FormControl}
              style={{ marginTop: '.68rem' }}
            >
              <InputLabel id='fieldOfWorkLabel2' style={{ fontSize: '1rem' }}>
                Bidang pekerjaan (Opsional)
              </InputLabel>

              <Select
                labelId='fieldOfWorkLabel2'
                id='fieldOfWork-2'
                name='fieldOfWork-2'
                open={open[1]}
                onClose={handleClose}
                onOpen={handleOpen}
                value={formState.inputs.fieldOfWork.value[1]}
                onChange={fowHandler}
                style={{
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <MenuItem value='' style={{ fontSize: '0.9rem' }}>
                  <em>Pilih</em>
                </MenuItem>
                {WorkFieldData.sort().map((work, i) => {
                  return (
                    <MenuItem
                      id={i}
                      value={work}
                      style={{ fontSize: '0.9rem' }}
                      key={i}
                    >
                      {work}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className={classes.ContentWrap}>
            <FormControl
              className={classes.FormControl}
              style={{ marginTop: '1.2rem' }}
            >
              <InputLabel id='fieldOfWorkLabel3' style={{ fontSize: '1rem' }}>
                Bidang pekerjaan (Opsional)
              </InputLabel>

              <Select
                labelId='fieldOfWorkLabel3'
                id='fieldOfWork-3'
                name='fieldOfWork-3'
                open={open[2]}
                onClose={handleClose}
                onOpen={handleOpen}
                value={formState.inputs.fieldOfWork.value[2]}
                onChange={fowHandler}
                style={{
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <MenuItem value='' style={{ fontSize: '0.9rem' }}>
                  <em>Pilih</em>
                </MenuItem>
                {WorkFieldData.sort().map((work, i) => {
                  return (
                    <MenuItem
                      id={i}
                      value={work}
                      style={{ fontSize: '0.9rem' }}
                      key={i}
                    >
                      {work}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      <div style={{ width: '95%', marginTop: '2rem' }}>
        <Input
          inputType='textarea'
          id='jobDescriptions'
          InputClass='AddJobInput'
          validatorMethod={[VALIDATOR_REQUIRE()]}
          onInputHandler={onInputHandler}
          label='Job Descriptions*'
        />
      </div>

      <div className={classes.AdditionalContentContainer}>
        <h2 className={classes.AdditionalContentHeader}>Informasi Tambahan</h2>
        <div className={classes.AdditionalContent}>
          <Input
            inputType='input'
            id='benefit'
            InputClass='AddJobInput'
            validatorMethod={[VALIDATOR_ALWAYSTRUE()]}
            onInputHandler={onInputHandler}
            label='Benefits (optional)'
            error={false}
          />

          <Input
            inputType='input'
            id='salary'
            InputClass='AddJobInput'
            validatorMethod={[VALIDATOR_ALWAYSTRUE()]}
            onInputHandler={onInputHandler}
            label='Salary (optional)'
            error={false}
          />
        </div>
      </div>
      <div className={classes.AdditionalContentContainer}>
        <h2 className={classes.AdditionalContentHeader}>Durasi Tayang</h2>
        <div className={classes.DurationContent}>
          <div className={classes.SlotInput}>
            <Input
              inputType='input'
              id='slotAllocation'
              InputClass='AddJobInput'
              validatorMethod={[VALIDATOR_MIN(1)]}
              onInputHandler={onInputHandler}
              type='number'
              min={0}
              max={parseInt(maxSlot) * 2 || 0}
              step='2'
            />
            <span>minggu</span>
          </div>
          <div className={classes.RemainingSlot}>
            <h3>
              Sisa slot:{' '}
              {formState.inputs.slotAllocation.value
                ? (
                    parseInt(maxSlot) -
                    parseInt(formState.inputs.slotAllocation.value) / 2
                  ).toString()
                : maxSlot}
            </h3>
          </div>
        </div>
      </div>

      <div
        style={{
          alignSelf: 'flex-end',
          marginRight: '1rem',
          marginTop: '2rem',
        }}
      >
        <Button
          variant='outlined'
          color='primary'
          type='submit'
          size='small'
          disableElevation
          onClick={onSaveHandler}
        >
          save draft
        </Button>

        {formState.inputs.slotAllocation.value <= maxSlot * 2 && (
          <Button
            variant='contained'
            color='primary'
            type='submit'
            size='small'
            disableElevation
            onClick={onSubmitHandler}
            disabled={!formState.formIsValid}
            style={{ marginLeft: '1rem' }}
          >
            save & publish
          </Button>
        )}
      </div>
    </div>
  );

  if (props.job.isLoading) {
    formContent = <Spinner />;
  }

  const onCancelHandler = () => {
    props.resetJob();
  };

  return (
    <React.Fragment>
      <Modal show={props.job.error} onCancel={onCancelHandler}>
        Tidak dapat memasang iklan pekerjaan saat ini{' '}
      </Modal>
      <form className={classes.Container}>{formContent}</form>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    job: state.job,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createJob: (jobData, authData) =>
      dispatch(actionCreators.createJob(jobData, authData)),
    saveJobDraft: (jobData, authData) =>
      dispatch(actionCreators.saveJobDraft(jobData, authData)),
    getOneCompany: (payload) => dispatch(actionCreators.getOneCompany(payload)),
    createJobFail: () => dispatch({ type: actionTypes.CREATEJOBFAIL }),
    resetJob: () => dispatch({ type: actionTypes.JOBRESET }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewJob));
