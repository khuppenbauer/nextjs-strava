import axios from 'axios';
import getConfig from 'next/config';
import { getItem, createItem, updateItem } from './directus';

const {
  publicRuntimeConfig: { stravaClientId, stravaClientSecret, stravaRefreshToken },
} = getConfig();

const stravaOAuthUrl = 'https://www.strava.com/oauth/token';
const stravaBaseUrl = 'https://www.strava.com/api/v3/';
const stravaGrantType = 'refresh_token';

export async function getStravaToken() {
  const url = '/items/tokens?filter={ "app": { "_eq": "strava" }}'
  const { data } = await getItem(url);
  let access_token = '';
  let item = {
    access_token: '',
    token_type: 'Bearer',
    expires_at: 0,
  };
  if (data.length > 0) {
    item = data[0];
    access_token = item['access_token'];
    const expires_in = item['expires_at'] - Math.floor(Date.now() / 1000);
    if (expires_in > 600) {
      return access_token;
    }
  }
  const res = await axios({
    method: 'post',
    url: stravaOAuthUrl,
    data: {
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      refresh_token: stravaRefreshToken,
      grant_type: stravaGrantType,
    },
  });
  item = res.data;
  access_token = item['access_token'];
  const { expires_at, token_type} = item;
  const token = {
    app: 'strava',
    token_type,
    expires_at,
    access_token,
  }
  if (data.length > 0) {
    const url = `/items/tokens/${data[0]['id']}`;
    await updateItem(url, token);
  } else {
    const url = '/items/tokens';
    await createItem(url, token);
  }
  return access_token;
};

export async function getStravaData(url: string, token: string) {
  const instance = axios.create({
    baseURL: stravaBaseUrl,
    headers: { Authorization: `Bearer ${token}` },
  });
  const res = await instance.get(url);
  if (res.status !== 200) {
    return {};
  }
  return res.data;
}

export async function streamToGeoJson(stream: any, name: string) {
  const coordinates = stream.latlng.data.map((e: any, index: any) => [
    parseFloat(e[1].toFixed(6)),
    parseFloat(e[0].toFixed(6)),
    stream.altitude.data[index],
  ]);
  const geoJson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      name,
      color: 'red',
      type: 'segment',
    },
  };
  return geoJson;
};
