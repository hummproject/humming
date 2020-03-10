import AppConfig from '../../config/constants';

const UpdateUserDp = (data) => {
    const URL = AppConfig.DOMAIN + '/api/v1/awsupdate';

    return fetch(URL, {
        method: 'POST',
        headers: AppConfig.HEADERS_UPDATE,
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export {
    UpdateUserDp
}