import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hostname } from "os";


export default authMiddleware({
  publicRoutes:['/site' , '/api.uploadthing'],

 async beforeAuth(auth, req){},
  async afterAuth(auth, req){
    const url= req.nextUrl;
    const searchParam =url.searchParams.toString();
    let hostname= req.headers;

    const pathWithSearchParams =`${url.pathname}${searchParam.length>0  ?  `?${searchParam}`: ``}`

      const customSubDomain= hostname.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0]

      if (customSubDomain) {
        return NextResponse.rewrite(new URL(`${customSubDomain} ${pathWithSearchParams}`))
        
      }
      if (url.pathname ==='/sign-in' || url.pathname ==='/sign-up') {
        return NextResponse.redirect(new URL(``))
        
      }
  },


  
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};