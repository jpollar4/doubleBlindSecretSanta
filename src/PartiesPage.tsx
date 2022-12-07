import React, { useState, useEffect } from "react";
import "./App.scss";
import "@aws-amplify/ui-react/styles.css";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
	Button,
	Flex,
	Heading,
	Text,
	TextField,
	View,
	withAuthenticator,
} from "@aws-amplify/ui-react";
import { listParties } from "./graphql/queries";
import {
	createParty as createPartyMutation,
	createGuestInfo as createGuestInfoMutation,
} from "./graphql/mutations";

export interface Party {
	id: string;
	name: string;
	date: string;
	host: string;
	started: boolean;
	GuestInfos: any[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreatePartyParams {
	name: string;
	host: string;
	date: Date;
}

const PartiesPage = (props: {
	onSelectParty: (party: Party) => void;
	onCreateParty: (params: CreatePartyParams) => void;
	parties: Party[];
	myEmail: string;
}) => {
	const [partyDate, setPartyDate] = useState<Date | null>(null);
	const { onSelectParty, parties, myEmail, onCreateParty } = props;

	const createParty = (event: any) => {
		event.preventDefault();
		const form = new FormData(event.target);
		console.log(form.get("date") as string);
		const date = new Date(form.get("date") as string);
		const data: CreatePartyParams = {
			name: form.get("name") as string,
			host: myEmail,
			date: date,
		};
		onCreateParty(data);
		event.target.reset();
	};

	// useEffect(() => {
	// 	Auth.currentSession()
	// 		.then((data) => {
	// 			console.log((data as any).idToken.payload.email);
	// 			setMyEmail((data as any).idToken.payload.email);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);

	// async function fetchParties() {
	// 	// const apiData = await API.graphql({
	// 	// 	query: listParties,
	// 	// 	variables: { host: myEmail },
	// 	// });
	// 	const apiData = await API.graphql(
	// 		graphqlOperation(listParties, {
	// 			filter: { host: { eq: myEmail } },
	// 		})
	// 	);
	// 	console.log((apiData as any).data.listParties);
	// 	const partiesFromAPI = (apiData as any).data.listParties.items;
	// 	console.log(partiesFromAPI);
	// 	setParties(partiesFromAPI);
	// }

	// async function createParty(event: any) {
	// 	event.preventDefault();
	// 	const form = new FormData(event.target);
	// 	const data = {
	// 		name: form.get("name"),
	// 		host: myEmail,
	// 		date: new Date(),
	// 	};
	// 	await API.graphql({
	// 		query: createPartyMutation,
	// 		variables: { input: data },
	// 	});

	// 	// const newParty = await API.graphql({
	// 	// 	query: createPartyMutation,
	// 	// 	variables: {
	// 	// 		input: {
	// 	// 			name: "Lorem ipsum dolor sit amet",
	// 	// 			date: "1970-01-01T12:30:23.999Z",
	// 	// 			host: "test12346789@testemailtestemail.com",
	// 	// 			started: true,
	// 	// 		},
	// 	// 	},
	// 	// });

	// 	fetchParties();
	// 	event.target.reset();
	// }

	async function deleteNote({ id }: { id: number }) {
		// const newNotes = notes.filter((note: any) => note.id !== id);
		// setNotes(newNotes);
		// await API.graphql({
		// 	query: deleteNoteMutation,
		// 	variables: { input: { id } },
		// });
	}

	async function openParty(party: Party) {
		onSelectParty(party);
		// const newNotes = notes.filter((note: any) => note.id !== id);
		// setNotes(newNotes);
		// await API.graphql({
		// 	query: deleteNoteMutation,
		// 	variables: { input: { id } },
		// });
	}

	function getParsedDate(dateString: string) {
		let date = String(dateString).split("T");
		var days = String(date[0]).split("-");
		var hours = String(date[1]).split(":");

		return `${parseInt(days[1])}/${parseInt(days[2])}/${parseInt(days[0])}`;
	}

	return (
		<View className="App">
			<Heading level={1}>Parties</Heading>

			<Heading level={2}>Current Parties</Heading>
			<View margin="3rem 0">
				{parties.map((party: any) => (
					<Flex
						key={party.id || party.name}
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Button variation="link" onClick={() => openParty(party)}>
							{`${party.name} ${getParsedDate(party.date)}`}
						</Button>
						{/* <Text as="strong" fontWeight={700}>
							{party.date}
						</Text>{" "} */}
						{/* <Text as="span">{party.host}</Text>
						<Text as="span">{party.phrase}</Text> */}
					</Flex>
				))}
			</View>
			<View as="form" margin="3rem 0" onSubmit={createParty}>
				<Flex direction="row" justifyContent="center">
					<TextField
						name="name"
						placeholder="Party Name"
						label="Party Name"
						labelHidden
						variation="quiet"
						required
					/>
					<TextField
						name="date"
						placeholder="Date"
						label="Date"
						type="date"
						labelHidden
						variation="quiet"
						required
					/>

					<Button type="submit" variation="primary">
						Create New Party
					</Button>
				</Flex>
			</View>
		</View>
	);
};

export default PartiesPage;
