export type GetPublishedFileDetailsResponse = Partial<{
  response: {
    result: number;
    resultcount: number;
    publishedfiledetails: PublishedFileDetails[],
  }
}>;

export type PublishedFileDetails = Partial<{
  publishedfileid: string;
  file_size: number;
  file_url: string;
}>;
