import "./App.scss";
import "@aws-amplify/ui-react/styles.css";
import { Button, Flex, Heading, TextField, View } from "@aws-amplify/ui-react";

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
	onEnterJoinCode: (code: string) => void;
	onCreateParty: (params: CreatePartyParams) => void;
	parties: Party[];
	myEmail: string;
}) => {
	const { onSelectParty, parties, myEmail, onCreateParty, onEnterJoinCode } =
		props;

	const createParty = (event: any) => {
		event.preventDefault();
		const form = new FormData(event.target);
		const date = new Date(form.get("date") as string);
		const data: CreatePartyParams = {
			name: form.get("name") as string,
			host: myEmail,
			date: date,
		};
		onCreateParty(data);
		event.target.reset();
	};

	async function openParty(party: Party) {
		onSelectParty(party);
	}

	function getParsedDate(dateString: string) {
		let date = String(dateString).split("T");
		var days = String(date[0]).split("-");
		//var hours = String(date[1]).split(":");

		return `${parseInt(days[1])}/${parseInt(days[2])}/${parseInt(days[0])}`;
	}

	const joinParty = (event: any) => {
		event.preventDefault();
		const form = new FormData(event.target);
		onEnterJoinCode(form.get("join_code") as string);
		event.target.reset();
	};

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
			<View as="form" margin="3rem 0" onSubmit={joinParty}>
				<Flex direction="row" justifyContent="center">
					<TextField
						name="join_code"
						placeholder="Join Code"
						label="Party Name"
						labelHidden
						variation="quiet"
						required
					/>

					<Button type="submit" variation="primary">
						Join A Party
					</Button>
				</Flex>
			</View>
			{/* Debugging for just me! Mwahahaha */}
			{myEmail.split("@")[0] === "jpollar4" && (
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
			)}
		</View>
	);
};

export default PartiesPage;
