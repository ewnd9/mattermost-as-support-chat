import { z } from 'zod';

import { t } from '../trpc';
import { mattermostApi } from '../../config';

export const login = t.procedure
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
  });
