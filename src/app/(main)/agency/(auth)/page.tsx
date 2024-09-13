import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'

import React from 'react'

const page = async ({searchParams,}:{searchParams:(plan:Plan; state: string; code: string)}) => {

    const AgencyId =await verifyAndAcceptInvitation()
console.log(AgencyId)
    const user = await getAuthUserDetails()
    if (user?.role ==="SUBACCOUNT_GUEST" || user?.role==="SUBACCOUNT_USER") {
      return redirect("/subaccount")
    }
    else if(user?.role ==="AGENCY_OWNER" || user?.role=== "AGENCY_ADMIN"){

    }
  return  <div>Agency</div>
}

export default page