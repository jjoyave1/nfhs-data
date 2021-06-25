import './App.css';

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class EventTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: [],
			association: '18bad24aaa'
		}
		this._handleAssociationChange = this._handleAssociationChange.bind(this);
		this._handleStartDateChange = this._handleStartDateChange.bind(this);
		this._handleEndDateChange = this._handleEndDateChange.bind(this);
	}

	componentDidMount() {
		this.loadData(this.state.association);
	}

	componentDidUpdate(props, state, snapshot) {
		this.loadData();
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
		console.log('Start Date');
		console.log(e.target.value);
	}

	_handleEndDateChange(e) {
		console.log('End Date');
		console.log(e.target.value);
	}

	loadData() {
		const key = this.state.association;
		const API_URL = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=${key}&amp;card=true&amp;size=50&amp;start=0`;

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
				const isSportEvent = e.level && e.sport;

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
					headline: isSportEvent ? `${e.level} ${e.sport}` : e.activity_name,
					subheadline: subheadline,
					date: e.local_start_time
				}
			}));
		}
	}

	render() {
		const { isLoaded, items } = this.state;

		let rows = items;

		return isLoaded ? (
			<div style={{ width: '100%' }}>
				<div>
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
								<TableCell align="right">{row.date}</TableCell>
							</TableRow>
						))}
					</TableBody>
					</Table>
				</TableContainer>
			</div>
			) : ( <CircularProgress />)
	}
}

export default function App() {
	return (
		<EventTable/>
	);
}
