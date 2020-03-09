import AppConfig from '../../config/constants';

const UploadPost = (data) => {
    const URL = AppConfig.DOMAIN + AppConfig.SAVE_MARKER;

    return fetch(URL, {
        method: 'POST',
        headers: AppConfig.HEADERS,
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export {
    UploadPost
}


// fetch(AppConfig.DOMAIN + AppConfig.LOGIN, {
//     method: 'POST',
//     headers: AppConfig.HEADERS,
//     body: JSON.stringify({
//         userName: userName,
//         userpassword: userPwd
//     })
// }).then((response) => response.json())
//     .then((responseJson) => {
//         console.log(responseJson);
//         // this.props.navigation.navigate('TabBar', { userData: responseJson.data });
//     })
//     .catch((error) => {
//         console.log(error);
//     });