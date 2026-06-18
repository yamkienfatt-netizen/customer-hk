import { Message, SMTPClient } from 'emailjs';
import { createHash } from 'crypto';
import { string } from 'zod';

export class IsCreateProfileDto {
  title: string = '';
  lastname: string = '';
  firstname: string = '';
  emailAddress: string = '';
  stayedInThePast: string = '';
  residenceLocation: string = '';
  stayedInProperty: string = '';
  createdLocation: string = '';
  marketingOptinLastModifiedSource: string = 'Website';
  marketingOptIn: boolean = true;
  privacyPolicyConsent: boolean = true;
  dataManageWithinResidence: boolean = true;
  dataManageOutsideResidence: boolean = true;
  sensitiveInfoOptIn: boolean = true;
}

export class FormService {
  getAllPropertyTokens(obj: any): string[] {
    return Object.keys(obj);
  }
  mapTokens(text: string, data: any): string {
    let result = text;
    const keys = this.getAllPropertyTokens(data);
    keys.forEach((x: string) => {
      // console.log(`${x} : ${data[x]}`);
      let replaceValue = data[x];
      switch (x.toLowerCase()){
        case 'date':
          case 'eventdate':
            case 'alternativedate':
            case 'checkin':
            case 'checkout':
              const [year, month, day] = replaceValue.split('-').map(Number);
              if (!!year && !!month && !!day)
              replaceValue = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${String(year).padStart(4, '0')}`;
              break;
        default:
          break;
      }

      result = result.replace('{{' + x + '}}', replaceValue);
      result = result.replace('$' + x.toLowerCase(), replaceValue);
    });
    return result;
  }

  sendEmailToRecivers(body: string, subject: string, from: string | undefined, receiver: string) {
    try {
      if (!body?.length || !receiver?.length) {
        return 'Error';
      }
      const smtpClient: SMTPClient = this.createSmtpClient();
      let mailfrom = from || process.env.SMTP_USERNAME;
      if (process.env.SMTP_OVERRIDE_FROM) {
        mailfrom = process.env.SMTP_OVERRIDE_FROM;
      }
      let toList:string[] =[];
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      receiver.split(',').forEach((item:string) => {
        item = item.trim();
        if(emailRegex.test(item))
          toList.push(item);
      })
      const message = new Message({
        'content-type': 'text/html; charset=utf-8',
        text: body, // can not use html tag
        from: mailfrom,
        to: toList,
        subject: subject,
      });
      // console.log(smtpClient);
      smtpClient.send(message, (err: any, message: any) => {
        console.log(err || message);
      });
    } catch (e) {
      console.error(e);
      return 'Error';
    }
    return 'Success';
  }

  createSmtpClient(): SMTPClient {
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 25;
    const smtpSSL = process.env.SMTP_SSL ? process.env.SMTP_SSL?.toLowerCase?.() === 'true' : false;
    const smtpTLS = process.env.SMTP_TLS ? process.env.SMTP_TLS?.toLowerCase?.() === 'true' : false;
    var smtpOptions = {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      ssl: smtpSSL,
      tls: smtpTLS,
      user: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
    };
    return new SMTPClient(smtpOptions);
  }

  async CallSalesforceAPI(data: IsCreateProfileDto): Promise<boolean> {
    try {
      const endpoint = process.env.SALESFORCE_IS_HOST!;
      // const controller = new AbortController();
      // const signal = controller.signal;
      // const timeout = setTimeout(() => {
      //   controller.abort();
      // }, 1000 * 60 * 3);
      console.log(`Calling CRM Endpoint ${endpoint}`);
      console.log(`IsCreateProfileDto`, JSON.stringify(data));
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // signal: signal,
        body: JSON.stringify(data),
      });
      // .finally(() => {
      //   clearTimeout(timeout);
      // });

      if (res.status.toString() === '200') {
        return true;
      } else {
        const sfISResponse = await res.json();
        console.log(sfISResponse);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }
  hashApiKey(key:string) {
    return createHash('sha256').update(key).digest('hex');
  }
  checkValidKey(key: string): boolean {
    const apiKey = process.env.CUSTOM_GRAPHQL_SERVICE_KEY;
    console.log(apiKey);
    console.log(this.hashApiKey(key));
    return this.hashApiKey(key) === apiKey
  }
}
// export const formService = new FormService();
export const formService = new FormService({
  cacheTimeout: process.env.CUSTOM_GRAPHQL_SERVICE_CACHE_TTL
    ? Number(process.env.CUSTOM_GRAPHQL_SERVICE_CACHE_TTL) / 1000
    : 300,
  cacheEnabled: process.env.CUSTOM_GRAPHQL_SERVICE_CACHE_ENABLED === 'true',
});
