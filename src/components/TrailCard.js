import React, { useState, useEffect } from "react";
import { Card, Modal } from "react-bootstrap";
import { TrailInfo } from './TrailInfo';
import '../css/TrailCard.scss';
import '../css/Modal.scss';

const TrailCard = (props) => {
    const [show, setShow] = useState(false);
    const [weather, setWeather] = useState({
        main: '',
        weather: [
            {
                main: '',
                description: ''
            }
        ],
        sys: {
            sunrise: -1,
            sunset: -1,
        },
        cod: -1
    });
    const [info, setInfo] = useState({
        name: '',
        address: '',
        zip: ''
    });
    const handleClose = () => setShow(false);
    const updateInfo = () => {
        // only update trail and weather info once
        if (info.name === '') {
            setInfo(TrailInfo.find((v) => v.name === props.name))
        }
        if (weather.cod !== 200 && info.zip !== '') {
            // get longitude & latitude from geolocationapi
            fetch('http://api.openweathermap.org/geo/1.0/zip?zip=' + info.zip +
                ',us&appid=' + process.env.REACT_APP_WEATHER_API_KEY
            )
                .then((response) => response.json())
                .then((json) => {
                    let lat = json.lat;
                    let lon = json.lon;
                    // get current weather from openweathermap api
                    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat +
                        '&lon=' + lon + '&appid=' + process.env.REACT_APP_WEATHER_API_KEY + '&units=imperial'
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            // only update weather when the return status code == 200
                            if (json.cod === 200) {
                                setWeather(json);
                            }
                        });
                });
        }
    }
    const handleTrailClick = () => {
        // show modal and fetch trail/weather info
        setShow(true);
        updateInfo();
    };
    useEffect(() => {
        // update weather info every 2s
        const interval = setInterval(() => {
            updateInfo();
        }, 2000);
        return () => clearInterval(interval);
    }, [info, weather])
    const difficultyInStars = (stars) => {
        return (
            <div className="rate">
                {(stars >= 1 && (<label className="checked" />)) || (<label />)}
                {(stars >= 2 && (<label className="checked" />)) || (<label />)}
                {(stars >= 3 && (<label className="checked" />)) || (<label />)}
                {(stars >= 4 && (<label className="checked" />)) || (<label />)}
                {(stars >= 5 && (<label className="checked" />)) || (<label />)}
            </div>
        )
    }
    const getWeather = (weather) => {
        return (
            <>
                <div className="weather">
                    <img id="wicon" src={"http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"} alt="Weather icon" />
                    <h4>
                        {weather.main.temp_max + "° / " + weather.main.temp_min + "°F"}
                    </h4>
                </div>
                <div>
                    {/* <FontAwesomeIcon icon="sunrise" /> */}
                    <i className="fa-solid fa-sunrise"></i>
                </div>
                <p>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US')}</p>
                <p>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US')}</p>

            </>
        )
    }
    return (
        <>
            <Card id="trailcard" style={{ padding: "32.5px", float: "left", cursor: "pointer" }} onClick={handleTrailClick} >
                <Card.Img variant="top" src={props.img} height="180" width="240" />
                <Card.Body>
                    <Card.Title>
                        <div id="hikingClothesContainer">
                            <h3><center>{props.name}</center></h3>
                        </div></Card.Title>
                    <Card.Text>
                        {props.text}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <tr>
                        <td>Trail Difficulty:</td>
                        <td>{difficultyInStars(info.difficulty)}
                        </td>
                        <td>{getWeather(weather)}</td>
                        <br />
                    </tr>
                    <div>
                        <img alt="Trailhead" src={info.largeImgURL} key={info.id} width="300" height="200" />
                    </div>
                    <br />
                    <iframe
                        width="450"
                        height="250"
                        frameBorder="0"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={"https://www.google.com/maps/embed/v1/place?key=" + process.env.REACT_APP_MAP_API_KEY + "&q=" + info.address + "," + info.city}
                    >
                    </iframe>
                    <br />
                </Modal.Body>
            </Modal>
        </>
    );
}

export { TrailCard };