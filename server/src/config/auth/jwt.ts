import has from 'has';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';

import { Request } from 'express';
import { Strategy } from 'passport';

// Part of code has been taken from https://github.com/u-wave/core/blob/default/src/auth/JWTStrategy.js

const getQueryToken = (rq: Request): string | null => rq && typeof rq.query.token === 'string' ? rq.query.token : null;

const getHeaderToken = (rq: Request): string | null => {
  if (rq.headers && rq.headers.authorization) {
    const parts: string[] = rq.headers.authorization.split(' ');
    const [ type, token ]: string[] = parts;

    if (lodash.isEmpty(token.trim())) return null;
    if (type.toLowerCase() !== 'bearer') return null;

    return token;
  } 

  return null;
};

const isUserIDToken = (obj: { id: number }) => typeof obj === 'object' && obj !== null && has(obj, 'id') && typeof obj.id === 'number';

export default class JWTStrategy extends Strategy {
  constructor(private secret: Buffer | string) {
    super();

    this.secret = secret;
  }

  private async authenticateP(request: Request) {
    const token: string | null = getQueryToken(request) ?? getHeaderToken(request);
    if (!token) return this.pass();

    let value;

    try {
      value = jwt.verify(token, this.secret); 
    } catch (e) {
      return this.pass();
    }

    if (!isUserIDToken(value as { id: number })) return this.pass();

    // todo: check if user exists by using UserController

    return this.success();
  }

  public authenticate(request: Request) {
    this.authenticateP(request).catch(err => this.error(err));
  }
}