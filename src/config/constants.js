const AppConfig = {
    DOMAIN: "https://humming-psql.herokuapp.com",
    LOGIN: "/login",
    GET_MARKERS:"/api/v1/getmarker",
    UPDATE_USER_DP: "/api/v1/awsupdate",
    SAVE_MARKER: "/api/v1/savemarker",
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
};

export default AppConfig;