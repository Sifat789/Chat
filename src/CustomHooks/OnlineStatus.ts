import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { currentUserType } from "../Redux/CurUserSlice";

interface OnlineStatusType {
    currentUser: currentUserType
}

export const OnlineStatus: React.FC<OnlineStatusType> = ({ currentUser}) => {
    // setting online status
    const handleOnline = (value: boolean) => {
        if (currentUser.id) {
            const userRef = doc(db, 'UserInfo', currentUser.id);
            updateDoc(userRef, {
                isOnline: value,
            });
        }
    };

    function handleBeforeUnload() {
        handleOnline(false);
    }

    const handleVisibilityChange = () => {
        if(document.hidden) {
            handleOnline(false)
        } else handleOnline(true)
    }

    useEffect(() => {
        if (navigator.onLine) {
            handleOnline(true);
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleBeforeUnload);
        window.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            handleOnline(false);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleBeforeUnload);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [currentUser.id]);
    
    return null
};
