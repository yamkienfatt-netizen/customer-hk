import { NextApiRequest, NextApiResponse } from "next";

const usage = async (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<NextApiResponse | void> => {
    return res.status(200).send({ memory : process.memoryUsage()});
  };
  
  export default usage;
  