import axios from "axios";
import { retrieveToken } from "utils/handleToken";
import apiUrl from "utils/Connection";
import qs from 'qs';

const url = "http://192.168.0.102:3000/api/v1/invitations/";

export async function getInvitations(userId) {
  const { token } = await retrieveToken();
  let trimpedToken = "";
  if (token) trimpedToken = token.replace(/['"]+/g, "");
  const options = {
    method: "GET",
    url: `${apiUrl.getInvitations}${userId}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${trimpedToken}`
    }
  };

  let response = await axios(options).catch(error => console.log(error));
  console.log(response.data);
  return response;
}

export async function createInvitation(invitation) {
  const { token } = await retrieveToken();
  let trimpedToken = "";
  if (token) trimpedToken = token.replace(/['"]+/g, "");
  const options = {
    method: "POST",
    url: apiUrl.getInvitations,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${trimpedToken}`
    },
    data: qs.stringify(invitation),
  };

  let response = await axios(options).catch(error => console.log(error));
  console.log(response.data);
  return response;
}