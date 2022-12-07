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
import { listGuestInfos, listParties } from "./graphql/queries";
import {
	createGuestInfo as createGuestInfoMutation,
	createParty as createPartyMutation,
	deleteParty as deletePartyMutation,
	updateGuestInfo as updateGuestInfoMutation,
} from "./graphql/mutations";
import PartiesPage, { CreatePartyParams, Party } from "./PartiesPage";
import PartyView, { UpdateGuestInfoParams } from "./PartyView";

export const guestInfosByPartyID = /* GraphQL */ `
	query GuestInfosByPartyID(
		$partyID: ID!
		$sortDirection: ModelSortDirection
		$filter: ModelGuestInfoFilterInput
		$limit: Int
		$nextToken: String
	) {
		guestInfosByPartyID(
			partyID: $partyID
			sortDirection: $sortDirection
			filter: $filter
			limit: $limit
			nextToken: $nextToken
		) {
			items {
				id
				partyID
				email
				name
			}
			nextToken
		}
	}
`;
export interface GuestSummary {
	name: string;
	hasPhrase: boolean;
}
interface GuestSummaryPerParty {
	[key: string]: GuestSummary[];
}

const App = ({ signOut }: { signOut?: () => void }) => {
	const [notes, setNotes] = useState([]);
	const [myEmail, setMyEmail] = useState("");
	const [currentParty, setCurrentParty] = useState<Party | undefined>();
	const [parties, setParties] = useState<Party[]>([]);

	const [guestsForParty, setGuestsForParty] = useState<GuestSummaryPerParty>(
		{}
	);

	useEffect(() => {
		if (myEmail !== "") {
			fetchParties();
		}
	}, [myEmail]);

	useEffect(() => {
		getGuestsForParty();
	}, [parties]);

	useEffect(() => {
		Auth.currentSession()
			.then((data) => {
				console.log((data as any).idToken.payload.email);
				setMyEmail((data as any).idToken.payload.email);
			})
			.catch((err) => console.log(err));
	}, []);

	const getGuestsForParty = async () => {
		const updatedSummary: GuestSummaryPerParty = {};
		await parties.forEach(async (p) => {
			let guestArray: GuestSummary[] = [];
			const apiDataReadyGuests = await API.graphql(
				graphqlOperation(guestInfosByPartyID, {
					partyID: p.id,
					filter: { phrase: { ne: "" } },
				})
			);
			console.log((apiDataReadyGuests as any).data.guestInfosByPartyID.items);
			(apiDataReadyGuests as any).data.guestInfosByPartyID.items.forEach(
				(g: any) => {
					guestArray.push({
						name: g.name,
						hasPhrase: true,
					});
				}
			);

			const apiDataNotReadyGuests = await API.graphql(
				graphqlOperation(guestInfosByPartyID, {
					partyID: p.id,
					filter: { phrase: { eq: "" } },
				})
			);
			console.log(
				(apiDataNotReadyGuests as any).data.guestInfosByPartyID.items
			);
			(apiDataNotReadyGuests as any).data.guestInfosByPartyID.items.forEach(
				(g: any) => {
					guestArray.push({
						name: g.name,
						hasPhrase: false,
					});
				}
			);
			updatedSummary[p.id] = guestArray;
			// const partiesFromAPI = (apiData as any).data.listParties.items;
			// console.log(partiesFromAPI);
			// setParties(partiesFromAPI);
		});
		setGuestsForParty(updatedSummary);
		console.log(updatedSummary);
	};

	async function fetchNotes() {
		// const apiData = await API.graphql({ query: listGuestInfos });
		const apiData = await API.graphql(
			graphqlOperation(listGuestInfos, {
				filter: { host: { eq: myEmail } },
			})
		);

		const notesFromAPI = (apiData as any).data.listGuestInfos.items;
		setNotes(notesFromAPI);
	}

	async function fetchParties() {
		// const apiData = await API.graphql({
		// 	query: listParties,
		// 	variables: { host: myEmail },
		// });
		const apiData = await API.graphql(
			graphqlOperation(listParties, {
				filter: { host: { eq: myEmail } },
			})
		);
		console.log((apiData as any).data.listParties);
		const partiesFromAPI = (apiData as any).data.listParties.items;
		console.log(partiesFromAPI);
		setParties(partiesFromAPI);
	}

	async function createParty(data: CreatePartyParams) {
		await API.graphql({
			query: createPartyMutation,
			variables: { input: data },
		});

		// const newParty = await API.graphql({
		// 	query: createPartyMutation,
		// 	variables: {
		// 		input: {
		// 			name: "Lorem ipsum dolor sit amet",
		// 			date: "1970-01-01T12:30:23.999Z",
		// 			host: "test12346789@testemailtestemail.com",
		// 			started: true,
		// 		},
		// 	},
		// });

		fetchParties();
	}

	const onSelectParty = (party: Party) => {
		setCurrentParty(party);
	};
	const onClearParty = () => {
		setCurrentParty(undefined);
	};
	const onDeleteParty = async (party: Party) => {
		const newParties = parties.filter((p: Party) => p.id !== party.id);
		setParties(newParties);
		await API.graphql({
			query: deletePartyMutation,
			variables: { input: { id: party.id } },
		});
		onClearParty();
	};

	async function createGuestInfo(data: UpdateGuestInfoParams) {
		await API.graphql({
			query: createGuestInfoMutation,
			variables: { input: data },
		});
		getGuestsForParty();
	}
	async function updateGuestInfo(data: UpdateGuestInfoParams) {
		await API.graphql({
			query: updateGuestInfoMutation,
			variables: { input: data },
		});
		getGuestsForParty();
	}

	return (
		<View className="App">
			<Heading level={1}>Double Blind Secret Santa</Heading>
			{currentParty === undefined ? (
				<>
					<PartiesPage
						onSelectParty={onSelectParty}
						onCreateParty={createParty}
						parties={parties}
						myEmail={myEmail}
					></PartiesPage>
					<Button onClick={signOut}>Sign Out</Button>
				</>
			) : (
				<PartyView
					party={currentParty}
					myEmail={myEmail}
					onClearParty={onClearParty}
					onDeleteParty={onDeleteParty}
					onCreateGuestInfo={createGuestInfo}
					onUpdateGuestInfo={updateGuestInfo}
					partyGuests={guestsForParty[currentParty.id]}
				></PartyView>
			)}

			{/* <View as="form" margin="3rem 0" onSubmit={createNote}>
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
			<Heading level={2}>Current Notes</Heading>
			<View margin="3rem 0">
				{notes.map((note: any) => (
					<Flex
						key={note.id || note.name}
						direction="row"
						justifyContent="center"
						alignItems="center"
					>
						<Text as="strong" fontWeight={700}>
							{note.name}
						</Text>
						<Text as="span">{note.phrase}</Text>
						<Button variation="link" onClick={() => deleteNote(note)}>
							Delete note
						</Button>
					</Flex>
				))}
			</View> */}
		</View>
	);
};

export default withAuthenticator(App);
