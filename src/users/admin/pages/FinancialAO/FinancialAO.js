import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useForm } from '../../../../shared/utils/useForm';

import * as actionCreators from '../../../../store/actions';
import { VALIDATOR_ALWAYSTRUE } from '../../../../shared/utils/validator';
import Spinner from '../../../../shared/UI_Element/Spinner/SpinnerCircle';
import Input from '../../../../shared/UI_Element/Input';
// import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import classes from './FinancialAO.module.css';

const FinancialAO = props => {
	let total = [];
	let revenue = 0;
	const [fetchData, setFetchData] = useState();
	const [displayData, setDisplayData] = useState();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const [formState, onInputHandler] = useForm(
		{
			start: {
				value: null,
				isValid: true
			},
			end: {
				value: null,
				isValid: true
			}
		},
		true
	);

	const { getWholeOrderREG, getWholeOrderBC } = props;
	useEffect(
		() => {
			let totalOrder = [];
			const token = props.admin.token;
			if (token) {
				const fetchData = async () => {
					let resreg;
					let resbc;
					try {
						resreg = await getWholeOrderREG(token);
						resbc = await getWholeOrderBC(token);
					} catch (err) {
						console.log(err);
					}
					totalOrder = [...resreg.orderreg, ...resbc.orderbc];
					totalOrder = totalOrder.sort((a, b) => moment(b.createdAt) - moment(a.createdAt));
					setFetchData(totalOrder);
				};
				fetchData();
			}
		},
		[getWholeOrderREG, getWholeOrderBC, props.admin]
	);

	useEffect(
		() => {
			if (fetchData) {
				let filteredOrders = [...fetchData];
				if (formState?.inputs?.start?.value && formState?.inputs?.end?.value) {
					filteredOrders = filteredOrders.filter(order =>
						moment(order.createdAt).isBetween(
							moment(moment(formState.inputs.start.value).format('LL')),
							moment(`${moment(formState.inputs.end.value).format('LL')} 23:59:59`),
							undefined,
							[]
						)
					);
				}
				setDisplayData(filteredOrders)
			}
		},
		[fetchData, formState.inputs.start.value, formState.inputs.end.value]
	);
	// console.log(formState.inputs)

	let content = <Spinner />;

	if (displayData && !props.isLoading) {
		content = (
			<div className={classes.FlexContainer}>
				<div className={classes.Container}>
					<div className={classes.HeaderContainer}>
						<h1 className={classes.Header}>CrossBell Finance</h1>
						<div className={classes.DateFilter}>
							<p className={classes.DateLabel}>Tanggal awal</p>
							<Input
								inputType='customdate'
								id='start'
								validatorMethod={[VALIDATOR_ALWAYSTRUE()]}
								onInputHandler={onInputHandler}
								onChange
								views={['year', 'month', 'date']}
								maxDate={moment()}
								initIsValid={true}
								initValue={null}
								format='dd/MM/yyyy'
							/>
						</div>

						<div className={classes.DateFilter}>
							<p className={classes.DateLabel}>Tanggal akhir</p>
							<Input
								inputType='customdate'
								id='end'
								validatorMethod={[VALIDATOR_ALWAYSTRUE()]}
								onInputHandler={onInputHandler}
								views={['year', 'month', 'date']}
								maxDate={moment()}
								initIsValid={true}
								initValue={null}
								format='dd/MM/yyyy'
							/>
						</div>
					</div>
					<div className={classes.TableHolder}>
						<table className={classes.Table}>
							<thead className={classes.RowField}>
								<tr>
									<th>No</th>
									<th>Company name</th>
									<th>Order ID</th>
									<th>Order type</th>
									<th>Package name</th>
									<th>Created at</th>
									<th>Approved at</th>
									<th>Quantity</th>
									<th>Price</th>
									<th>Total price</th>
									<th>Status</th>
								</tr>
							</thead>

							<tbody className={classes.ColumnField}>
								{displayData.map((fin, i) => {
									return (
										<tr key={fin._id}>
											<th>{i + 1}</th>
											<th>{fin.companyId.companyName}</th>
											<th>{fin._id}</th>
											<th> {fin.slot ? 'order reguler' : 'order bulk candidate'}</th>
											<th>{fin.slot ? fin.packageName : '-'}</th>
											<th>{moment(fin.createdAt).format('D MMM YYYY')}</th>
											<th>{moment(fin.approvedAt).format('D MMM YYYY')}</th>
											{/* ========== Slot ========== */}
											{fin.status === 'Pending' ? (
												<th
													style={{
														fontSize: '0.9rem',
														color: 'rgb(250, 129, 0)'
													}}>
													pending
												</th>
											) : (
												<th style={{ fontSize: '0.9rem' }}>
													<p style={{ margin: '-0.5rem 0 -1rem 0' }}>
														{fin.slot || fin.amount}
														<span style={{ margin: '0 0 0 1rem' }}>{fin.slot ? 'slot' : 'candidate'}</span>
													</p>
												</th>
											)}

											{/* ========== Price/Slot ========== */}
											{fin.status === 'Pending' ? (
												<th style={{ color: 'rgb(250, 129, 0)' }}>pending</th>
											) : (
												<th>Rp. {(fin.pricePerSlot || fin.price).toLocaleString()}</th>
											)}

											{/* ========== Total Price ========== */}
											{fin.status === 'Pending' ? (
												<th style={{ color: 'rgb(250, 129, 0)' }}>
													{/* {() => {
                          parseInt((total[i] = 0));
                          return null;
                        }}
                        {fin.totalPrice.toLocaleString()} */}
													pending
												</th>
											) : (
												<th>Rp. {parseInt((total[i] = fin.totalPrice)).toLocaleString()}</th>
											)}

											<th
												style={
													fin.status === 'Pending' ? (
														{ color: 'rgb(250, 129, 0)', fontWeight: 'bold' }
													) : fin.status === 'Expired' ? (
														{ color: 'Gray', fontWeight: 'bold' }
													) : (
														{ color: 'green', fontWeight: 'bold' }
													)
												}>
												{fin.status}
											</th>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<div className={classes.RevenueContainer}>
						<div className={classes.RevenueLabel}>
							<div className={classes.Label}>Revenue/ month</div>
							<div className={classes.Label}>Revenue/ year</div>
						</div>
						<div className={classes.RevenueNumber}>
							<div className={classes.Label}>
								{total.map(tot => {
									revenue = revenue + tot;
									return null;
								})}
								Rp. {revenue.toLocaleString()},-
							</div>
							<div className={classes.Label}>Rp. {(revenue * 12).toLocaleString()},-</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return content;
};

const mapStateToProps = state => {
	return {
		admin: state.admin,
		isLoading: state.finance.isLoading,
		error: state.finance.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getWholeOrderREG: token => dispatch(actionCreators.getWholeOrderREG(token)),
		getWholeOrderBC: token => dispatch(actionCreators.getWholeOrderBC(token))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FinancialAO);
