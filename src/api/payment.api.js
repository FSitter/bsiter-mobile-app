import axios from 'axios';
import qs from 'qs';
import { paymentAPI } from 'utils/Connection';

export async function createCustomer(email, token, userId, name, cardId) {
  console.log('payment api -> createCustomer');
  const data = {
    email,
    token,
    userId,
    name,
    cardId,
  };
  const options = {
    method: 'PUT',
    url: paymentAPI.createCustomer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      console.log(error.response.data.raw);
      return {
        message: error.response.data.raw.message,
        code: error.response.data.raw.code,
      };
    });
  return response;
}

export async function getCustomer(userId) {
  const data = {
    userId,
  };
  const options = {
    method: 'POST',
    url: paymentAPI.getCustomer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else console.log('Get Customer error' + error);
    });
  return response;
}

export async function createCharge(amount, userId, requestId) {
  const data = {
    amount,
    userId,
    requestId,
  };
  const options = {
    method: 'POST',
    url: paymentAPI.createCharge,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else console.log('Create Customer error' + error);
    });
  return response;
}
