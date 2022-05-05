import React, { useState } from "react";
import { PhotoAlbum } from "react-photo-album";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import photos from "../photos";
import { TrailCard } from './TrailCard';
import '../css/HomeCSS.scss';

// matching data with preference form
const searchData = Object.freeze({
    city: '',
    zipcode: '',
    name: ''
});

const Home = () => {
    const[sData, updateSearchData] = React.useState(searchData);
    const history = useNavigate();
    const { user } = useUserAuth();

    // Handling change in text fields
    const handleChange = (e) => {
        updateSearchData({
            ...sData,
            [e.target.name]: e.target.value.trim()
        });
    };


    // Sending input text to /preference page
    const handleSubmit = (e) => {
        if(user) {
            e.preventDefault()
            // console.log(sData);
            history("/preference", {state:{data: sData}});
        } else {
            history("/login");
        }
    };

    return (
        <div id="homepage">
            <PhotoAlbum layout="columns" photos={photos} />
            <div id="main-container">
                <div id="search-box-container">
                    <div id="search-box-banner">
                        <h1> Welcome {user ? user.email : ""}</h1>
                            Start your adventure!
                    </div>
                    <div id="search-box">
                        <div className="form-horizontal">
                            <input type="text" name="name" onChange={ handleChange } placeholder="Name" required />
                        </div>
                        <div className="form-horizontal">
                            <input type="text" name="city" onChange={ handleChange } placeholder="City" required />
                        </div>
                        <div className="form-horizontal">
                            <input type="text" name="zipcode" onChange={ handleChange } placeholder="Zipcode" required />
                        </div>
                        <button onClick={ handleSubmit }>
                            search
                        </button>
                    </div>
                </div>
                <div id="favorite-trails-container">
                    <TrailCard name="Tingley Field" img="https://prescriptiontrails.org/admin/new/images/square_1455036748P1130010.jpg" />
                    <TrailCard name="Tingley Beach" img="https://prescriptiontrails.org/admin/new/images/1450551300tingly.jpg" />
                    <TrailCard name="Tiguex Park" img="https://prescriptiontrails.org/admin/new/images/1450551924tiguex.jpg" />
                    <TrailCard name="Durand Open Space" img="https://prescriptiontrails.org/admin/new/images/1454876314Durand.jpg" />
                    <TrailCard name="Gutierrez-Hubbell Open Space" img="https://prescriptiontrails.org/admin/new/images/1450749670CIMG6601.JPG" />
                    <TrailCard name="Pajarito Open Space" img="https://prescriptiontrails.org/admin/new/images/1451166297Pajarito.jpg" />                
                </div>
            </div>
        </div>
    )
}

export default Home;

