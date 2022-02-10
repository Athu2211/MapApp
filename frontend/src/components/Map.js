import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import { format } from 'timeago.js';
import './Map.css';
import Register from './Register';
import Login from './Login';


function Map() {
    const myStorage = window.localStorage;
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [rating, setRating] = useState(0);
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [viewport, setViewport] = useState({
        latitude: 21.7679,
        longitude: 78.8718,
        zoom: 4,
    });
    const [settings, setsettings] = useState({
        scrollZoom: false,
        touchZoom: false,
        touchRotate: false,
        keyboard: false,
        doubleClickZoom: false
    });

    const handleMarkerClick = (id, latitude, longitude) => {
        setCurrentPlaceId(id);
        //to center the selected place
        setViewport({ ...viewport, latitude: latitude, longitude: longitude })
    }

    const handleAddNewPlace = (e) => {
        const [longitude, latitude] = e.lngLat;
        setNewPlace({
            latitude,
            longitude
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            description,
            rating,
            latitude: newPlace.latitude,
            longitude: newPlace.longitude
        }

        console.log(newPin)
        try {
            const res = await axios.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null);

    }

    const handleShowLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    }

    const handleShowRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    }

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, [])

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <ReactMapGL
                {...viewport}
                {...settings}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={(viewport) => setViewport(viewport)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onDblClick={handleAddNewPlace}
                transitionDuration="100"
                width="100%"
                height="100%"
            >
                {pins.map((pin) => (
                    <>
                        <Marker
                            latitude={pin.latitude}
                            longitude={pin.longitude}
                            offsetLeft={-viewport.zoom * 3.5}
                            offsetTop={-viewport.zoom * 7}
                        >
                            <Room
                                style={{
                                    fontSize: viewport.zoom * 7,
                                    color: pin.username === currentUser ? 'tomato' : 'slateblue',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleMarkerClick(pin._id, pin.latitude, pin.longitude)}
                            />
                        </Marker>
                        {pin._id === currentPlaceId &&
                            <Popup
                                latitude={pin.latitude}
                                longitude={pin.longitude}
                                onClose={() => setCurrentPlaceId(null)}
                                anchor="bottom" >
                                <div className='card'>
                                    <label>Title</label>
                                    <h4 className='place'>{pin.title}</h4>
                                    <label>Review</label>
                                    <p className='review'>{pin.description}</p>
                                    <label>Rating</label>
                                    <div className='rating'>
                                        {Array(pin.rating).fill(<Star className='star' />)}
                                    </div>
                                    <label>Information</label>
                                    <span className='username'>Created by <b>{pin.username}</b></span>
                                    <span className='date'>{format(pin.createdAt)}</span>
                                </div>
                            </Popup>
                        }
                    </>
                ))}
                {newPlace && (
                    <Popup
                        latitude={newPlace.latitude}
                        longitude={newPlace.longitude}
                        onClose={() => setNewPlace(null)}
                        anchor="bottom"
                    >
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>Title</label>
                                <input
                                    placeholder='Enter a title'
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <label>Review</label>
                                <textarea
                                    placeholder='Say something about this place'
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <label>Rating</label>
                                <select onChange={(e) => setRating(e.target.value)}>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                                <button className='add-button' type='submit'>Add Pin</button>
                            </form>
                        </div>
                    </Popup>
                )}
                {currentUser ?
                    (<button className='button logout' onClick={handleLogout}>LogOut</button>) :
                    (
                        <div className="buttons">
                            <button className='button login' onClick={handleShowLogin}>LogIn</button>
                            <button className='button register' onClick={handleShowRegister}>Register</button>
                        </div>
                    )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

            </ReactMapGL>
        </div>
    );
}

export default Map;