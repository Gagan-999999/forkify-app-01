import { TIME_OUT } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const res = await Promise.race([
      uploadData
        ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          })
        : fetch(url),
      timeout(TIME_OUT),
    ]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}, ${data.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIME_OUT)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`Id is not correct ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}, ${data.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
