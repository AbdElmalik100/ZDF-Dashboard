import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDispatch, useSelector } from 'react-redux'
import { RefreshCw, Trash2 } from 'lucide-react'
import { deleteAttendance } from '@/store/slices/attendancesSlice'
import { deleteEvent } from '@/store/slices/eventsSlice'
import { deleteWorkshop } from '@/store/slices/workshopsSlice'
import { deleteBundle } from '@/store/slices/bundlesSlice'
import { deleteTheatre } from '@/store/slices/theatreSlice'

function DeleteService({ service, type }) {
    const dispatch = useDispatch()
    const { loading: eventLoading } = useSelector(state => state.events)
    const { loading: workshopLoading } = useSelector(state => state.workshops)
    const { loading: bundleLoading } = useSelector(state => state.bundles)
    const { loading: theatreLoading } = useSelector(state => state.theatres)
    const { loading: attendanceLoading } = useSelector(state => state.attendances)

    const handleDelete = () => {
        switch (type) {
            case "event":
                dispatch(deleteEvent(service._id))
                break;
            case "workshop":
                dispatch(deleteWorkshop(service._id))
                break;
            case "bundle":
                dispatch(deleteBundle(service._id))
                break;
            case "theatre":
                dispatch(deleteTheatre(service._id))
                break;
            case "attendance":
                dispatch(deleteAttendance(service._id))
                break;
            default:
                break;
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className='flex items-center gap-2 transition-all ease-in-out hover:bg-rose-100 hover:text-rose-600 text-rose-600 p-1 px-2 rounded'>
                    <Trash2 size={18} />
                    Delete
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete this {type}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {type} you selected and remove it's data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-rose-500 hover:bg-rose-400" disabled={type === 'event' ? eventLoading : type === 'workshop' ? workshopLoading : type === 'bundle' ? bundleLoading : type === 'theatre' ? theatreLoading : attendanceLoading}>
                        {
                            (type === 'event' ? eventLoading : type === 'workshop' ? workshopLoading : type === 'bundle' ? bundleLoading : type === 'theatre' ? theatreLoading : attendanceLoading)
                                ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Deleting...
                                </>
                                :
                                "Confirm"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteService