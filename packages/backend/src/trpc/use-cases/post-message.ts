import { z } from 'zod';

import { mattermostApi } from '../../config';
import { mapMattermostPost } from '../../mappers/map-mattermost-user';
import { proxyProcedure } from '../proxy-middleware';

export const postMessage = proxyProcedure
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
  });
