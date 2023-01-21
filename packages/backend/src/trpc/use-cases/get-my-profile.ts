import { mattermostApi } from '../../config';
import { proxyProcedure } from '../proxy-middleware';

export const getMyProfile = proxyProcedure.query(async ({ ctx }) => {
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
});
