'use client'
import { Agency } from '@prisma/client'
import React, { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { AlertDialog } from '../ui/alert-dialog'
import { Card,CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = {
  data?: Partial<Agency>
}

const AgencyDetails = ({data}: Props) => {
    const toast =useToast()
    const router =useRouter()
    const [deletingAgency, setDeletingAgency] =  useState(false)
  return (
  
    <AlertDialog>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>Let create an agency for your business. You can edit agency settings later from the agency settings tab</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails