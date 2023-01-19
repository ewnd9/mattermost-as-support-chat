import React from 'react';
import axios from 'axios';
import { WebSocketClient } from '@mattermost/client';

// TODO: get list from api
const channelId = 'tqgnf1feqtyutpmzguxhoda9xh';
const userId = 'qt55opr3pbnpfjakrymfjemkzc';

const apiClient = axios.create({
  headers: {
    // 401 without it
    'x-requested-with': 'XMLHttpRequest',
  },
});

(async () => {
  await login();
  await initClient();
})();

export const App = () => <div>hello</div>;

async function login() {
  if (!localStorage.auth) {
    const email = window.prompt('email');
    const password = window.prompt('password');

    await apiClient.post('/api/v4/users/login', {
      login_id: email,
      password,
      token: '',
      deviceId: '',
    });

    localStorage.auth = 'true';
  }
}

async function initClient() {
  const client = new WebSocketClient();
  client.initialize(`ws://${location.host}/api/v4/websocket`);

  client.addMessageListener((...args) =>
    console.log('addMessageListener', ...args)
  );
  client.addFirstConnectListener((...args) =>
    console.log('addFirstConnectListener', ...args)
  );
  client.addReconnectListener((...args) =>
    console.log('addReconnectListener', ...args)
  );
  client.addMissedMessageListener((...args) =>
    console.log('addMissedMessageListener', ...args)
  );
  client.addCloseListener((...args) =>
    console.log('addCloseListener', ...args)
  );

  setTimeout(async () => {
    await apiClient.post('/api/v4/posts', {
      file_ids: [],
      message: 'post ' + Date.now(),
      props: { disable_group_highlight: true },
      metadata: {},
      channel_id: channelId,
      user_id: userId,
      create_at: 0,
      update_at: Date.now(),
      reply_count: 0,
    });
  }, 1000);
}
