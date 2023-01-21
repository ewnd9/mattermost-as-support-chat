import React, { useEffect, useState } from 'react';
import { WebSocketClient } from '@mattermost/client';

import { trpc } from './trpc';
import { useQueryClient } from '@tanstack/react-query';

export const App = () => {
  const getMyProfileQuery = trpc.getMyProfile.useQuery();
  const loginMutation = trpc.login.useMutation();

  useEffect(() => {
    (async () => {
      if (!getMyProfileQuery.data || getMyProfileQuery.data.status === 'ok') {
        return;
      }

      const email = window.prompt('email')!;
      const password = window.prompt('password')!;

      loginMutation.mutate({ email, password });
    })();
  }, [getMyProfileQuery.data?.status]);

  if (!getMyProfileQuery.data) {
    return <Loader />;
  }

  return <div><Chat /></div>
}

const Loader = () => <div>Loading...</div>;

const Chat = () => {
  const queryClient = useQueryClient();
  const getChatHistoryQuery = trpc.getChatHistory.useQuery();
  const postMessageMutation = trpc.postMessage.useMutation({
    onSuccess: newPost => {
      queryClient.setQueriesData(trpc.getChatHistory.getQueryKey(), (old) => {
        return [...(old as any[]), newPost];
      });
    }
  });
  const [input, setInput] = useState('');

  if (!getChatHistoryQuery.data) {
    return <Loader />;
  }

  return (
    <div>
      <h1>chat</h1>
      <div>
        <ul>
          {getChatHistoryQuery.data.map((post) => (
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
            postMessageMutation.mutate({ message: input });
            setInput('');
          }
        }}
      />
    </div>
  );
};

// async function initClient() {
//   const client = new WebSocketClient();
//   client.initialize(`ws://${location.host}/api/v4/websocket`);

//   client.addMessageListener((...args) =>
//     console.log('addMessageListener', ...args)
//   );
//   client.addFirstConnectListener((...args) =>
//     console.log('addFirstConnectListener', ...args)
//   );
//   client.addReconnectListener((...args) =>
//     console.log('addReconnectListener', ...args)
//   );
//   client.addMissedMessageListener((...args) =>
//     console.log('addMissedMessageListener', ...args)
//   );
//   client.addCloseListener((...args) =>
//     console.log('addCloseListener', ...args)
//   );
// }
