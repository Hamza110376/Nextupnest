import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import AgencyDetails from '@/components/forms/agency-details'
import React from 'react'

const page = async (
  {
    searchParams,
  }:{searchParams:{plan:Plan; state:string; code: string}}
) => {

    const AgencyId =await verifyAndAcceptInvitation()
console.log(AgencyId)
    const user = await getAuthUserDetails()
    if (user?.role ==="SUBACCOUNT_GUEST" || user?.role==="SUBACCOUNT_USER") {
      return redirect("/subaccount")
    }
    else if(user?.role ==="AGENCY_OWNER" || user?.role=== "AGENCY_ADMIN"){
if (searchParams.plan) {
  return redirect(`/agency/${AgencyId}/billing?/paln = ${searchParams.plan}`)
}
if (searchParams.state) {
  const statePath= searchParams.state.split(`__`)[0];
  const stateAgencyId = searchParams.state.split(`__`)[1];
  if (!stateAgencyId) return <div>Not authorized</div>
  return redirect(
    `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
  )
}
else{
  return redirect(`/agency/${AgencyId}`)
}

    }

const authUser = await currentUser()
return <div className='flex justify-center items-center mt-[100px]'>
  <div className='max-w-[850px] border-[1px] p-4 rounded-xl'>
    <h1 className='text-4xl text-center'>Create An Agency</h1>
<AgencyDetails data={{companyEmail: authUser?.emailAddresses[0].emailAddress}}/>
  </div>
</div>
}


export default page