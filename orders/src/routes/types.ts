import type { Request } from 'express';
import type { UserPayload } from '@zuaticket/common';

export interface RequestWithCurrentUser extends Request {
  currentUser?: UserPayload;
}
