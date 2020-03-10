import AppConfig from '../../config/constants';

const RegisterUser = (data) => {
    const URL = AppConfig.DOMAIN + AppConfig.REGISTER;

    return fetch(URL, {
        method: 'POST',
        headers: AppConfig.HEADERS,
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export {
    RegisterUser
}