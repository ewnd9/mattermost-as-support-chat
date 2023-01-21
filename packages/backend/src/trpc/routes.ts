import { z } from 'zod';

import { proxyProcedure } from './proxy-middleware';
import { t } from './trpc';
import { mattermostApi } from '../config';

export const appRouter = t.router({
  getMyProfile: proxyProcedure.query(async ({ ctx }) => {
    try {
      await mattermostApi.get('/api/v4/users/me', {
        headers: {
          cookie: ctx.user.cookie,
        }
      });

      return {
        status: 'ok',
      };
    } catch (err) {
      return {
        status: 'unauthorized'
      };
    }
  }),
  getChatHistory: proxyProcedure.query(async ({ ctx }) => {
    const { data } = await mattermostApi.get(
      `/api/v4/channels/${ctx.user.channelId}/posts`,
      {
        headers: {
          cookie: ctx.user.cookie,
        },
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

    return data.order.reverse().map((id) => mapMattermostPost(data.posts[id]));
  }),
  postMessage: proxyProcedure
    .input(
      z.object({
        message: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = await mattermostApi.post('/api/v4/posts', {
        file_ids: [],
        message: input.message,
        props: { disable_group_highlight: true },
        metadata: {},
        channel_id: ctx.user.channelId,
        create_at: 0,
        update_at: Date.now(),
        reply_count: 0,
      }, {
        headers: {
          cookie: ctx.user.cookie,
        }
      });

      return mapMattermostPost(data);
    }),
  login: t.procedure
    .input(
      z.object({
        email: z.string().min(3),
        password: z.string().max(142).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, headers } = await mattermostApi.post('/api/v4/users/login', {
        login_id: input.email,
        password: input.password,
        token: '',
        deviceId: '',
      });

      ctx.res.header('set-cookie', headers['set-cookie']);
      return data;
    }),
});

export type AppRouter = typeof appRouter;

function mapMattermostPost(post: any) {
  return {
    id: post.id,
    message: post.message,
    userId: post.user_id,
  }
}
