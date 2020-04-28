import AppConfig from '../../config/constants';

const RegisterUser = (data) => {
    const URL = AppConfig.DOMAIN + AppConfig.REGISTER;
    console.log(URL);
    console.log(data);
    return fetch(URL, {
        method: 'POST',
        headers: AppConfig.HEADERS,
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export {
    RegisterUser
}