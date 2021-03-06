import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useForm } from '../../../../shared/utils/useForm';

import Button from '@material-ui/core/Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as actionTypes from '../../../../store/actions/actions';
import * as actionCreators from '../../../../store/actions/index';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_ALWAYSTRUE,
} from '../../../../shared/utils/validator';

import Modal from '../../../../shared/UI_Element/Modal';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Input from '../../../../shared/UI_Element/Input';
import SpinnerCircle from '../../../../shared/UI_Element/Spinner/SpinnerCircle';
import classes from './EditIntro.module.css';

const EditIntro = (props) => {
  const { companyid } = useParams();

  const [data, setData] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { getOneCompany } = props;
  useEffect(() => {
    getOneCompany({ userId: companyid }).then((res) => {
      setData(res.company);
    });
  }, [getOneCompany, companyid]);

  let push = props.push;

  const [formState, onInputHandler] = useForm(
    {
      logo: {
        value: data ? data.logo : null,
        isValid: true,
      },
      companyName: {
        value: data ? data.companyName : null,
        isValid: data && data.companyName ? true : false,
      },
      email: {
        value: data ? data.email : null,
        isValid: data && data.email ? true : false,
      },
      industry: {
        value: data ? data.industry : null,
        isValid: data && data.industry ? true : false,
      },
      NPWP: {
        value: data ? data.NPWP : null,
        isValid: true,
      },
      address: {
        value: data ? data.address : null,
        isValid: data && data.address ? true : false,
      },
      website: {
        value: data ? data.website : null,
        isValid: true,
      },
    },
    true
  );

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formState.formIsValid) {
      return props.updateCompanyFail();
    }

    const updatedIntro = {
      companyId: companyid,
      logo: formState.inputs.logo.value,
      companyName: formState.inputs.companyName.value,
      email: formState.inputs.email.value,
      industry: formState.inputs.industry.value,
      address: formState.inputs.address.value,
      website: formState.inputs.website.value,
      NPWP: formState.inputs.NPWP.value,
      token: props.auth.token,
    };
    try {
      const res = await props.updateCompanyIntro(updatedIntro);
      if (res) {
        // console.log(res);
        if (push) {
          return props.onNextHandler();
        }
      } else {
        console.log('no res detected');
      }

      !push && props.history.push(`/co/${companyid}/profile`);
    } catch (err) {
      console.log(err);
    }
  };

  const onUploadHandler = (e) => {
    const elementId = e.target.name;
    const elementFile = e.target.files[0];
    onInputHandler(elementId, elementFile, true);
  };

  let formContent = <SpinnerCircle />;

  if (!props.isLoading && data) {
    formContent = (
      <React.Fragment>
        <div className={classes.ContainerFlex}>
          <p className={classes.FormTitle}>Edit Company Intro</p>

          <div className={classes.FormRow}>
            <div className={classes.EditLabel}>
              <div className={classes.ProfilePicture}>
                {data.logo ? (
                  <div
                    className={classes.Avatar}
                    style={{
                      backgroundImage: `url('${data.logo.url}')`,
                    }}
                  />
                ) : (
                  <AccountCircleIcon
                    style={{
                      fontSize: '15rem',
                      marginBottom: '1rem',
                    }}
                  />
                )}
                <label className={classes.InputButton}>
                  <input
                    accept='.jpg, .jpeg, .png'
                    name='logo'
                    className={classes.input}
                    id='logo'
                    type='file'
                    style={{ display: 'none' }}
                    onChange={onUploadHandler}
                  />
                  <span className={classes.InputButtonText}> Upload Logo </span>
                </label>
                <span>
                  <em style={{ color: 'gray' }}>Ukuran file max 500kb</em>
                </span>
                {formState.inputs.logo.value ? (
                  formState.inputs.logo.value.size > 500000 ? (
                    <span>
                      <em style={{ color: 'red' }}>
                        File is too large. Please provide max. 500kb image
                      </em>
                    </span>
                  ) : (
                    <span>
                      <em>{formState.inputs.logo.value.name}</em>
                    </span>
                  )
                ) : null}
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='companyName'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_REQUIRE()]}
                  onInputHandler={onInputHandler}
                  label='Nama perusahaan*'
                  initValue={data.companyName || ''}
                  initIsValid={data.companyName}
                  helperText='Nama perusahaan wajib diisi'
                />
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='email'
                  name='email'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_EMAIL()]}
                  onInputHandler={onInputHandler}
                  label='Email login*'
                  initValue={data.email || ''}
                  initIsValid={data.email}
                  helperText='Please input a valid email address'
                />
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='industry'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_REQUIRE()]}
                  onInputHandler={onInputHandler}
                  label='Bergerak di bidang*'
                  initValue={data.industry || ''}
                  initIsValid={data.industry}
                  helperText='Bidang perusahaan wajib diisi'
                />
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='address'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_REQUIRE()]}
                  onInputHandler={onInputHandler}
                  label='Alamat*'
                  initValue={data.address || ''}
                  initIsValid={data.address}
                  helperText='Alamat perusahaan wajib diisi'
                />
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='NPWP'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_REQUIRE()]}
                  onInputHandler={onInputHandler}
                  label='NPWP'
                  initValue={data.NPWP || ''}
                  initIsValid={data.NPWP}
                  helperText='NPWP wajib diisi'
                />
              </div>
              <div className={classes.InputBox}>
                <Input
                  inputType='input'
                  id='website'
                  inputClass='AddJobInput'
                  validatorMethod={[VALIDATOR_ALWAYSTRUE()]}
                  onInputHandler={onInputHandler}
                  label='Website'
                  initValue={data.website || ''}
                  initIsValid={data.website}
                />
              </div>
            </div>
          </div>

          <div className={classes.Footer}>
            <Button
              disabled={!formState.formIsValid}
              variant='contained'
              color='primary'
              type='submit'
              className={classes.button}
              endIcon={<NavigateNextIcon />}
            >
              {push ? 'Next' : 'Save'}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  const onCancelHandler = () => {
    props.resetCompany();
  };

  return (
    <div className={!push ? classes.EditIntro : classes.AddIntro}>
      <form onSubmit={onSubmitHandler} className={classes.Container}>
        <Modal show={props.error} onCancel={onCancelHandler}>
          Could not update changes at the moment, please try again later
        </Modal>
        {formContent}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.company.isLoading,
    error: state.company.error,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCompanyFail: () => dispatch({ type: actionTypes.UPDATECOMPANYFAIL }),
    resetCompany: () => dispatch({ type: actionTypes.COMPANYRESET }),
    getOneCompany: (data) => dispatch(actionCreators.getOneCompany(data)),
    updateCompanyIntro: (CompanyData) =>
      dispatch(actionCreators.updateCompanyIntro(CompanyData)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditIntro));
