import { NextApiRequest, NextApiResponse } from 'next';

const getInstagramPosts = async (
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  await getIGPosts();
  return res.status(200).send({});
};

async function getIGPosts() {
  try {
    console.log(process.env.IG_ACCOUNT_ID!);
    console.log(process.env.IG_ACCESS_TOKEN!);
    const igFields = 'media_url,caption,timestamp,thumbnail_url,id,username,permalink';
    var igApi = `https://graph.instagram.com/${process.env
      .IG_ACCOUNT_ID!}/media?fields=${igFields}&access_token=${process.env.IG_ACCESS_TOKEN!}`;
    console.log(igApi);
    const res = await fetch(igApi, {
      method: 'GET',
    });

    console.log(res.status.toString());
    const igResponse = await res.json();
    console.log(igResponse);
  } catch (err) {
    console.log(err);
  }
}

export default getInstagramPosts;
