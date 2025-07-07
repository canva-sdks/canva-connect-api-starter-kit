export type DownloadExportedDesignRequest = {
  exportedDesignUrls: string[];
  flyerId?: string;
};

export type DownloadExportedDesignResponse = {
  downloadedExportUrls: string[];
};
