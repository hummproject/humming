import AppConfig from '../../config/constants';

const LoginUser = data => {
  const URL = AppConfig.DOMAIN + AppConfig.LOGIN;
  console.log('url:', URL);
  console.log('Request:', JSON.stringify(data));
  return fetch(URL, {
    method: 'POST',
    headers: AppConfig.HEADERS,
    body: JSON.stringify(data),
  }).then(res => res.json());
};

export {LoginUser};

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
