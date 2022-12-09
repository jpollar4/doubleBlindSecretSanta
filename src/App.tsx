import { useState, useEffect } from "react";
import "./App.scss";
import "@aws-amplify/ui-react/styles.css";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
	Button,
	Divider,
	Heading,
	View,
	withAuthenticator,
} from "@aws-amplify/ui-react";
import { listGuestInfos, listParties } from "./graphql/queries";
import {
	createGuestInfo as createGuestInfoMutation,
	deleteGuestInfo as deleteGuestInfoMutation,
	createParty as createPartyMutation,
	updateParty as updatePartyMutation,
	deleteParty as deletePartyMutation,
	updateGuestInfo as updateGuestInfoMutation,
} from "./graphql/mutations";
import PartiesPage, { CreatePartyParams, Party } from "./PartiesPage";
import PartyView, { GuestInfo, UpdateGuestInfoParams } from "./PartyView";
import { guestInfosByPartyID } from "./custom_queries";
import { fetchParties, getGuestsForParty, GuestSummaryPerParty } from "./data";

export interface GuestSummary {
	id: string;
	name: string;
	hasPhrase: boolean;
}

const App = ({ signOut }: { signOut?: () => void }) => {
	const [myEmail, setMyEmail] = useState("");
	const [currentParty, setCurrentParty] = useState<Party | undefined>();
	const [parties, setParties] = useState<Party[]>([]);

	const [guestsForParty, setGuestsForParty] = useState<GuestSummaryPerParty>(
		{}
	);

	useEffect(() => {
		if (myEmail !== "") {
			fetchPartiesData();
		}
	}, [myEmail]);

	useEffect(() => {
		getGuestDataForParty();
	}, [parties]);

	useEffect(() => {
		Auth.currentSession()
			.then((data) => {
				setMyEmail((data as any).idToken.payload.email);
			})
			.catch((err) => console.log(err));
	}, []);

	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array: any[]) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	const activateSecretSanta = async (party: Party) => {
		const apiDataNotReadyGuests = await API.graphql(
			graphqlOperation(guestInfosByPartyID, {
				partyID: party.id,
				filter: { phrase: { eq: "" } },
			})
		);

		if (
			(apiDataNotReadyGuests as any).data.guestInfosByPartyID.items.length !== 0
		) {
			console.error("Not all guest ready!");
		} else {
			const apiDataReadyGuests = await API.graphql(
				graphqlOperation(guestInfosByPartyID, {
					partyID: party.id,
					filter: { phrase: { ne: "" } },
				})
			);

			const mapOfGuestsGiverToTarget: { [key: string]: string } = {};
			let allGuests: GuestInfo[] = (apiDataReadyGuests as any).data
				.guestInfosByPartyID.items;

			//add dummies
			// for (let i = 0; i < 15; i++) {
			// 	allGuests.push({
			// 		id: `steve${i}`,
			// 		partyID: allGuests[0].partyID,
			// 		email: `steve${i}@gmail.com`,
			// 		name: `steve${i}`,
			// 	});
			// }
			allGuests = shuffle(allGuests);

			for (let i = 0; i < allGuests.length; i++) {
				const curGuest = allGuests[i];
				let nextGuest = allGuests[0];
				if (i < allGuests.length - 1) {
					nextGuest = allGuests[i + 1];
				}
				mapOfGuestsGiverToTarget[curGuest.id] = nextGuest.id;
			}

			console.log(mapOfGuestsGiverToTarget);

			Object.keys(mapOfGuestsGiverToTarget).forEach(async (g: string) => {
				await API.graphql({
					query: updateGuestInfoMutation,
					variables: {
						input: {
							id: g,
							myGuestToGiveTo: mapOfGuestsGiverToTarget[g],
						},
					},
				});
			});
			await API.graphql({
				query: updatePartyMutation,
				variables: {
					input: {
						id: party.id,
						started: true,
					},
				},
			});
		}
	};

	const getGuestDataForParty = async (forceFetch = false) => {
		const updatedSummary = await getGuestsForParty(parties, forceFetch);
		setGuestsForParty(updatedSummary);
	};

	async function fetchPartiesData(forceFetch = false) {
		const parties = await fetchParties(myEmail, forceFetch);

		setParties(parties);
	}

	async function createParty(data: CreatePartyParams) {
		await API.graphql({
			query: createPartyMutation,
			variables: { input: data },
		});

		fetchPartiesData(true);
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

		//delete guests
		guestsForParty[party.id].forEach(async (g) => {
			await API.graphql({
				query: deleteGuestInfoMutation,
				variables: { input: { id: g.id } },
			});
		});
		onClearParty();
	};

	const onDeleteGuest = async (id: string) => {
		//delete guests

		await API.graphql({
			query: deleteGuestInfoMutation,
			variables: { input: { id: id } },
		});
		getGuestDataForParty(true);
	};

	async function createGuestInfo(data: UpdateGuestInfoParams) {
		await API.graphql({
			query: createGuestInfoMutation,
			variables: { input: data },
		});
		getGuestDataForParty(true);
	}
	async function updateGuestInfo(data: UpdateGuestInfoParams) {
		await API.graphql({
			query: updateGuestInfoMutation,
			variables: { input: data },
		});
		getGuestDataForParty(true);
	}

	const onEnterJoinCode = async (code: string) => {
		// Are you already in party?
		let isValid = true;
		parties.forEach((p) => {
			if (p.id === code) {
				isValid = false;
			}
		});

		if (isValid) {
			const data: UpdateGuestInfoParams = {
				name: "",
				phrase: "",
				partyID: code,
				email: myEmail,
			};
			await API.graphql({
				query: createGuestInfoMutation,
				variables: { input: data },
			});
			fetchPartiesData(true);
		} else {
			console.error("ALREADY IN PARTY!");
		}
	};

	return (
		<View className="App">
			<Heading level={1}>Double Blind Secret Santa</Heading>
			<Divider orientation="horizontal" />
			{currentParty === undefined ? (
				<>
					<PartiesPage
						onSelectParty={onSelectParty}
						onCreateParty={createParty}
						parties={parties}
						myEmail={myEmail}
						onEnterJoinCode={onEnterJoinCode}
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
					onDeleteGuest={onDeleteGuest}
					partyGuests={guestsForParty[currentParty.id]}
					onActivateSecretSanta={activateSecretSanta}
				></PartyView>
			)}
		</View>
	);
};

export default withAuthenticator(App);
