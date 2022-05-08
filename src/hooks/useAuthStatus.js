import { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
    const isMounted = useRef(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isMounted) {
            const auth = getAuth();

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedIn(true);
                }
                setLoading(false);
            });
        }
        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);
    return { loggedIn, loading };
};
