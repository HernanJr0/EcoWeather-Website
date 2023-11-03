import React from 'react'
import { app } from "../../../service/firebaseConfig.jsx";
import { AuthGoogleContext } from "../../../contexts/authGoogle";
import {
    collection,
    getFirestore,
    getDocs,
} from "firebase/firestore";

import { useState, useEffect, useContext } from 'react';

function TopButtons({ setQuery }) {

    /* const cities = [
        {
            id: 1,
            title: 'Nova York'
        },
        {
            id: 2,
            title: 'Tokyo'
        },
        {
            id: 3,
            title: 'Brasília'
        },
        {
            id: 4,
            title: 'Paris'
        }
    ] */

    const db = getFirestore(app);
    const { user } = useContext(AuthGoogleContext);

    const citiesCollectionRef = collection(db, "users", user.uid, "cities");


    const [cities, setCities] = useState([])

    useEffect(() => {
        const getCities = async () => {
            const data = await getDocs(citiesCollectionRef);
            setCities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            console.log("kk")
        };
        getCities();
    }, []);

    return (
        <div className='flex items-center justify-around my-6'>
            {cities.map((city, i) => (
                <button
                    key={i}
                    className='text-white text-lg font-medium'
                    onClick={() => setQuery({ q: city.nome })}>{city.nome}
                </button>
            ))}
        </div>
    )
}

export default TopButtons