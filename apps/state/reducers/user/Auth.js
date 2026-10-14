const initialState = {
  token: '',
  tokenRecruiter: '',
  login: true,
  user: null,
  userRecruiter: null,
  register: {
    status: false
  },
  error: null,
  errorRegister: '',
  loading: false,
  id: null,
  location: {
    lat: 0,
    lng: 0
  }
};

const Auth = (state = initialState, action) => {

  switch (action.type) {
    case 'USER.ADD_AUTH_TOKEN':
      return {
        ...state,
        token: action.token,
        loading: false,
        error: null,
        user: action.user,
        expired: action.expired
      };
      break;
    case 'USER.ADD_AUTH_TOKEN_RECRUITER':
      return {
        ...state,
        tokenRecruiter: action.tokenRecruiter,
        loading: false,
        error: null,
        userRecruiter: action.userRecruiter,
        expired: action.expired
      };
      break;
    case 'USER.ADD_USER':
      return {
        ...state,
        user: action.user
      };
    case 'USER.ADD_USER_RECRUITER':
      return {
        ...state,
        userRecruiter: action.userRecruiter
      };
      break;
    case 'USER.FETCH_LOGIN':
      return {
        ...state,
        loading: true
      };
      break;
    case 'USER.REGISTER':
      return {
        ...state,
        register: { status: action.status },
        loading: false
      };
      break;
    case 'USER.REGISTER_ERROR':
      return {
        ...state,
        errorRegister: action.error,
        login: false,
        loading: false
      };
      break;
    case 'USER.LOGIN_ERROR':
      return {
        ...state,
        error: action.error,
        otp: false,
        loading: false
      };
      break;
    case 'USER.LOGOUT_RECRUITER':
      return {
        ...state,
        error: false,
        userRecruiter: null,
        tokenRecruiter: '',
        otp: false,
        loading: false
      };
      break;
    case 'USER.LOGOUT':
      return initialState;
      break;
    case 'USER.CLEAR_LOGIN':
      return initialState;
      break;
    case 'USER.CLEAR_REGISTER':
      return initialState;
      break;
    default:
      return state;
  }
};

export default Auth;