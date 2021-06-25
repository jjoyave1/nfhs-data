import logo from './logo.svg';
import './App.css';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const API_URL = 'https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=18bad24aaa&amp;card=true&amp;size=50&amp;start=0';

export default function App() {
	const classes = useStyles();
	let rows = [];

	fetch(API_URL)
		.then((res) => res.json())
		.then((result => {
			console.log(result);
			rows = rows.concat(result.items);
		}));

	return (
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
					<TableRow key={row.id}>
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
	);
}
