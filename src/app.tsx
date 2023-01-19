import React, { useEffect, useState } from 'react';
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

export const App = () => {
  const [posts, setPosts] = useState([] as { id: string; message: string }[]);
  const [input, setInput] = useState('');

  useEffect(() => {
    (async () => {
      await login();
      await initClient();

      // @TODO: react-query
      const { data } = await apiClient.get(
        `/api/v4/channels/${channelId}/posts`,
        {
          params: {
            // before: ntgthhpdojryzpb1joqs5wsrgh,
            page: 0,
            per_page: 30,
            skipFetchThreads: false,
            collapsedThreads: true,
            collapsedThreadsExtended: false,
          },
        }
      );

      setPosts(data.order.reverse().map((id) => data.posts[id]));
    })();
  }, []);

  return (
    <div>
      <h1>chat</h1>
      <div>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.message}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            apiClient.post('/api/v4/posts', {
              file_ids: [],
              message: input,
              props: { disable_group_highlight: true },
              metadata: {},
              channel_id: channelId,
              user_id: userId,
              create_at: 0,
              update_at: Date.now(),
              reply_count: 0,
            });

            setPosts([...posts, { id: String(Date.now()), message: input }]);
            setInput('');
          }
        }}
      />
    </div>
  );
};

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
}
