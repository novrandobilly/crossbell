import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actionCreators from '../../../../store/actions';
import SpinnerCircle from '../../../../shared/UI_Element/Spinner/SpinnerCircle';
import CloseIcon from '@material-ui/icons/Close';

import classes from './CompanyJobList.module.css';

const CompanyJobList = (props) => {
  const { companyid } = useParams();

  const [unreleasedData, setUnreleasedData] = useState();
  const [expiredData, setExpiredData] = useState();
  const [displayData, setDisplayData] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { getJobsInCompany } = props;
  useEffect(() => {
    const token = props.auth.token;
    if (token) {
      const payload = {
        token: token,
        companyId: companyid,
      };

      getJobsInCompany(payload).then((res) => {
        if (res && res.foundJob) {
          setDisplayData(
            res.foundJob
              .filter(
                (dat) =>
                  dat.releasedAt != null && moment(dat.expiredDate) > moment()
              )
              .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
          );

          setExpiredData(
            res.foundJob
              .filter(
                (dat) =>
                  dat.releasedAt != null && moment(dat.expiredDate) < moment()
              )
              .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
          );

          setUnreleasedData(
            res.foundJob
              .filter((dat) => dat.releasedAt === null)
              .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
          );
        } else {
          setDisplayData(null);
          setUnreleasedData(null);
        }
      });
    }
  }, [getJobsInCompany, companyid, props.auth]);

  const onDeleteHandler = async (id) => {
    const token = props.auth.token;
    try {
      const payload = {
        jobId: id,
        token: token,
      };
      const res = await props.deleteJob(payload);
      if (res) {
        console.log(res);
        setUnreleasedData(unreleasedData.filter((fil) => fil._id !== id));
      } else {
        console.log('No job with id:' + { id } + 'found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  let content = <SpinnerCircle />;

  if (!props.isLoading && displayData && displayData.length > 0) {
    content = (
      <div className={classes.Container}>
        <p className={classes.ContainerTitle}>
          Hi, Selamat datang di crossbell
        </p>
        <p className={classes.ContainerTitleDetail}>
          Lihat iklan pekerjaan perusahaan mu disini
        </p>
        <div className={classes.CardContainer}>
          <div className={classes.BorderLine}>Belum ditayangkan</div>

          <div className={classes.DivContainer}>
            {unreleasedData && unreleasedData.length > 0 ? (
              unreleasedData.map((job, i) => {
                return (
                  <div key={job.id} className={classes.CardHolder}>
                    <div className={classes.JobCard}>
                      <div className={classes.CardHeader}>
                        <div>
                          <p className={classes.CardTitle}>{job.jobTitle}</p>
                          <p className={classes.CardAddress}>
                            {job.placementLocation}
                          </p>
                        </div>
                        <div>
                          <button onClick={() => onDeleteHandler(job.id)}>
                            <CloseIcon />
                          </button>
                        </div>
                      </div>
                      <Link to={`/jobs/new/edit/${job.id}`}>
                        <div>
                          <p className={classes.CardRecipient}>
                            {job.emailRecipient}
                          </p>
                          <div className={classes.CardBody}>
                            <p className={classes.CardApplicant}>
                              {job.jobApplicants.length}
                            </p>
                            <p>applicants applied </p>
                          </div>
                          <div className={classes.CardFooter}>
                            <p
                              className={classes.ExpDate}
                              style={{ color: '#FF8C00' }}
                            >
                              belum ditayangkan
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={classes.EmptyText}>
                Belum ada draft iklan pekerjaan tersimpan
              </p>
            )}
          </div>

          <div className={classes.BorderLine}>Sedang ditayangkan</div>

          <div className={classes.DivContainer}>
            {!props.isLoading && displayData && displayData.length > 0 ? (
              displayData.map((job, i) => {
                return (
                  <div key={job.id} className={classes.CardHolder}>
                    <div className={classes.JobCard}>
                      <div className={classes.CardHeader}>
                        <div>
                          <p className={classes.CardTitle}>{job.jobTitle}</p>
                          <p className={classes.CardAddress}>
                            {job.placementLocation}
                          </p>
                        </div>
                      </div>
                      <Link to={`/jobs/${job.id}`}>
                        <div>
                          <p className={classes.CardRecipient}>
                            {job.emailRecipient}
                          </p>
                          <div className={classes.CardBody}>
                            <p
                              style={{
                                fontSize: '3rem',
                                marginBottom: '-0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              {job.jobApplicants.length}
                            </p>
                            <p>applicants applied </p>
                          </div>
                          <div className={classes.CardFooter}>
                            <p
                              className={classes.ExpDate}
                              style={{ color: '#32CD32' }}
                            >
                              {`expired in ${moment(job.expiredDate).diff(
                                moment(),
                                'days'
                              )} days`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : props.isLoading &&
              unreleasedData &&
              unreleasedData.length > 0 ? (
              <div />
            ) : (
              <p className={classes.EmptyText}>
                Belum ada pekerjaan yang ditayangkan oleh perusahaan ini
              </p>
            )}
          </div>

          <div className={classes.BorderLine}>Sudah lewat masa tayang</div>

          <div className={classes.DivContainer}>
            {expiredData && expiredData.length > 0 ? (
              expiredData.map((job, i) => {
                return (
                  <div key={job.id} className={classes.CardHolder}>
                    <div className={classes.JobCard}>
                      <div className={classes.CardHeader}>
                        <div>
                          <p className={classes.CardTitle}>{job.jobTitle}</p>
                          <p className={classes.CardAddress}>
                            {job.placementLocation}
                          </p>
                        </div>
                      </div>
                      <Link to={`/jobs/new/edit/${job.id}`}>
                        <div>
                          <p className={classes.CardRecipient}>
                            {job.emailRecipient}
                          </p>
                          <div className={classes.CardBody}>
                            <p
                              style={{
                                fontSize: '3rem',
                                marginBottom: '-0.5rem',
                                marginTop: '1rem',
                              }}
                            >
                              {job.jobApplicants.length}
                            </p>
                            <p>applicants applied </p>
                          </div>
                          <div className={classes.CardFooter}>
                            <p className={classes.ExpDate}>expired</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={classes.EmptyText}>
                Belum ada iklan pekerjaan habis masa tayang
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!props.isLoading && (!displayData || displayData.length < 1)) {
    content = (
      <p className={classes.EmptyText}>
        Anda belum memasang iklan pekerjaan sebelumnya
      </p>
    );
  }

  return content;
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isLoading: state.job.isLoading,
    error: state.job.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteJob: (payload) => dispatch(actionCreators.deleteJob(payload)),
    getJobsInCompany: (payload) =>
      dispatch(actionCreators.getJobsInCompany(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyJobList);
