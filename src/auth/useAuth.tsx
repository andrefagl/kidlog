import {
    useEffect,
    useState,
    useContext,
    createContext,
    FunctionComponent,
} from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import initFirebase from "./initFirebase";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies";

initFirebase();

interface IAuthContext {
    user: firebase.User | null;
    logout: () => void;
    authenticated: boolean;
}


const AuthContext = createContext<IAuthContext>({
    user: null,
    logout: () => null,
    authenticated: false,
});

export const AuthProvider: FunctionComponent = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const router = useRouter();
    useEffect(() => {
        const cancelAuthListener = firebase.auth().onIdTokenChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                setTokenCookie(token);
                setUser(user);
            } else {
                removeTokenCookie();
                setUser(null);
            }
        })
        return () => {
            cancelAuthListener();
        };
    }, []);

    const logout = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error(error);
        }

        router.push("/");
    }


    return (
        <AuthContext.Provider value={{ user, authenticated: !!user, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}