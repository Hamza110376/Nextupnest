import Navigation from '@/components/site/navigation'
import React from 'react'

const layout = ({children}:{children: React.ReactNode}) => {
  return <main className='h-full w-full flex items-center justify-center'>
    <Navigation/>
    {children}
    </main>
}

export default layout