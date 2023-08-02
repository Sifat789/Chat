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

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        // event.preventDefault();
        // event.returnValue = 'Are you sure you want to leave?';
        handleOnline(false);
    }

    useEffect(() => {
        if (navigator.onLine) {
            handleOnline(true);
        }
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            handleOnline(false);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.id]);
    
    return null
};
