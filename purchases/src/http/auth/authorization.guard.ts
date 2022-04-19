import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util'; //converte uma função callback em uma promise

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;
  constructor(private readonly configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const httpContext = context.switchToHttp();
    // const request = httpContext.getRequest();
    //const response = httpContext.getResponse();
    console.log('teste')

    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-vinilitaiff.us.auth0.com/.well-known/jwks.json',
        }),
        audience: this.AUTH0_AUDIENCE,
        issuer: `${this.AUTH0_DOMAIN}`,
        algorithms: ['RS256'],
      }),
    );

    try {
      console.log(req);
      console.log(res);
      await checkJWT(req, res);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
