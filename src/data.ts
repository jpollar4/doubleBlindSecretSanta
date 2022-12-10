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
import { GuestSummary } from "./App";
// Store some data for about 5 minutes to prevent pounding database
// Real time data is not needed
export interface GuestSummaryPerParty {
	[key: string]: GuestSummary[];
}
const arePartiesCached = () => {
	const expireTime = localStorage.getItem("santaCacheExpireTime");
	if (!expireTime || expireTime == "") {
		return false;
	} else {
		const now = new Date();
		const expiredTime = new Date(expireTime);
		return now < expiredTime;
	}
};
const areGuestsCached = () => {
	const expireTime = localStorage.getItem("santaGuestsCacheExpireTime");
	if (!expireTime || expireTime == "") {
		return false;
	} else {
		const now = new Date();
		const expiredTime = new Date(expireTime);
		return now < expiredTime;
	}
};

let areFetchingGuests = false;

const cacheParties = (parties: Party[]) => {
	localStorage.setItem("cachedParties", JSON.stringify(parties));
	const minutes = 5;
	const now = new Date();
	const expireTime = new Date(now.getTime() + minutes * 60000);
	localStorage.setItem("santaCacheExpireTime", expireTime.toString());
};

const getCachedParties = () => {
	const partiesString = localStorage.getItem("cachedParties") || "[]";
	return JSON.parse(partiesString) as Party[];
};

const cacheGuestsPerParty = (guests: GuestSummaryPerParty) => {
	localStorage.setItem("guestsPerPartyCache", JSON.stringify(guests));
	const minutes = 5;
	const now = new Date();
	const expireTime = new Date(now.getTime() + minutes * 60000);
	localStorage.setItem("santaGuestsCacheExpireTime", expireTime.toString());
};
const getGuestsPerPartyCache = () => {
	const guestsJSON = localStorage.getItem("guestsPerPartyCache") || "{}";
	return JSON.parse(guestsJSON) as GuestSummaryPerParty;
};

export const fetchMyPartyIDs = async (myEmail: string) => {
	const apiData = await API.graphql(
		graphqlOperation(listGuestInfos, {
			filter: { email: { eq: myEmail } },
		})
	);

	const dataFromAPI = (apiData as any).data.listGuestInfos.items;

	const newIDs: string[] = [];
	dataFromAPI.forEach((guestinfo: GuestInfo) => {
		newIDs.push(guestinfo.partyID);
	});
	return newIDs;
};

export const fetchParties = async (myEmail: string, forceFetch = false) => {
	if (arePartiesCached() && !forceFetch) {
		console.log("returning from cache!");
		return getCachedParties();
	}

	const newIDs: string[] = await fetchMyPartyIDs(myEmail);

	let filterMembers: any = newIDs.map((id) => {
		return { id: { eq: id } };
	});
	filterMembers.push({ host: { eq: myEmail } });
	let filter = { or: filterMembers };

	const apiData = await API.graphql(
		graphqlOperation(listParties, {
			filter: filter,
		})
	);

	const partiesFromAPI: Party[] = (apiData as any).data.listParties.items;
	cacheParties(partiesFromAPI);
	return partiesFromAPI;
};

export const doesPartyExist = async (partyID: string) => {
	const apiData = await API.graphql(
		graphqlOperation(listParties, {
			filter: { id: { eq: partyID } },
		})
	);

	const partiesFromAPI: Party[] = (apiData as any).data.listParties.items;
	return partiesFromAPI.length > 0;
};

export const getGuestsForParty = async (
	parties: Party[],
	forceFetch = false
) => {
	if (areGuestsCached() && !forceFetch) {
		console.log("returning getGuestsPerPartyCache cache!");
		return getGuestsPerPartyCache();
	}
	const updatedSummary: GuestSummaryPerParty = {};

	await Promise.all(
		parties.map(async (p) => {
			let guestArray: GuestSummary[] = [];
			const apiDataReadyGuests = await API.graphql(
				graphqlOperation(guestInfosByPartyID, {
					partyID: p.id,
					filter: { phrase: { ne: "" } },
				})
			);

			(apiDataReadyGuests as any).data.guestInfosByPartyID.items.forEach(
				(g: any) => {
					guestArray.push({
						id: g.id,
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

			(apiDataNotReadyGuests as any).data.guestInfosByPartyID.items.forEach(
				(g: any) => {
					guestArray.push({
						id: g.id,
						name: g.name,
						hasPhrase: false,
					});
				}
			);

			updatedSummary[p.id] = guestArray;
		})
	);
	if (Object.keys(updatedSummary).length > 0) {
		cacheGuestsPerParty(updatedSummary);
	}
	return updatedSummary;
};
