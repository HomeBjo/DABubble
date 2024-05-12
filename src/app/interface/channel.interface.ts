export const publicChannels: string[] = [
  'XiqUAXRY1W7PixC9kVTa',
  'eV0AcEEMgVEFA9R2X4qQ',
];
export interface Channel {
  id?: string;
  name: string;
  description: string;
  creator: string;
  privatChannel: boolean;
  hashtag: string;
  createdDate: string;
  addedUser: Array<string>;
}

export interface PrvChannel {
  id?: string;
  creatorId: string;
  talkToUserId: string;
}
