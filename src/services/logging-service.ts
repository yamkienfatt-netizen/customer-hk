import winston, { format } from 'winston';
import { createHash, randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { propertiesToMask } from './SsoApiService';

const _loggers: Record<string, winston.Logger> = {};

export const hashMD5 = (value: string) => {
  if (value) return createHash('md5').update(value).digest('hex');
  return '';
};

export function maskProperties(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  targetKeys: Array<string>
) {
  if (typeof obj !== 'object' || obj === null) return null;

  for (const key in obj) {
    if (targetKeys.includes(key)) {
      obj[key] = hashMD5(obj[key]); // Replace the value
    }

    if (typeof obj[key] === 'object') {
      maskProperties(obj[key], targetKeys);
    }
  }
  return obj;
}

export const loggers = {
  sso: () => {
    if (!_loggers.sso) {
      _loggers.sso = winston.createLogger({
        format: format.combine(format.timestamp(), format.json()),
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: 'logs/sso.log' }),
        ],
      });
    }
    return _loggers.sso;
  },
};

export const logSsoApiRequest = (req: NextApiRequest, res: NextApiResponse) => {
  const startTime = process.hrtime();
  const logger = loggers.sso();
  if (logger) {
    const request_url = req.url?.endsWith('/') ? req.url.slice(0, -1) : req.url;
    const apiName = request_url?.substring(request_url?.lastIndexOf('/') + 1);
    const requestId = randomUUID();
    const data = Object.assign({}, req.body || {});
    logger.info(`${apiName}|START`, {
      requestId,
      request_body: maskProperties(data, propertiesToMask),
      requset_url: req.url,
      requset_method: req.method,
    });
    res.once('close', async () => {
      const totalTime = process.hrtime(startTime);
      const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
      logger.info(`${apiName}|END`, {
        requestId,
        request_time_msec: totalTimeInMs,
        response_status: res.statusCode,
      });
    });
  }
};
