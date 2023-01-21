export interface MattermostUser {
  id: string;
  teamId: string;
  channelId: string;
  cookie: string;
}

export const usersMap: Record<string, MattermostUser> = {};
