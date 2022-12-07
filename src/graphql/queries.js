/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getParty = /* GraphQL */ `
  query GetParty($id: ID!) {
    getParty(id: $id) {
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
export const listParties = /* GraphQL */ `
  query ListParties(
    $filter: ModelPartyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParties(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        date
        host
        started
        GuestInfos {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGuestInfo = /* GraphQL */ `
  query GetGuestInfo($id: ID!) {
    getGuestInfo(id: $id) {
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
export const listGuestInfos = /* GraphQL */ `
  query ListGuestInfos(
    $filter: ModelGuestInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGuestInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
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
        myGuestToGiveTo
        name
        phrase
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
