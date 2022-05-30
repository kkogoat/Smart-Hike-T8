import React, { useEffect, useState } from "react";
import { TrailInfo } from './TrailInfo';
import { TrailCard } from "./TrailCard";
import '../css/CityCSS.scss';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase-config";
import { ReactComponent as Heart } from "../assets/favorite_FILL1_wght400_GRAD0_opsz48.svg";
import { useUserAuth } from "../context/UserAuthContext";

const City = () => {
    const [favorites, setFavorites] = useState([]);
    const [ratings, setRatings] = useState([]);
    const { user } = useUserAuth();
    useEffect(() => {
        const getFavorites = async () => {
            if (user.email) {
                const favoriteDoc = doc(db, "user-favorites", user.uid);
                const fdoc = await getDoc(favoriteDoc);
                setFavorites(fdoc.data().favorites);
            }
        }
        getFavorites();
    }, [user])

    // ADD FAVORITE TRAIL
    const addUserFavorites = async (trailID) => {
        const userDocRef = doc(db, "user-favorites", user.uid);
        setDoc(userDocRef, { foo: 'bar' }, { merge: true });
        await updateDoc(userDocRef, {
            favorites: arrayUnion(trailID)
        });
    }

    // REMOVE FAVORITE TRAIL
    const removeFavorite = async (trailID) => {
        const userDocRef = doc(db, "user-favorites", user.uid);
        await updateDoc(userDocRef, {
            favorites: arrayRemove(trailID)
        });
    }

    const changeFavorite = async (trailID) => {
        const element = document.getElementById(trailID + "-city-heart")
        const color = element.getAttribute('fill')
        if (color === "red") {
            // console.log("remove favorite")
            removeFavorite(trailID)
            element.setAttribute("fill", "grey")
            element.style.fill = "grey"
        } else if (color === "grey") {
            // console.log("add favorite")
            addUserFavorites(trailID)
            element.setAttribute("fill", "red")
            element.style.fill = "red"
        }
    }

    return (
        <div id="city-page">
            <div id="city-header">
                Explore the Trail by City
            </div>
            <div id="city-content">
                <div className="city-name">
                    Albuquerque
                </div>
                <div className="trail-row">
                    {
                        TrailInfo.filter((trail) => (trail.city === "Albuquerque")).slice(0, 10).map((trail) => (
                            <div className="city-trail" key={trail.id} >
                                <TrailCard name={trail.name} img={trail.thumbURL} />
                                <div className="city-heart">
                                    <Heart
                                        id={trail.id + "-heart"}
                                        fill={favorites.includes(trail.id) ? "red" : "grey"}
                                        onClick={() => changeFavorite(trail.id)}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="city-name">
                    Las Cruces
                </div>
                <div className="trail-row">
                    {
                        TrailInfo.filter((trail) => (trail.city === "Las Cruces")).slice(0, 10).map((trail) => (
                            <div className="city-trail" key={trail.id} >
                                <TrailCard name={trail.name} img={trail.thumbURL} />
                                <div className="city-heart">
                                    <Heart
                                        id={trail.id + "-city-heart"}
                                        fill={favorites.includes(trail.id) ? "red" : "grey"}
                                        onClick={() => changeFavorite(trail.id)}
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="city-name">
                    Lincoln County
                </div>
                <div className="trail-row">
                    {
                        TrailInfo.filter((trail) => (trail.city === "Lincoln County")).slice(0, 10).map((trail) => (
                            <div className="city-trail" key={trail.id} >
                                <TrailCard name={trail.name} img={trail.thumbURL} />
                                <div className="city-heart">
                                    <Heart
                                        id={trail.id + "-city-heart"}
                                        fill={favorites.includes(trail.id) ? "red" : "grey"}
                                        onClick={() => changeFavorite(trail.id)}
                                    />
                                </div>
                            </div>
                        ))

                    }
                </div>
            </div>
        </div>
    );

}
export default City;