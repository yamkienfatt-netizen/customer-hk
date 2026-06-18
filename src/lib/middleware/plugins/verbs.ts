import { NextRequest, NextResponse } from 'next/server';
import { MiddlewarePlugin } from '..';

const disallowedVerbs = ['DELETE', 'PUT'];

class VerbsPlugin implements MiddlewarePlugin {
  // Using 1 to leave room for things like redirects to occur first
  order = 1;

  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    const requestMethod = req.method.toUpperCase();
    if (requestMethod && disallowedVerbs.includes(requestMethod)) {
      return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
    return res || NextResponse.next();
  }
}

export const verbsPlugin = new VerbsPlugin();
