import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, Hits } from "react-instantsearch-hooks-web";
import { TrailCard } from "./TrailCard";
import SearchBoxBasic from "./SearchBoxBasic";
import { ReactComponent as Heart } from "../assets/favorite_FILL1_wght400_GRAD0_opsz48.svg";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase-config";
import { useUserAuth } from "../context/UserAuthContext";
import '../css/PreferenceCSS.scss';

const PreferenceForm = () => {
    const history = useLocation();
    const [historyFlag, updateHistoryFlag] = useState([]);
    const [initVal, updateInitVal] = useState('')
    const [favorites, setFavorites] = useState([]);
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

    useEffect(() => {
        // Handle search from homepage
        if (history.state && historyFlag !== 'done') {
            updateInitVal(
                Object.values(history.state.data).find(v => v.length > 0)
            )
            updateHistoryFlag('done')
        }
    }, [historyFlag], [history], [])

    const conditionalQuery = {
        search(query) {
            // Prevent requesting a search when the string is empty
            if (
                query.every(({ params }) => !params.query) ||
                query.every(({ params }) => params.query === ' ')
            ) {
                // console.log("empty query")
                return Promise.resolve({
                    results: query.map(() => ({
                        hits: [],
                        nbHits: 0,
                        nbPages: 0,
                        processingTimeMS: 0,
                    })),
                })
            } else {
                const searchClient = algoliasearch(
                    process.env.REACT_APP_SEARCH_APP_ID,
                    process.env.REACT_APP_SEARCH_API_KEY
                )
                return searchClient.search(query)
            }
        }
    }

    const addUserFavorites = async (trailID) => {
        if (user) {
            const userDocRef = doc(db, "user-favorites", user.uid);
            setDoc(userDocRef, { foo: 'bar' }, { merge: true });
            await updateDoc(userDocRef, {
                favorites: arrayUnion(trailID)
            });
            // setFavorites([...favorites, trailID]);
            // directly update favorites to avoid re-rendering
            favorites.push(trailID)
        } else {
            history("/login");
        }
    }

    const removeFavorite = async (trailID) => {
        if (user) {
            const userDocRef = doc(db, "user-favorites", user.uid);
            await updateDoc(userDocRef, {
                favorites: arrayRemove(trailID)
            });
        } else {
            history("/login");
        }
    }

    const changeFavorite = async (trailID) => {
        // Get the favorite status of the element
        const element = document.getElementById(trailID + "-heart")
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

    function Handle({ hit }) {
        // Return the corresponding trailcard for each hit in the search results
        return (
            <div>
                <TrailCard name={hit.name} img={hit.thumbURL} />
                <Heart
                    id={hit.id + "-heart"}
                    fill={favorites.includes(hit.id) ? "red" : "grey"}
                    onClick={() => changeFavorite(hit.id)}
                />
            </div>
        );
    }

    return (
        <div>
            <InstantSearch
                indexName="smarthike"
                searchClient={conditionalQuery}
            >
                <SearchBoxBasic initText={initVal} />
                <Hits hitComponent={Handle} />
            </InstantSearch>
        </div>
    )
}
export default PreferenceForm;