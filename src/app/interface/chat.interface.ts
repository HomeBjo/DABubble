export interface Chat {
  id: string;
  userId: string;
  channelId: string;
  message: string;
  edited: boolean;
  publishedTimestamp: number;
}

export interface ChatAnswers {
  id: string;
  chatId: string;
  message: string;
  edited: boolean;
  publishedTimestamp: number;
  userId: string;
}

export interface ChatReactions {
  id?: string;
  chatId: string;
  icon: string;
  userId: string[];
}

export interface MessageData {
  message: string;
  publishedTimestamp: number;
  userId: string;
  channelId?: string;
  chatId?: string;
  edited: boolean;
}
