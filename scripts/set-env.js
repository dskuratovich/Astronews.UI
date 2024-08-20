import { fs } from 'fs';
import { path } from 'path';

const environmentFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');
const apiKey = process.env.NASA_API_KEY;

if (apiKey) {
  const content = `export const environment = {
  production: true,
  api: {
    newsEndpoint: 'https://api.spaceflightnewsapi.net/v4/articles/',
    nasaEndpoint: 'https://images-api.nasa.gov/search',
    marsCuriosityEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos',
    marsOpportunityEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos',
    marsSpiritEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos',
    marsPerseveranceEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos',
    apodEndpoint: 'https://api.nasa.gov/planetary/apod',
    marsCuriosityLatestEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos',
    marsOpportunityLatestEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos',
    marsSpiritLatestEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos',
    marsPerseveranceLatestEndpoint:
      'https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos',
  },
  secrets: {
    api_key: '${apiKey}',
  },
};
`;

  fs.writeFileSync(environmentFilePath, content, 'utf-8');
}
