import { mattermostApi } from '../../config';
import { mapMattermostPost } from '../../mappers/map-mattermost-user';
import { proxyProcedure } from '../proxy-middleware';

export const getChatHistory = proxyProcedure.query(async ({ ctx }) => {
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
})
