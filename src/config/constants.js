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
    }
};

export default AppConfig;