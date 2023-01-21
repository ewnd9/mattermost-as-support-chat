import { TRPCError } from '@trpc/server';

import { t } from './trpc';
import { mattermostApi } from '../config';
import { MattermostUser, usersMap } from '../data/users-map';

export const proxyMiddleware = t.middleware(async ({ next, ctx }) => {
  const cookie = ctx.req.headers.cookie;
  if (!cookie) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // @TODO: replace with server session
  if (!usersMap[cookie]) {
    const { data: user } = await mattermostApi.get('/api/v4/users/me', {
      headers: {
        cookie,
      }
    });

    const { data: [team] } = await mattermostApi.get('/api/v4/users/me/teams', {
      headers: {
        cookie,
      }
    });

    const { data: [channel] } = await mattermostApi.get(`/api/v4/users/me/teams/${team.id}/channels`, {
      headers: {
        cookie,
      }
    });

    const mattermostUser: MattermostUser = {
      id: user.id,
      teamId: team.id,
      channelId: channel.id,
      cookie,
    };

    usersMap[cookie] = mattermostUser;
  }

  return next({
    ctx: {
      user: usersMap[cookie],
    },
  });
});

export const proxyProcedure = t.procedure.use(proxyMiddleware);
