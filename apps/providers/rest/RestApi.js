import axios from 'axios';
// const apiUrl = 'http://api.darurat.id';
const apiUrl = 'https://devapi.darurat.id';

export const ApiGetCustom = (http) => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.get(http, options).
  then((response) => response.data).
  catch((error) => {

  });
};

export const ApiGet = (http) => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.get(apiUrl + '/' + http, options).
  then((response) => response.data).
  catch((error) => {

  });
};

export const ApiPost = (http, payload) => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.post(apiUrl + '/' + http, payload, options).
  then((response) => response.data).
  catch((error) => {

  });
};

export const ApiPut = (http, payload) => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.put(apiUrl + '/' + http, payload, options).
  then((response) => response.data).
  catch((error) => {

  });
};

export const ApiDelete = (http, payload) => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return axios.delete(apiUrl + '/' + http, { data: payload, headers: options }).
  then((response) => response.data).
  catch((error) => {

  });
};

//========== token di header

export const ApiGetKode = (http, token) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  };
  return axios.get(apiUrl + '/' + http, options).
  then((response) => response.data).
  catch((error) => {

  });
};

export const ApiPostKode = (http, payload, token, navigation) => {
  let options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  };
  return axios.post(apiUrl + '/' + http, payload, options).
  then((response) => response.data).
  catch((error) => {

    if (error.response.status === 401) {
      if (navigation) {
        ToastAndroid.show('Token Anda sudah habis, silahkan login ulang', ToastAndroid.LONG, ToastAndroid.TOP);
        navigation.replace('Login');
      }
    }
  });
};

export const ApiPutKode = (http, payload, token) => {
  let options = {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  };

  return axios.put(apiUrl + '/' + http, payload, options).
  then((response) => response.data).
  catch((error) => {

  });
};

//---------- POST DATA
export const ApiPostData = (http, payload, token) => {
  let options = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    }
  };
  return axios.post(apiUrl + '/' + http, payload, options).
  then((response) => response).
  catch((error) => {

  });
};

export const ApiPutData = (http, payload, token) => {
  let options = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    }
  };
  return axios.put(apiUrl + '/' + http, payload, options).
  then((response) => response).
  catch((error) => {

  });
};