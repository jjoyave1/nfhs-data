import './App.css';

import * as React from 'react';
import { CircularProgress, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const DEFAULT_ASSOCIATION = '18bad24aaa';

class EventTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
			association: DEFAULT_ASSOCIATION,
			startDate: undefined,
			endDate: undefined
		}
		this._handleAssociationChange = this._handleAssociationChange.bind(this);
		this._handleStartDateChange = this._handleStartDateChange.bind(this);
		this._handleEndDateChange = this._handleEndDateChange.bind(this);
	}

	componentDidMount() {
		this.loadData();
	}

	componentDidUpdate(previousProps, previousState) {
		if (previousState.startDate !== this.state.startDate ||
			previousState.endDate !== this.state.endDate ||
			previousState.association !== this.state.association) {	
				this.loadData();
			}
	}

	_handleAssociationChange(e) {
		const association = e.target.value;
		this.setState(state => {
			return {
				...state,
				association: association
			}
		});
	}

	_handleStartDateChange(e) {
		const startDate = e.target.value;
		this.setState(state => {
			return {
				...state,
				startDate: startDate
			}
		});
	}

	_handleEndDateChange(e) {
		const endDate = e.target.value;
		this.setState(state => {
			return {
				...state,
				endDate: endDate
			}
		});
	}

	loadData() {
		const key = this.state.association;
		let API_URL = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?`
			API_URL += `state_association_key=${key}&`
			API_URL += `card=true&`
			API_URL += `size=50&`
			API_URL += `start=0`;

		if (this.state.startDate) {
			let startDate = new Date(this.state.startDate).toISOString();
			API_URL += `&from=${startDate}`;
		}

		if (this.state.endDate) {
			let endDate = new Date(this.state.endDate).toISOString();
			API_URL += `&to=${endDate}`;
		}


		fetch(API_URL)
			.then((res) => res.json())
			.then((result => {
				this.setState({
					isLoaded: true,
					items: extractData(result.items)
				})
			}));

		function extractData(events) {
			events = events || [];
			return [].concat(events.map(e => {
				let subheadline = '';
				const teams = e.teams || [];
				for (let i=0, iLen = teams.length; i < iLen; i++) {
					const team = teams[i];
					subheadline += team.name;
					if (iLen > 1 && i === 0) {
						subheadline += ' vs. ';
					}
				}

				return {
					key: e.key,
					headline: e.headline,
					subheadline: e.subheadline || subheadline,
					date: e.date || e.local_start_time
				}
			}));
		}
	}

	render() {
		const { isLoaded, items } = this.state;

		let rows = items;

		return isLoaded ? (
			<div style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column'
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					marginBottom: '8px',
					alignItems: 'center'
				}}>

					<InputLabel style={{
							width: '200px'
						}}>
							State Association
					</InputLabel>

					<Select
						id="association"
						value={this.state.association}
						onChange={this._handleAssociationChange}
						style={{
							width: '200px'
						}}>
						<MenuItem value='18bad24aaa'>GHSA</MenuItem>
						<MenuItem value='542bc38f95'>THSA</MenuItem>
					</Select>
				</div>
				<div style={{
					display: 'flex',
					marginBottom: '8px',
					justifyContent: 'center',
					flexDirection: 'row'
				}}>
					<TextField
						id="startDate"
						display="flex"
						label="Start Date"
						onChange={this._handleStartDateChange}
						type="date"
						InputLabelProps={{
							shrink: true
						}}
					/>
					<TextField
						id="endDate"
						display="flex"
						label="End Date"
						onChange={this._handleEndDateChange}
						type="date"
						InputLabelProps={{
							shrink: true
						}}
					/>
				</div>
				<div style={{
					padding: '4px',
					minHeight: '600px'
				}}>
					<TableContainer component={Paper} display="flex">
						<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Key</TableCell>
								<TableCell align="right">Headline</TableCell>
								<TableCell align="right">Subheadline</TableCell>
								<TableCell align="right">Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.key}>
									<TableCell component="th" scope="row">
										{row.key}
									</TableCell>
									<TableCell align="right">{row.headline}</TableCell>
									<TableCell align="right">{row.subheadline}</TableCell>
									<TableCell align="right">{new Date(row.date).toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
			) : (
			<div style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				minHeight: '700px',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<CircularProgress />
			</div>
			)
	}
}

export default function App() {
	return (
		<EventTable/>
	);
}
