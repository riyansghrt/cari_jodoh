import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {apiCall, URL_PAYMENT} from '../providers/rest/RequestApi';
import {ShowToast} from '../component/ShowToast';
import {showInAppNotification} from '../component/InAppNotificationService';

let pendingNavigation = null;

const getJobId = remoteMessage => {
  const data = remoteMessage?.data || {};
  return (
    data.job_posting_id ||
    data.job_application_id ||
    data.job_id ||
    data.id_lowongan ||
    null
  );
};

const navigateFromNotification = (navigationRef, routeName, params) => {
  const currentRoute = navigationRef.current?.getCurrentRoute?.();
  const isStartingApp = currentRoute?.name === 'SplashScreen';

  if (!navigationRef.current?.isReady?.() || isStartingApp) {
    pendingNavigation = {routeName, params};
    return;
  }

  pendingNavigation = null;
  navigationRef.current.navigate(routeName, params);
};

const openNotification = (remoteMessage, navigationRef) => {
  const jobId = getJobId(remoteMessage);
  if (!jobId) return;

  navigateFromNotification(navigationRef, 'DetailJob', {item: {id: jobId}});
};

const savePushToken = async (authToken, fcmToken, navigation) => {
  if (!authToken || Platform.OS !== 'android') return Promise.resolve(null);

  const payload = {
    fcm_token: fcmToken,
    platform: Platform.OS,
    device_id: await DeviceInfo.getUniqueId(),
    app_version: DeviceInfo.getVersion(),
  };

  if (__DEV__) {
    console.log('[FCM] Register push token request:', {
      endpoint: `${URL_PAYMENT}/api/user/push-token`,
      payload,
    });
  }

  const response = await apiCall(
    {
      method: 'POST',
      baseURL: URL_PAYMENT,
      url: '/api/user/push-token',
      data: {
        data: payload,
        headers: {Authorization: `Bearer ${authToken}`},
      },
    },
    navigation,
  );

  if (__DEV__) {
    console.log('[FCM] Register push token response:', {
      status: response?.status,
      data: response?.data ?? response,
    });
  }

  console.info('[FCM] Push token registration finished:', {
    status: response?.status ?? response?.code ?? null,
    success: response?.data?.success ?? response?.success ?? null,
  });

  return response;
};

export const registerFirebaseBackgroundHandler = () => {
  if (Platform.OS !== 'android') return;

  messaging().setBackgroundMessageHandler(async () => {
    // Android displays notification payloads through the system tray.
  });
};

export const syncFirebaseMessagingToken = async (authToken, navigation) => {
  if (!authToken || Platform.OS !== 'android') return null;

  if (Platform.Version >= 33) {
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.info('[FCM] Notification permission:', permission);
    } catch (error) {
      console.warn(
        '[FCM] Notification permission request failed:',
        error?.message || error,
      );
    }
  }

  let fcmToken = null;

  try {
    fcmToken = await messaging().getToken();
    if (!fcmToken) {
      console.warn('[FCM] Firebase returned an empty token');
      ShowToast('Gagal mendapatkan FCM token');
      return null;
    }

    // ShowToast('Berhasil mendapatkan FCM token');
  } catch (error) {
    console.warn('[FCM] Failed to get token:', error?.message || error);
    // ShowToast('Gagal mendapatkan FCM token');
    return null;
  }

  console.info(
    '[FCM] Token acquired:',
    `${fcmToken.slice(0, 8)}...${fcmToken.slice(-6)}`,
  );

  await savePushToken(authToken, fcmToken, navigation);
  return fcmToken;
};

export const removeFirebaseMessagingToken = async (authToken, navigation) => {
  if (!authToken || Platform.OS !== 'android') return null;

  const fcmToken = await messaging().getToken();
  if (!fcmToken) return null;

  const payload = {fcm_token: fcmToken};

  if (__DEV__) {
    console.log('[FCM] Remove push token request:', {
      endpoint: `${URL_PAYMENT}/api/user/push-token`,
      payload,
    });
  }

  const response = await apiCall(
    {
      method: 'DELETE',
      baseURL: URL_PAYMENT,
      url: '/api/user/push-token',
      data: {
        data: payload,
        headers: {Authorization: `Bearer ${authToken}`},
      },
    },
    navigation,
  );

  if (__DEV__) {
    console.log('[FCM] Remove push token response:', {
      status: response?.status,
      data: response?.data ?? response,
    });
  }

  return response;
};

export const startFirebaseMessaging = ({navigationRef, getAuthToken}) => {
  if (Platform.OS !== 'android') return () => {};

  const unsubscribeForeground = messaging().onMessage(remoteMessage => {
    const title =
      remoteMessage?.notification?.title ||
      remoteMessage?.data?.title ||
      remoteMessage?.data?.notification_title;
    const body =
      remoteMessage?.notification?.body ||
      remoteMessage?.data?.body ||
      remoteMessage?.data?.message ||
      remoteMessage?.data?.notification_body;

    if (title || body) {
      showInAppNotification({
        title,
        body,
        onPress: () =>
          navigateFromNotification(navigationRef, 'NotifScreen'),
      });
    }
  });

  const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
    openNotification(remoteMessage, navigationRef);
  });

  const unsubscribeToken = messaging().onTokenRefresh(fcmToken => {
    const authToken = getAuthToken();
    savePushToken(authToken, fcmToken, navigationRef.current).catch(error => {
      console.warn('FCM token refresh failed:', error?.message || error);
    });
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) openNotification(remoteMessage, navigationRef);
    })
    .catch(error => {
      console.warn('FCM initial notification failed:', error?.message || error);
    });

  return () => {
    unsubscribeForeground();
    unsubscribeOpened();
    unsubscribeToken();
  };
};

export const flushPendingFirebaseNotification = navigationRef => {
  if (pendingNavigation) {
    navigateFromNotification(
      navigationRef,
      pendingNavigation.routeName,
      pendingNavigation.params,
    );
  }
};
