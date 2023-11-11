import { app } from "../service/firebaseConfig.jsx";
import { Navigate } from "react-router-dom";

import "firebase/firestore";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

import { createContext, useEffect, useState } from "react";

import {
    getFirestore,
    doc,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    collection,

} from "firebase/firestore";


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

const provider = new GoogleAuthProvider();

export const AuthGoogleProvider = ({ children }) => {

    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app)

    const userRef = collection(db, "users")

    const [user, setUser] = useState(null);
    const [cities, setCities] = useState(null)
    const [news, setNews] = useState(null)

    useEffect(() => {
        const storageUser = JSON.parse(localStorage.getItem("@AuthFirebase:user"))
        const storageToken = localStorage.getItem("@AuthFirebase:token");
        const storageCities = JSON.parse(localStorage.getItem("@AuthFirebase:cities"));
        const storageNews = JSON.parse(localStorage.getItem("@AuthFirebase:news"));

        if (storageToken && storageUser) {
            setUser(storageUser);

            if (!!storageCities && !!storageNews) {

                setCities(storageCities)
                setNews(storageNews)

            } else {
                console.log(!!user)
                if (!!user) {
                    console.log("ai")
                    pega(user.uid, 'cities')
                    pega(user.uid, 'news')
                } else {
                    console.log("ai")
                    pega(storageUser.uid, 'cities')
                    pega(storageUser.uid, 'news')
                }
            }
        }

    },[auth.currentUser]);

    async function checkUser(u) {
        const docSnap = await getDoc(doc(userRef, u.uid));

        if (!docSnap.exists() || u.displayName != docSnap.displayName) {

            setDoc(doc(userRef, u.uid), {
                username: u.displayName || "user",
            })
        }
    }

    async function pega(user, items) {

        if (items == 'cities') {

            const a = await getDocs(collection(userRef, user, "cities"))

            console.log("ai")
            const b = a.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

            localStorage.setItem("@AuthFirebase:cities", JSON.stringify(b));
            setCities(b)
        }

        if (items == 'news') {
            const a = await getDocs(collection(userRef, user, "news"))

            console.log("ai")
            const b = a.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

            localStorage.setItem("@AuthFirebase:news", JSON.stringify(b));
            setNews(b)
        }
    }

    const signInGoogle = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);

                const token = credential.accessToken;
                const u = result.user;

                setUser(u);
                localStorage.setItem("@AuthFirebase:user", JSON.stringify(u));
                localStorage.setItem("@AuthFirebase:token", token);

                console.log(u);

                checkUser(u)

            })
            .catch((error) => {
                //console.log(errorMessage)
            });
        return <Navigate to="/" />;
    };

    const createAccount = async (username, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const u = result.user;

                if (username != '') {
                    updateProfile(u, {
                        displayName: username,
                    })
                }

                checkUser(u)

                console.log(u);
            })
            .catch((error) => {
                const errorCode = error.code;
                // ..
                if (errorCode == "auth/invalid-email")
                    alert("POE UM EMAIL E UMA SENHA QUE EXISTE, OTARIO");

                console.log(error);
            });
    };

    const signInAccount = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                // Signed in
                const u = result.user;
                const token = u.accessToken;

                setUser(u);
                localStorage.setItem("@AuthFirebase:user", JSON.stringify(u));
                localStorage.setItem("@AuthFirebase:token", token);

                console.log(u);

                checkUser(u)

            })
            .catch((error) => {
                //console.log(errorMessage)
            });

        return <Navigate to="/" />;
    };

    function signOut() {
        document.cookie = `city=;Secure`;
        localStorage.clear();
        setUser(null);
        return <Navigate to="/" />;
    }

    const xgUser = async (nome) => {

        await updateProfile(auth.currentUser, {
            displayName: nome
        })

        localStorage.setItem("@AuthFirebase:user", JSON.stringify(auth.currentUser));

        setUser(auth.currentUser)
        checkUser(auth.currentUser)

        console.log('success')
    }

    const xgPfp = async (file) => {

        await uploadBytes(ref(storage, 'users_pfp/' + user.uid), file)
            .then((snapshot) => {
                console.log("success")
            })

        await getDownloadURL(ref(storage, 'users_pfp/' + user.uid))
            .then(async (url) => {
                await updateProfile(auth.currentUser, {
                    photoURL: url
                })
                console.log('success')
            })
            .catch((error) => {
                console.log(error)
                // Handle any errors
            });

        localStorage.setItem("@AuthFirebase:user", JSON.stringify(auth.currentUser));

        setUser(auth.currentUser)
    }

    const addCity = async (c) => {
        await setDoc(doc(userRef, user.uid, "cities", c), {
            nome: c,
        });

        pega(user.uid, "cities")

    };

    const addNews = async (n) => {
        await setDoc(doc(userRef, user.uid, "news", n.uri), {
            uri: n.uri,
            title: n.title,
            body: n.body,

            url: n.url,
            source: n.source,
            image: n.image,
        });

        pega(user.uid, "news")

    };

    const delItem = async (items, item) => {
        await deleteDoc(doc(userRef, user.uid, items, item));

        pega(user.uid, items)
    };

    //todo
    //faz is item fav pfv

    const isNewFav = (item) => {
        var x = false
        for (var it in news) {
            if (item == news[it].uri) {
                x = true
            } else {
                continue
            }
        }
        return x
    }

    const isCityFav = (item) => {
        var x = false
        for (var it in cities) {
            if (item == cities[it].nome) {
                x = true
            } else {
                continue
            }
        }
        return x
    };

    return (
        <AuthGoogleContext.Provider
            value={{
                user,
                signed: !!user,

                signInGoogle,
                createAccount,
                signInAccount,
                signOut,

                xgPfp,
                xgUser,

                cities,
                news,

                addCity,
                addNews,
                delItem,

                isCityFav,
                isNewFav
            }}
        >
            {children}
        </AuthGoogleContext.Provider>
    );
};

export const AuthGoogleContext = createContext({});
