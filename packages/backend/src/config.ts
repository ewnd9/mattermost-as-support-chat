import { cleanEnv, num, str } from 'envalid';
import axios from 'axios';

export const env = cleanEnv(process.env, {
  PORT: num({ default: 8081 }),
  MATTERMOST_HOST: str(),
  MATTERMOST_WEBSOCKET: str(),
});

export const mattermostApi = axios.create({
  baseURL: env.MATTERMOST_HOST,
  headers: {
    // 401 without it
    'x-requested-with': 'XMLHttpRequest',
  },
});
