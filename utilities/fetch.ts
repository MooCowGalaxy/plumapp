export default async function fetchApi(url: string, method: 'GET' | 'POST', data: object = {}) {
    let options: any = {
        method,
        headers: {}
    };

    if (method === 'POST' && Object.keys(data).length > 0) {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }

    let res;
    try {
        res = await fetch(url.startsWith('http') ? url : process.env.EXPO_PUBLIC_BASE_URL + url, options);
    } catch (e) {
        return {
            fetched: false,
            error: e
        };
    }

    const json = await res.json();

    return {
        fetched: true,
        ok: res.ok,
        status: res.status,
        data: json.data
    };
}