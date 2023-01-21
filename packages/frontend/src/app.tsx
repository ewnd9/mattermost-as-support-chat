import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { trpc } from './trpc';

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
  useWebsocketClient();

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

function useWebsocketClient() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = new WebSocket(`ws://${location.host}/websocket`);
    client.onmessage = (event) => {
      const data: any = JSON.parse(event.data);
      if (data.type === 'new-post') {
        queryClient.setQueriesData(trpc.getChatHistory.getQueryKey(), (old) => {
          return [...(old as any[]), data.post];
        });
      } else {
        console.log('unknown message', data);
      }
    }
  }, []);
}
