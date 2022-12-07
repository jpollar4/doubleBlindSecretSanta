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
import { listGuestInfos } from "./graphql/queries";
import {
	createParty as createPartyMutation,
	createGuestInfo as createGuestInfoMutation,
} from "./graphql/mutations";
import { Party } from "./PartiesPage";
import { onCreateGuestInfo, onUpdateGuestInfo } from "./graphql/subscriptions";
import { GuestSummary } from "./App";

export interface GuestInfo {
	id: string;
	partyID: string;
	email: string;
	myGuestToGiveTo?: string;
	name: string;
	phrase?: string;
}

export interface UpdateGuestInfoParams {
	name: string;
	phrase: string;
	partyID: string;
	email: string;
	id?: string;
}

const PartyView = (props: {
	party: Party;
	myEmail: string;
	partyGuests: GuestSummary[];
	onClearParty: () => void;
	onDeleteParty: (party: Party) => void;
	onCreateGuestInfo: (info: UpdateGuestInfoParams) => void;
	onUpdateGuestInfo: (info: UpdateGuestInfoParams) => void;
}) => {
	// const [parties, setParties] = useState<Party[]>([]);
	const [isHost, setIsHost] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEdittingPhrase, setIsEdditingPhrase] = useState(false);
	const [myGuestInfo, setMyGuestInfo] = useState<GuestInfo | undefined>();

	const {
		party,
		myEmail,
		onClearParty,
		onDeleteParty,
		onCreateGuestInfo,
		onUpdateGuestInfo,
		partyGuests,
	} = props;

	useEffect(() => {
		setIsHost(myEmail === party.host);
		fetchMyGuestInfo();
	}, [party]);

	const fetchMyGuestInfo = async () => {
		const apiData = await API.graphql(
			graphqlOperation(listGuestInfos, {
				filter: { email: { eq: myEmail }, partyID: { eq: party.id } },
			})
		);

		const partiesFromAPI = (apiData as any).data.listGuestInfos.items;
		if (partiesFromAPI.length > 0) {
			//should only ever be one
			setMyGuestInfo(partiesFromAPI[0]);
		}
		if (partiesFromAPI.length > 1) {
			console.error("SHOLD ONLY BE ONE!");
			console.error(partiesFromAPI);
		}
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

	// // async function createGuestInfo(event: any) {
	// // 	event.preventDefault();
	// // 	const form = new FormData(event.target);
	// // 	const data = {
	// // 		name: form.get("name"),
	// // 		phrase: form.get("description"),
	// // 		email: myEmail,
	// // 	};
	// // 	await API.graphql({
	// // 		query: createGuestInfoMutation,
	// // 		variables: { input: data },
	// // 	});
	// // 	fetchNotes();
	// // 	event.target.reset();
	// // }
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

	// async function deleteNote({ id }: { id: number }) {
	// 	// const newNotes = notes.filter((note: any) => note.id !== id);
	// 	// setNotes(newNotes);
	// 	// await API.graphql({
	// 	// 	query: deleteNoteMutation,
	// 	// 	variables: { input: { id } },
	// 	// });
	// }

	// async function openParty(id: number) {
	// 	console.log(id);
	// 	// const newNotes = notes.filter((note: any) => note.id !== id);
	// 	// setNotes(newNotes);
	// 	// await API.graphql({
	// 	// 	query: deleteNoteMutation,
	// 	// 	variables: { input: { id } },
	// 	// });
	// }

	function getParsedDate(dateString: string) {
		console.log(dateString);
		let date = String(dateString).split("T");
		var days = String(date[0]).split("-");
		var hours = String(date[1]).split(":");

		return `${parseInt(days[1])}/${parseInt(days[2])}/${parseInt(days[0])}`;
	}

	const updateEntry = async (event: any) => {
		event.preventDefault();
		const form = new FormData(event.target);
		const data: UpdateGuestInfoParams = {
			name: form.get("name") as string,
			phrase: form.get("phrase") as string,
			partyID: party.id,
			email: myEmail,
		};
		if (!myGuestInfo) {
			await onCreateGuestInfo(data);
		} else {
			data.id = myGuestInfo.id;
			await onUpdateGuestInfo(data);
		}
		fetchMyGuestInfo();
		event.target.reset();
	};

	const deleteButton = () => {
		if (isHost) {
			if (isDeleting) {
				return (
					<>
						<Button variation="primary" onClick={() => onDeleteParty(party)}>
							Delete Party!!!!
						</Button>
						<Button onClick={() => setIsDeleting(false)}>Cancel</Button>
					</>
				);
			} else {
				return (
					<Button onClick={() => setIsDeleting(true)}>Delete Party</Button>
				);
			}
		}
		return <></>;
	};

	const activateSecretSantaButton = () => {
		if (isHost) {
			return <Button onClick={() => {}}>Activate Party</Button>;
		}
		return <></>;
	};

	return (
		<View className="App">
			<Heading level={2}>{party.name}</Heading>
			<Heading level={2}>{getParsedDate(party.date)}</Heading>
			{isHost && <Heading level={2}>You're the host!</Heading>}
			{/* <View as="form" margin="3rem 0" onSubmit={createParty}>
				<Flex direction="row" justifyContent="center">
					<TextField
						name="name"
						placeholder="Note Name"
						label="Note Name"
						labelHidden
						variation="quiet"
						required
					/>
					<TextField
						name="description"
						placeholder="Note Description"
						label="Note Description"
						labelHidden
						variation="quiet"
						required
					/>
					<Button type="submit" variation="primary">
						Create Note
					</Button>
				</Flex>
			</View>
			<Heading level={2}>Current Parties</Heading>
			<View margin="3rem 0">
				{parties.map((party: any) => (
					<Flex
						key={party.id || party.name}
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Button variation="link" onClick={() => openParty(party.id)}>
							{`${party.name} ${getParsedDate(party.date)}`}
						</Button>
					
					</Flex>
				))}
			</View> */}
			<Heading level={1}>Your Phrase</Heading>
			<View as="form" margin="3rem 0" onSubmit={updateEntry}>
				<Flex direction="row" justifyContent="center">
					<TextField
						name="name"
						defaultValue={myGuestInfo?.name}
						label="Your Name"
						variation="quiet"
						required
					/>
					<TextField
						name="phrase"
						defaultValue={myGuestInfo?.phrase}
						label="Your Phrase"
						variation="quiet"
					/>
					<Button type="submit" variation="primary">
						Submit Change
					</Button>
				</Flex>
			</View>
			<Heading level={1}>Guests</Heading>
			<View margin="3rem 0">
				{partyGuests.map((g) => {
					return (
						<Flex direction="row" justifyContent="center">
							<TextField name="name" value={g.name} label="Name" isReadOnly />
							<TextField
								name="phrase"
								value={g.hasPhrase ? "Ready" : "Not Ready"}
								label="Status"
								isReadOnly
							/>
						</Flex>
					);
				})}
			</View>
			<Button onClick={onClearParty}>Close Party</Button>
			{activateSecretSantaButton()}
			{deleteButton()}
		</View>
	);
};

export default PartyView;
