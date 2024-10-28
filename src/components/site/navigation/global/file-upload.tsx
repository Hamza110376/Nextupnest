import React from 'react'

type Props = {
    apiEndpoint: "agencyLogo" | "avatar" | "subaccountlogo",
    onChange: (url?: string)=> void,
    value?: string,
}

const FileUpload = ({apiEndpoint, onChange, value}: Props) => {
if(value){
return(
    <div>
        
    </div>
)
}
}

export default FileUpload;