
interface TeamIconUploadProps{
    handleFileChange: (event: any) => void
}

const TeamIconUpload: React.FC<TeamIconUploadProps> = ({
    handleFileChange
}) => {
    return(
        <>
            <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </>
    )
}

export default TeamIconUpload;