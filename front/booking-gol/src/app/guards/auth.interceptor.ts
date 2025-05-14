import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

const generateToken = () => {
  const authTokenPass = environment.authTokenPass;
  const authTokenKey = CryptoJS.enc.Base64.parse(environment.authTokenKey);
  const authTokenIv = CryptoJS.enc.Utf8.parse(environment.authTokenIv);

  return CryptoJS.AES.encrypt(
    authTokenPass,
    authTokenKey,
    {
      iv: authTokenIv,
      mode: CryptoJS.mode.CBC
    }
  ).toString();
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const encryptedToken = generateToken();

  const authRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${encryptedToken}`)
  });

  console.log('token', authRequest);
  return next(authRequest);
};
