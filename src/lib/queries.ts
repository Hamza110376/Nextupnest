"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { SubAccount, User } from "@prisma/client";
import { error } from "console";
import { connect } from "http2";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }
  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });
  return userData;
};

export const saveActivityLogNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (authUser) {
    let response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    } else {
      userData = await db.user.findUnique({where:{email:authUser.emailAddresses[0].emailAddress}});
    }
    if (!userData) {
      console.log('cant;t find the user')
      return;
    }
    let foundAgencyId = agencyId;
    if (!foundAgencyId) {
      if (!subaccountId) {
        throw new Error("you need to provide atleast an agencIid or subaccountId")
      }
    }
    const responses =await db.subAccount.findUnique({where:{id: subaccountId}})
    if(response) foundAgencyId = response.agencyId
  }
  if (subaccountId) {
    await db.notification.create({
      data:{
        notification: `${userData?.name} | ${description}`,
        User:{
          connect:{
         id: userData?.id
          },
        },
        Agency:{
          connect:{
            id: foundAgencyId,
          },
        },
        SubAccount:{
          connect:{
            id: subaccountId
          }
        }
      }
    })
  }
  else{
    await db.notification.create({
      data:{
        notification: `${userData?.name} | ${description}`,
        User:{
          connect:{
            id: userData?.id
          },
        },
        Agency:{
          connect:{
            id: foundAgencyId
          }
        }
      }
    })
  }

};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const invitationExist = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });
  if (invitationExist) {
    const userDetail = await createTeamUser(invitationExist.agencyId, {
      email: invitationExist.email,
      agencyId: invitationExist.agencyId,
      avatarUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExist.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
     await saveActivityLogNotification({
       agencyId: invitationExist?.agencyId,
       description: `joined`,
       subaccountId: undefined,
     });
     if (userDetail) {
      await clerkClient.users.updateUserMetadata(user.id,{
        privateMetadata:{
          role:userDetail.role || 
          "SUBACCOUNT_USER",
        }
      })

      await db.invitation.delete({
        where:{
          email: userDetail.email,
        }

      })
      return userDetail.agencyId
      
     } else return null
  }else{
    const agency = db.user.findUnique({where:{
      email: user.emailAddresses[0].emailAddress
    }}) 

    return agency? agency.agency:null
  }

 
};
