import { t } from './trpc';
import { getMyProfile } from './use-cases/get-my-profile';
import { getChatHistory } from './use-cases/get-chat-history';
import { postMessage } from './use-cases/post-message';
import { login } from './use-cases/login';

export const appRouter = t.router({
  getMyProfile,
  getChatHistory,
  postMessage,
  login,
});

export type AppRouter = typeof appRouter;

