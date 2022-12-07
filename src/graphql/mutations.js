/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createParty = /* GraphQL */ `
  mutation CreateParty(
    $input: CreatePartyInput!
    $condition: ModelPartyConditionInput
  ) {
    createParty(input: $input, condition: $condition) {
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
export const updateParty = /* GraphQL */ `
  mutation UpdateParty(
    $input: UpdatePartyInput!
    $condition: ModelPartyConditionInput
  ) {
    updateParty(input: $input, condition: $condition) {
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
export const deleteParty = /* GraphQL */ `
  mutation DeleteParty(
    $input: DeletePartyInput!
    $condition: ModelPartyConditionInput
  ) {
    deleteParty(input: $input, condition: $condition) {
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
export const createGuestInfo = /* GraphQL */ `
  mutation CreateGuestInfo(
    $input: CreateGuestInfoInput!
    $condition: ModelGuestInfoConditionInput
  ) {
    createGuestInfo(input: $input, condition: $condition) {
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
export const updateGuestInfo = /* GraphQL */ `
  mutation UpdateGuestInfo(
    $input: UpdateGuestInfoInput!
    $condition: ModelGuestInfoConditionInput
  ) {
    updateGuestInfo(input: $input, condition: $condition) {
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
export const deleteGuestInfo = /* GraphQL */ `
  mutation DeleteGuestInfo(
    $input: DeleteGuestInfoInput!
    $condition: ModelGuestInfoConditionInput
  ) {
    deleteGuestInfo(input: $input, condition: $condition) {
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
