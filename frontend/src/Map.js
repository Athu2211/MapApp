import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import {format} from 'timeago.js';
import './Map.css';


function Map() {
    const currentUser = 'athu'
    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId] = useState(null)
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 21.7679,
        longitude: 78.8718,
        zoom: 5
    });
    const [showPopup, setShowPopup] = useState(false);

    const handlePopup = () => {
        setShowPopup(true);
    }

    const handleMarkerClick = (id) => {
        setCurrentPlaceId(id);
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
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            {pins.map((pin) => (
                <>
                    <Marker
                        latitude={pin.latitude}
                        longitude={pin.longitude}
                        offsetLeft={-20}
                        offsetTop={-10}
                        onClick={handlePopup}
                    >
                        <Room 
                            style={{ 
                                    fontSize: viewport.zoom * 5, 
                                    color: pin.username === currentUser ? 'tomato' : 'slateblue' , 
                                    cursor: 'pointer'}}
                            onClick={() => handleMarkerClick(pin._id)}
                        />
                    </Marker>
                    {pin._id === currentPlaceId &&
                        <Popup
                            latitude={pin.latitude}
                            longitude={pin.longitude}
                            onClose={() => setCurrentPlaceId(null)}
                            anchor="bottom" >
                            <div className='card'>
                                <label>Place</label>
                                <h4 className='place'>{pin.title}</h4>
                                <label>Review</label>
                                <p className='review'>{pin.description}</p>
                                <label>Rating</label>
                                <div className='rating'>
                                    <Star className='star' /><Star className='star' /><Star className='star' /><Star className='star' /><Star className='star' />
                                </div>
                                <label>Information</label>
                                <span className='username'>Created by <b>{pin.username}</b></span>
                                <span className='date'>{format(pin.createdAt)}</span>
                            </div>
                        </Popup>
                    }
                </>
            ))}
        </ReactMapGL>
    );
}

export default Map;