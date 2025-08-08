export type Beat = {
  id: string;
  title: string;
  price: number; // in USD cents
  audioUrl: string;
  coverUrl?: string;
  bpm?: number;
  key?: string;
  createdAt: string; // ISO
};

export type DownloadToken = {
  token: string;
  beatId: string;
  expiresAt: number; // epoch ms
};