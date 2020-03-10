const AppConfig = {
    DOMAIN: "https://humming-psql.herokuapp.com",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_MARKERS:"/api/v1/getmarker",
    UPDATE_USER_DP: "/api/v1/awsupdate",
    SAVE_MARKER: "/api/v1/savemarker",
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    HEADERS_UPDATE: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjgiLCJpYXQiOjE1ODM4MzczMTksImV4cCI6MTU4NDQ0MjExOX0.HzFp43qpD61IAS05CY__zmvROj0B7uVydfblaxm_ODE',
        
    }
};

export default AppConfig;