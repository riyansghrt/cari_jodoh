

import { Alert } from "react-native";
import { apiCall, URL_PAYMENT } from "../../../providers/rest/RequestApi";
import GetLocation from "react-native-get-location";

export const onCheckLocation = async () => {
  // this.setState({loading: true})
  return GetLocation.getCurrentPosition({
    enableHighAccuracy: false,
    timeout: 15000
  }).then(async (location) => {
    return { ...location, status: true };
    // this.updateStatusPaket({...item, latitude: location.latitude, longitude: location.longitude}, module)
  }).catch((error) => {
    const { code, message } = error;

    if (code == 'UNAVAILABLE') {
      Alert.alert(
        'Cari Kerja',
        'Aktifkan Lokasi Handpone anda terlebih dahulu',
        [
        {
          text: 'OK', onPress: () => {
          }
        }],

        { cancelable: false }
      );
    } else {
      return { status: false };
    }
    return { status: false };
  });
};


export const getProfile = async (tokenUser) => {
  const dataReq = {
    method: "GET",
    url: 'auth/user',
    data: {
      headers: {
        Authorization: 'Bearer ' + tokenUser
      }
    }
  };
  const res = await apiCall(dataReq);

  if (res.status == 200 || res.status == 201) {
    return {
      success: true,
      data: res.data.data
    };
  } else {
    return {
      success: false,
      error: 'error'
    };
  }
};

export const getReview = async (tokenUser) => {
  const dataReq = {
    method: "GET",
    baseURL: URL_PAYMENT + '/api/other/review'
  };
  const res = await apiCall(dataReq);

  if (res?.status == 200 || res?.status == 201) {
    return {
      success: true,
      data: res.data.data
    };
  } else {
    return {
      success: false,
      error: 'error'
    };
  }
};

export const updateProfile = (body) => {
  return async (dispatch) => {
    dispatch({
      type: 'USER.ADD_USER',
      user: body
    });
  };
};

export const login = (body) => {
  return async (dispatch) => {
    dispatch({
      type: 'USER.ADD_AUTH_TOKEN',
      token: body.token,
      user: body.user,
      expired: true
    });
  };
};

export const loginRecruiter = (body) => {
  return async (dispatch) => {
    dispatch({
      type: 'USER.ADD_AUTH_TOKEN_RECRUITER',
      tokenRecruiter: body.token,
      userRecruiter: body.user,
      expired: true
    });
  };
};

export const logoutRecruiter = () => {
  return async (dispatch) => {
    dispatch({
      type: 'USER.LOGOUT_RECRUITER'
    });
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({
      type: 'USER.LOGOUT'
    });
  };
};
