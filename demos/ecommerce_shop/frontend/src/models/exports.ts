export type DownloadExportedDesignRequest = {
  exportedDesignUrl: string;
  productId?: number;
};

export type DownloadExportedDesignResponse = {
  downloadedExportUrl: string;
};
