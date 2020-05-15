import { Logger } from '@nestjs/common';
function cookieExtractor(req: any): string {

  // TODO this is too Fragile
  const cookiesArray = req.headers.cookie.split('=');
  return cookiesArray[1];
}
export default cookieExtractor;
