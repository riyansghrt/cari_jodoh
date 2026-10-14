import Config from 'react-native-config';
import moment from 'moment';
import { POSTHOG_API_KEY_LIVE, POSTHOG_HOST_LIVE } from '../providers/rest/RequestApi';

const FALLBACK_POSTHOG_API_KEY = POSTHOG_API_KEY_LIVE;
const FALLBACK_POSTHOG_HOST = POSTHOG_HOST_LIVE;

export const POSTHOG_API_KEY = Config.POSTHOG_API_KEY || FALLBACK_POSTHOG_API_KEY;
export const POSTHOG_HOST = Config.POSTHOG_HOST || FALLBACK_POSTHOG_HOST;

export const isPostHogEnabled = () => Boolean(POSTHOG_API_KEY);

let posthogClient = null;
let currentScreenName = null;

const SENSITIVE_PARAM_KEYS = [
'token',
'access_token',
'refresh_token',
'authorization',
'password',
'email',
'phone',
'no_telp',
'cv',
'resume',
'document',
'file'];


const isSafeValue = (value) => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean');

};

export const buildScreenEventProperties = (route, extras = {}) => {
  const params = route?.params || {};
  const eventParams = {};

  Object.entries(params).forEach(([key, value]) => {
    const normalizedKey = String(key || '').toLowerCase();
    if (SENSITIVE_PARAM_KEYS.includes(normalizedKey)) return;

    if (isSafeValue(value)) {
      eventParams[key] = value;
      return;
    }

    if (value && typeof value === 'object') {
      if (isSafeValue(value.id)) {
        eventParams[`${key}_id`] = value.id;
      }

      if (isSafeValue(value.slug)) {
        eventParams[`${key}_slug`] = value.slug;
      }

      if (isSafeValue(value.type)) {
        eventParams[`${key}_type`] = value.type;
      }
    }
  });

  return {
    screen_name: route?.name || 'Unknown',
    ...eventParams,
    ...extras
  };
};

export const setPostHogClient = (client) => {
  posthogClient = client || null;

  if (!posthogClient) return;

  if (typeof posthogClient.ready === 'function') {
    posthogClient.
    ready().
    then(() => {

    }).
    catch((error) => {

    });
  }
};

export const getPostHogClient = () => posthogClient;
export const setCurrentScreenName = (screenName) => {
  currentScreenName = screenName || null;
};
export const getCurrentScreenName = () => currentScreenName;

export const buildDistinctId = (prefix, user) => {
  if (!user) return null;

  const rawId =
    user?.id ||
    user?.user_id ||
    user?.employee_id ||
    user?.email ||
    user?.no_telp;

  if (!rawId) return null;
  return `${prefix}:${rawId}`;
};

const buildBirthYear = (dateValue) => {
  if (!dateValue) return null;

  const parsed = moment(dateValue);
  if (!parsed.isValid()) return null;

  return parsed.year();
};

const buildPelamarProperties = (user = {}) => ({
  user_type: 'pelamar',
  name: user?.nama || user?.name || null,
  email: user?.email || null,
  phone: user?.no_telp || null,
  city_id: user?.id_kota || null,
  city_name: user?.nama_kota || null,
  gender: user?.jenis_kelamin || null,
  birth_year: buildBirthYear(user?.tanggal_lahir),
  profile_gender_completed: Boolean(user?.jenis_kelamin),
  profile_birth_year_completed: Boolean(buildBirthYear(user?.tanggal_lahir))
});

const buildRecruiterProperties = (user = {}) => ({
  user_type: 'recruiter',
  name: user?.name || user?.nama || null,
  email: user?.email || null,
  phone: user?.no_telp || null,
  recruiter_tier: user?.recruiter_tier || null
});

export const buildPostHogUserIdentity = (userType, user) => {
  const prefix = userType === 'recruiter' ? 'recruiter' : 'pelamar';
  const distinctId = buildDistinctId(prefix, user);

  if (!distinctId) return null;

  const properties =
    userType === 'recruiter' ?
      buildRecruiterProperties(user) :
      buildPelamarProperties(user);

  return { distinctId, properties };
};

export const identifyUserProfile = (userType, user, client = posthogClient) => {
  const identity = buildPostHogUserIdentity(userType, user);
  if (!client || !identity) return null;

  client.identify(identity.distinctId, identity.properties);
  return {
    ...identity,
    signature: JSON.stringify({
      distinctId: identity.distinctId,
      properties: identity.properties
    })
  };
};

export const captureAppEvent = (eventName, properties = {}) => {
  if (!posthogClient || !eventName) {




    return;
  }

  try {
    posthogClient.capture(eventName, properties);





    if (typeof posthogClient.flush === 'function') {
      posthogClient.
      flush().
      then(() => {



      }).
      catch((error) => {




      });
    }
  } catch (error) {





  }
};

export const buildAuthIntentProperties = (payload = {}) => {
  console.log('[PostHog][AuthIntent] incoming payload', payload);

  if (payload?.auth_type === 'signup' || payload?.auth_type === 'login') {
    const result = {
      auth_intent: payload.auth_type,
      is_new_user: payload.auth_type === 'signup'
    };
    console.log('[PostHog][AuthIntent] derived from auth_type', result);
    return result;
  }

  if (typeof payload?.is_new_user === 'boolean') {
    const result = {
      auth_intent: payload.is_new_user ? 'signup' : 'login',
      is_new_user: payload.is_new_user
    };
    console.log('[PostHog][AuthIntent] derived from is_new_user', result);
    return result;
  }

  const fallback = {
    auth_intent: 'unknown',
    is_new_user: null
  };
  console.log('[PostHog][AuthIntent] fallback used', fallback);
  return fallback;
};

export const buildErrorProperties = (errorLike = {}) => {
  let errorResponseBody = null;

  if (typeof errorLike?.data === 'string') {
    errorResponseBody = errorLike.data;
  } else if (errorLike?.data !== undefined && errorLike?.data !== null) {
    try {
      errorResponseBody = JSON.stringify(errorLike.data);
    } catch (error) {
      errorResponseBody = '[unserializable_error_data]';
    }
  } else if (typeof errorLike === 'string') {
    errorResponseBody = errorLike;
  } else if (errorLike && typeof errorLike === 'object') {
    try {
      errorResponseBody = JSON.stringify(errorLike);
    } catch (error) {
      errorResponseBody = '[unserializable_error_object]';
    }
  }

  return {
    error_code:
    errorLike?.statusCode ||
    errorLike?.status ||
    errorLike?.code ||
    null,
    error_message:
    errorLike?.message ||
    errorLike?.error ||
    errorLike?.data?.message ||
    null,
    error_response_body: errorResponseBody ?
    String(errorResponseBody).slice(0, 4000) :
    null
  };
};

export const buildJobProperties = (job = {}, extras = {}) => {
  return {
    job_id: job?.id || null,
    job_title: job?.title || null,
    company_id: job?.employerid || job?.employer_id || job?.company_id || null,
    company_name: job?.employer_name || job?.company_name || null,
    location: job?.location || null,
    country: job?.location_detail?.country || null,
    employment_type: job?.job_type || null,
    salary_visible: Boolean(job?.is_salary_displayed),
    has_applied: Boolean(job?.has_applied),
    has_bookmarked: Boolean(job?.has_bookmarked),
    is_active: typeof job?.is_active === 'boolean' ? job.is_active : null,
    ...extras
  };
};

export const trackFormValidationFailed = ({
  userType = null,
  screenName = 'Unknown',
  formName = 'unknown_form',
  fieldName = null,
  validationType = null,
  ...extras
} = {}) => {
  captureAppEvent('form_validation_failed', {
    user_type: userType,
    screen_name: screenName,
    form_name: formName,
    field_name: fieldName,
    ...(validationType ? { validation_type: validationType } : {}),
    ...extras
  });
};

export const trackJobEvent = (eventName, { job = null, ...properties } = {}) => {
  captureAppEvent(eventName, {
    ...(job ? buildJobProperties(job) : {}),
    ...properties
  });
};

export const trackAppError = (eventName, errorLike = {}, extras = {}) => {
  captureAppEvent(eventName, {
    screen_name: extras?.screen_name || getCurrentScreenName() || 'Unknown',
    ...buildErrorProperties(errorLike),
    ...extras
  });
};

export const buildPaymentProperties = (payload = {}, extras = {}) => {
  const data = payload?.data || payload?.item?.data || {};
  const dataq = payload?.dataq || payload?.item?.dataq || {};

  return {
    product_name: data?.name || payload?.product_name || null,
    product_type: data?.product_type || payload?.product_type || null,
    amount: dataq?.total || payload?.amount || null,
    description: dataq?.description || payload?.description || null,
    reff_id: dataq?.reff_id || payload?.reff_id || null,
    visa_id: dataq?.visa_id || payload?.visa_id || null,
    visa_type_id: dataq?.visa_type_id || payload?.visa_type_id || null,
    addon_count: Array.isArray(dataq?.addonIds) ? dataq.addonIds.length : null,
    applicant_count: Array.isArray(dataq?.applicants) ? dataq.applicants.length : null,
    source_screen: payload?.source_screen || null,
    payment_flow: payload?.payment_flow || 'general_payment',
    ...extras
  };
};

export const trackPaymentEvent = (eventName, payload = {}, extras = {}) => {
  captureAppEvent(eventName, {
    ...buildPaymentProperties(payload, extras)
  });
};

export const trackScreenView = (posthog, route, extras = {}) => {
  if (!posthog || !route?.name) {




    return;
  }

  const properties = buildScreenEventProperties(route, extras);

  try {
    posthog.capture('screen_view', properties);


    if (typeof posthog.flush === 'function') {
      posthog.
      flush().
      then(() => {



      }).
      catch((error) => {




      });
    }
  } catch (error) {




  }
};
