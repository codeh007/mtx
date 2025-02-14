jest.mock('../single_url', () => {
  const originalModule = jest.requireActual('../single_url');
  originalModule.fetchHtmlContent = jest.fn().mockResolvedValue('<html><head><title>Test</title></head><body><h1>Roast</h1></body></html>');

  return originalModule;
});

import { scrapSingleUrl } from '../single_url';
import { PageOptions } from '../../../lib/entities';

describe('scrapSingleUrl', () => {
  it('should handle includeHtml option correctly', async () => {
    const url = 'https://roastmywebsite.ai';
    const pageOptionsWithHtml: PageOptions = { includeHtml: true };
    const pageOptionsWithoutHtml: PageOptions = { includeHtml: false };

    const resultWithHtml = await scrapSingleUrl(url, pageOptionsWithHtml);
    const resultWithoutHtml = await scrapSingleUrl(url, pageOptionsWithoutHtml);

    expect(resultWithHtml.html).toBeDefined();
    expect(resultWithoutHtml.html).toBeUndefined();
  }, 10000);
});
