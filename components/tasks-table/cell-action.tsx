import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Task } from "./columns";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import AlertModal from "./alert-modal";
import { useRouter } from "next/navigation";
import EditModal from "./edit-modal";

interface CellActionProps{
    data: Task;
    setOpenTable: Dispatch<SetStateAction<boolean>>;
}

const CellAction: React.FC<CellActionProps> = ({
    data,
    setOpenTable
}) => {

    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onDelete = async () => {
        try {
            setLoading(true);
            const dataId = data.id
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteMeeting`, {
                dataId 
            });

            if(response.data.success){
                router.refresh();
                setOpenTable(false);
                toast.success("Row deleted.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally{
            setLoading(false);
            setOpen(false);
        }
    }

    return(
        <>
            <AlertModal isopen={open}
                        onclose={() => setOpen(false)}
                        ondelete={onDelete}
                        loading={loading} />
            <EditModal  data={data}
                        isopen={openEdit}
                        onclose={() => setOpenEdit(false)}
                        loading={loading}
                        setLoading={setLoading}
                        setOpenTable={setOpenTable} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
      </>
    )
}

export default CellAction;