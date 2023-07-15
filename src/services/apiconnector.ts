import axios from 'axios';

export const axiosInstance = axios.create({});

interface IApiConnector {
    (method: any, url: any, bodyData?: any, headers?: any, params?: any): Promise<any>;
}

export const apiConnector: IApiConnector = async (method, url, bodyData , headers , params ) => {
    return  axiosInstance(
    {
        method : `${method}`,
        url : `${url}`,
        data : bodyData ? bodyData : null,
        headers : headers ? headers : null,
        params : params ? params : null
    })
};
