/* ============================================= *
 *                 API  +  OFFLINE QUEUE         *
 * ============================================= */
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import qs from 'qs';
import Toast from 'react-native-simple-toast';

import { store } from '../../state/ReduxMiddleware';
import { logout } from '../../state/actions/user/Auth';
import { ShowToast } from '../../component/ShowToast';
import { Alert, Platform } from 'react-native';
import { trackAppError } from '../../services/posthog';

export const versi_ios = 70;
export const API_URL = Config.API_URL || 'https://apiv1.cari-kerja.com';
export const ONE_SIGNAL_ID = Config.ONE_SIGNAL_ID || '30fb3cb9-f1e8-481d-a46c-af3a4a8bc4b7';
export const URL_PAYMENT = Config.URL_PAYMENT || 'https://employer.cari-kerja.com';
export const URL_AI = Config.URL_AI || 'https://assistant.cari-kerja.com';
export const URL_GENCV = Config.URL_GENCV || 'https://gencv.cari-kerja.com';
export const URL_GENCV_DUA = Config.URL_GENCV_DUA || 'https://gencv2.cari-kerja.com';
export const URL_VISA = Config.URL_VISA || 'https://apivisa.cari-kerja.com';
export const URL_VERIFY = Config.URL_VERIFY || 'https://trustseal.cari-kerja.com';
export const URL_CONFE = Config.URL_CONFE || 'https://converence.cari-kerja.com';
export const URL_RECRUITER = Config.URL_RECRUITER || 'https://employer.cari-kerja.com';
export const POSTHOG_API_KEY_LIVE = Config.POSTHOG_API_KEY || 'phc_xZ64Kq8fyaYx5uQCUdSsVDoE9HVHYx6QprwZFk6R3cRP';
export const POSTHOG_HOST_LIVE = Config.POSTHOG_HOST || 'https://p.cari-kerja.com';
export const API_URL_SOCKET = Config.API_URL_SOCKET || 'https://aime.cari-kerja.com';

// // DEV reference
// export const API_URL = 'https://goapi.cari-kerja.com';
// export const ONE_SIGNAL_ID = '127ecc86-2193-4d08-8c7e-1521674b3be0';
// export const URL_PAYMENT = 'https://dotnetapi.cari-kerja.com';
// export const URL_AI = 'https://aime.cari-kerja.com';
// export const URL_GENCV = 'https://devgencv.cari-kerja.com';
// export const URL_GENCV_DUA = 'https://devgencvv2.cari-kerja.com';
// export const URL_VISA = 'https://devvisa.cari-kerja.com';
// export const URL_VERIFY = 'https://devtrustseal.cari-kerja.com';
// export const URL_CONFE = 'https://devconference.cari-kerja.com';
// export const URL_RECRUITER = 'https://dotnetapi.cari-kerja.com';
// export const POSTHOG_API_KEY_LIVE = Config.POSTHOG_API_KEY || 'phc_xZ64Kq8fyaYx5uQCUdSsVDoE9HVHYx6QprwZFk6R3cRP';
// export const POSTHOG_HOST_LIVE = Config.POSTHOG_HOST || 'https://p.cari-kerja.com';
// export const API_URL_SOCKET = 'https://aime.cari-kerja.com';

const reFormat = {
  id: 'id',
  en: 'us',
  zh: 'ch',
  jp: 'jp'
};

const appHeaderProperties = {
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  AnonymousID: '',
  Expires: '0'
};

const ANONYMOUS_ID_STORAGE_KEY = 'anonymous_id';
let anonymousIdPromise = null;

const generateAnonymousId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 12);
  return `anon-${Platform.OS == 'ios' ? 'ios' : 'android'}-${timestamp}-${random}`;
};

const getAnonymousId = async () => {
  if (anonymousIdPromise) {
    return anonymousIdPromise;
  }

  anonymousIdPromise = (async () => {
    const savedAnonymousId = await AsyncStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);

    if (savedAnonymousId) {
      return savedAnonymousId;
    }

    const newAnonymousId = generateAnonymousId();
    await AsyncStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, newAnonymousId);
    return newAnonymousId;
  })();

  try {
    return await anonymousIdPromise;
  } catch (error) {
    anonymousIdPromise = null;
    throw error;
  }
};

const normalizeErrorMessage = (message) => {
  if (typeof message !== 'string') return message;

  return message.trim().toLowerCase() === 'nomor anda sudah terverifikasi' ?
  'Nomor ini sudah digunakan. Silakan login menggunakan nomor tersebut atau gunakan nomor lain.' :
  message;
};

const showErrorsFromResponse = (response) => {
  // Check main success flag

  const isError = response?.status === 'error' || response?.success === false;
  if (isError) {
    if (typeof response?.message === 'string' && response?.message?.trim() !== '') {
      setTimeout(() => {
        alert(`❗ ${normalizeErrorMessage(response.message)}`);
      }, 1000);
      return;
    }
  }

  // Handle array of errors (either array of strings or array of objects)
  if (isError && Array.isArray(response.errors) && response.errors.length > 0) {
    const combinedMessage = response.errors.
    map((err) => {
      if (typeof err === 'string') return normalizeErrorMessage(err);
      if (typeof err === 'object' && err !== null) {
        return Object.values(err).
        map((value) => normalizeErrorMessage(value)).
        join(': ');
      }
      return '';
    }).
    filter(Boolean).
    join('\n');

    if (combinedMessage) {
      setTimeout(() => {
        alert(`❗ ${combinedMessage}`);
      }, 1000);
      return;
    }
  }

  // Handle single string error
  if (typeof response?.error === 'string' && response.error.trim() !== '') {
    setTimeout(() => {
      alert(`❗ ${normalizeErrorMessage(response.error)}`);
    }, 1000);
    return;
  }

  // Handle message field as fallback
  if (typeof response?.message === 'string' && response.message.trim() !== '') {
    setTimeout(() => {
      alert(`❗ ${normalizeErrorMessage(response.message)}`);
    }, 1000);
    return;
  }

  if (typeof response?.errors === "object" && response?.errors !== null && !Array.isArray(response?.errors)) {
    const errorList = [];

    Object.entries(response?.errors).forEach(([field, messages]) => {
      messages.forEach((msg) => {
        errorList.push(`${field}: ${normalizeErrorMessage(msg)} \n`);
      });
    });
    Alert.alert(
      "Terjadi Kesalahan",
      errorList.join("\n")
    );
    return;
  }

  return;
  // Fallback (no recognizable error)
  // alert('❗ An unknown error occurred. Please try again.');
};



/* ------------------------------------------------------------------ */
/*                          OFFLINE QUEUE                             */
/* ------------------------------------------------------------------ */

let isOnline = null;
let requestQueue = [];

/**
 * Helper untuk menentukan koneksi online
 * isInternetReachable bisa null di iOS awal load
 */
const getOnlineState = (state) => {
  return state.isConnected && state.isInternetReachable !== false;
};

const refreshOnlineState = async () => {
  try {
    const state = await NetInfo.fetch();
    isOnline = getOnlineState(state);
    return isOnline;
  } catch (error) {
    return isOnline;
  }
};

/* Inisialisasi awal untuk menghindari false offline di iOS */
refreshOnlineState();

/* Listener koneksi global */
NetInfo.addEventListener((state) => {
  const onlineNow = getOnlineState(state);
  if (onlineNow && requestQueue.length > 0) {
    flushQueue();
  }
  isOnline = onlineNow;
});

/* Kirim ulang semua request di antrian */
function flushQueue() {
  if (requestQueue.length === 0) return;
  const queueCopy = [...requestQueue];
  requestQueue = [];

  queueCopy.forEach(({ type, config, resolve, reject }) => {
    const nextConfig = { ...config, __skipQueue: true };

    if (type === 'request') {
      resolve(nextConfig);
      return;
    }

    axiosInstance(nextConfig).then(resolve).catch(reject);
  });
}

/* ------------------------------------------------------------------ */
/*                         INSTANSI AXIOS                             */
/* ------------------------------------------------------------------ */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 40000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
});

/* ---------- Interceptor REQUEST ---------- */
axiosInstance.interceptors.request.use(
  async (config) => {
    const onlineState = isOnline === null ? await refreshOnlineState() : isOnline;

    config.headers = { ...appHeaderProperties, ...config.headers };
    config.headers.AnonymousID = await getAnonymousId();
    const lng = store.getState()?.language?.language;
    const language = reFormat[lng] || 'id';
    config.headers['Accept-Language'] = language;

    if (config.params) {
      const q = new URLSearchParams(config.params).toString();

    }

    if (!onlineState && !config.__skipQueue) {
      return new Promise((resolve, reject) => {
        requestQueue.push({ type: 'request', config, resolve, reject });
        // Toast.show('🔌 Offline. Request akan dikirim ulang saat online.', Toast.LONG);
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- Interceptor RESPONSE ---------- */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && !isOnline && !error?.config?.__skipQueue) {
      return new Promise((resolve, reject) => {
        requestQueue.push({ type: 'response', config: error.config, resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

/* ------------------------------------------------------------------ */
/*                         FUNGSI apiCall                             */
/* ------------------------------------------------------------------ */
let timeoutCounter = 0;

const getRequestUserRole = (headers = {}) => {
  const authState = store.getState()?.user || {};
  const authorization = String(headers?.Authorization || headers?.authorization || "");
  const recruiterToken = authState?.tokenRecruiter;
  const pelamarToken = authState?.token;

  if (recruiterToken && authorization.includes(recruiterToken)) return "recruiter";
  if (pelamarToken && authorization.includes(pelamarToken)) return "pelamar";
  if (recruiterToken && !pelamarToken) return "recruiter";
  if (pelamarToken) return "pelamar";

  return "guest";
};

export const apiCall = async ({ method, url, data = '', baseURL, ...rest }, navigation) => {
  const finalConfig = {
    method,
    url,
    data: data.data || '',
    baseURL: baseURL || API_URL,
    params: data.params || '',
    headers: data.headers || {},
    timeout: data.timeout || 40000,
    ...rest
  };

  try {
    const response = await axiosInstance(finalConfig);
    console.log('API Response:', response?.data);
    timeoutCounter = 0;
    return response;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error?.message || error, error.response);
    const isNetworkError = error?.message === 'Network Error' || error?.code === 'ERR_NETWORK';
    const eventName = error?.response ?
    'api_request_failed' :
    isNetworkError ?
    'api_network_failed' :
    'api_client_failed';

    trackAppError(eventName, error?.response?.data || error, {
      error_type: error?.response ?
      'api_response_error' :
      isNetworkError ?
      'network_error' :
      'client_error',
      api_endpoint: finalConfig?.url || null,
      api_method: String(finalConfig?.method || method || '').toUpperCase() || null,
      api_base_url: finalConfig?.baseURL || API_URL,
      http_status: error?.response?.status || null,
      original_error_message: error?.message || null,
      user_role: getRequestUserRole(finalConfig?.headers)
    });

    if (error.response) {
      const { status, data: resp } = error.response;

      if (status === 401) {
        store.dispatch(logout());
        navigation?.replace('InitialScreen');
        ShowToast('silahkan_login_kembali');
      } else if (status === 429) {
        ShowToast(error?.response?.data?.error);
      } else if (status === 502) {
        ShowToast('layanan_tidak_tersedia');
      } else {
        showErrorsFromResponse(resp);
      }

      return resp;
    }

    if (isNetworkError) {
      ShowToast('Something went wrong. Please try again.');
      return null;
    }

    if (!isOnline) {
      return null;
    }

    return null;
  }
};
