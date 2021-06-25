import './App.css';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const API_URL = 'https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=18bad24aaa&amp;card=true&amp;size=50&amp;start=0';

class EventTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			items: []
		}
	}

	componentDidMount() {
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
			return events.map(e => {
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
			});
		}
	}

	render() {
		const classes = makeStyles({
			table: {
				minWidth: 650,
			},
		});

		const { isLoaded, items } = this.state;


		let rows = items;
		return isLoaded ? (
			<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
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
		) : ( <CircularProgress />)
	}
}

export default function App() {
	return (
		<EventTable/>
	);
}
