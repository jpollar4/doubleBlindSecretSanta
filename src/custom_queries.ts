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
export const getGuestsPhrase = /* GraphQL */ `
	query GetGuestInfo($id: ID!) {
		getGuestInfo(id: $id) {
			phrase
		}
	}
`;
