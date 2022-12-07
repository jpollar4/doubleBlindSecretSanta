/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateParty = /* GraphQL */ `
  subscription OnCreateParty($filter: ModelSubscriptionPartyFilterInput) {
    onCreateParty(filter: $filter) {
      id
      name
      date
      host
      started
      GuestInfos {
        items {
          id
          partyID
          email
          myGuestToGiveTo
          name
          phrase
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateParty = /* GraphQL */ `
  subscription OnUpdateParty($filter: ModelSubscriptionPartyFilterInput) {
    onUpdateParty(filter: $filter) {
      id
      name
      date
      host
      started
      GuestInfos {
        items {
          id
          partyID
          email
          myGuestToGiveTo
          name
          phrase
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteParty = /* GraphQL */ `
  subscription OnDeleteParty($filter: ModelSubscriptionPartyFilterInput) {
    onDeleteParty(filter: $filter) {
      id
      name
      date
      host
      started
      GuestInfos {
        items {
          id
          partyID
          email
          myGuestToGiveTo
          name
          phrase
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGuestInfo = /* GraphQL */ `
  subscription OnCreateGuestInfo(
    $filter: ModelSubscriptionGuestInfoFilterInput
  ) {
    onCreateGuestInfo(filter: $filter) {
      id
      partyID
      email
      myGuestToGiveTo
      name
      phrase
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGuestInfo = /* GraphQL */ `
  subscription OnUpdateGuestInfo(
    $filter: ModelSubscriptionGuestInfoFilterInput
  ) {
    onUpdateGuestInfo(filter: $filter) {
      id
      partyID
      email
      myGuestToGiveTo
      name
      phrase
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGuestInfo = /* GraphQL */ `
  subscription OnDeleteGuestInfo(
    $filter: ModelSubscriptionGuestInfoFilterInput
  ) {
    onDeleteGuestInfo(filter: $filter) {
      id
      partyID
      email
      myGuestToGiveTo
      name
      phrase
      createdAt
      updatedAt
    }
  }
`;
