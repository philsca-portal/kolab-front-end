import { Button } from "../ui/button"
import { Modal } from "./modal";
import { useEffect, useState } from "react";

interface AlertModalProps{
    isopen: boolean;
    onclose: () => void;
    ondelete: () => void;
    loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isopen,
    onclose,
    ondelete,
    loading
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }

    return(
        <Modal title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently remove your data from our servers."
                isOpen={isopen}
                onClose={onclose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant={'outline'} onClick={onclose}>
                    Close
                </Button>
                <Button disabled={loading} variant={'destructive'} onClick={ondelete}>
                    Delete
                </Button>
            </div>
        </Modal>
    )
}

export default AlertModal