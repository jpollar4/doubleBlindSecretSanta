import { useState, useEffect } from "react";
import "./App.scss";
import "@aws-amplify/ui-react/styles.css";
import { API, graphqlOperation } from "aws-amplify";
import { Button, Flex, Heading, TextField, View } from "@aws-amplify/ui-react";
import { listGuestInfos } from "./graphql/queries";
import { Party } from "./PartiesPage";
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
	onActivateSecretSanta: (party: Party) => void;
}) => {
	const [isHost, setIsHost] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [myGuestInfo, setMyGuestInfo] = useState<GuestInfo | undefined>();

	const {
		party,
		myEmail,
		onClearParty,
		onDeleteParty,
		onCreateGuestInfo,
		onUpdateGuestInfo,
		partyGuests,
		onActivateSecretSanta,
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

	function getParsedDate(dateString: string) {
		let date = String(dateString).split("T");
		var days = String(date[0]).split("-");
		//var hours = String(date[1]).split(":");

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
			return (
				<Button onClick={() => onActivateSecretSanta(party)}>
					Activate Party
				</Button>
			);
		}
		return <></>;
	};

	return (
		<View className="App">
			<Heading level={2}>{party.name}</Heading>
			<Heading level={2}>{getParsedDate(party.date)}</Heading>
			{isHost && <Heading level={2}>You're the host!</Heading>}
			{isHost && <Heading level={2}>{`Join code: ${party.id}`}</Heading>}

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
				{partyGuests &&
					partyGuests.length > 0 &&
					partyGuests.map((g) => {
						return (
							<Flex key={g.name} direction="row" justifyContent="center">
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
