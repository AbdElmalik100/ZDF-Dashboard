import React from 'react'
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDispatch, useSelector } from 'react-redux'
import { RefreshCw } from 'lucide-react'
import { deleteTheatre } from '@/store/slices/theatreSlice'

function DeleteTheatre({ theatre }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.theatres)

    const handleDeleteTheatre = () => {
        dispatch(deleteTheatre(theatre._id))
    }
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure you want to delete this theatre?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the event you selected and remove it's data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTheatre} className="bg-rose-500 hover:bg-rose-400" disabled={loading}>
                    {
                        loading
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
    )
}

export default DeleteTheatre