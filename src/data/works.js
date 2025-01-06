import { getWorksFromNotion } from '../utils/notion';

export const getWorks = async () => {
  const works = await getWorksFromNotion();
  return works;
} 