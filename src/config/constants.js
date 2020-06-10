const AppConfig = {
    DOMAIN: "https://humming-psql.herokuapp.com",
    LOGIN: "/login",
    REGISTER: "/register",
    GET_MARKERS: "/api/v1/getmarker",
    SAVE_MARKER: "/api/v1/savemarker",
    GET_MARKER_COMMENTS: "/api/v1/commentsbymarker",
    ADD_COMMENTS_TO_MARKER: "/api/v1/addcomments",
    LIKE_OR_UNLIKE_MARKER: "/api/v1/like",
    SEARCH_TOP_MARKERS: "/searchtopmarkers",
    SEARCH_ALL_MARKERS: "/api/v1/searchallmarkers",
    GET_MARKERS_BY_USER: "/api/v1/markersbyuser",
    UPDATE_USER_PROFILE: "/api/v1/awsupdate",
    GET_POST_USER_PROFILE: "/api/v1/getprofile",
    FOLLOW_USER: "/api/v1/follow",
    UN_FOLLOW_USER: "/api/v1/unfollow",
    FORGOT_PASSWORD_GET_OTP: "/forgotpassword",
    FORGOT_PASSWORD_VERIFY_OTP: "/verify",
    FORGOT_PASSWORD_UPDATE_PASSWORD: "/updatepassword",
    UPDATE_USER_ACCOUNT_STATUS: "/api/v1/updateaccountstatus",
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    HEADERS_UPDATE: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjgiLCJpYXQiOjE1ODM4MzczMTksImV4cCI6MTU4NDQ0MjExOX0.HzFp43qpD61IAS05CY__zmvROj0B7uVydfblaxm_ODE',

    },
    assets: ["./assets/fonts/"],
};

export const ButtonGradientColor1 = '#E62469'
export const ButtonGradientColor2 = '#FC4735'

export default AppConfig;