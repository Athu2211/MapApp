import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import {format} from 'timeago.js';
import './Map.css';


function Map() {
    const [pins, setPins] = useState([])
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

    console.log(pins)

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
                        <Room style={{ fontSize: viewport.zoom * 5, color: 'red' }}></Room>
                    </Marker>
                    {showPopup &&
                        <Popup
                            latitude={pin.latitude}
                            longitude={pin.longitude}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => setShowPopup(false)}
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
                                <label>Info</label>
                                <span className='username'>Created by <b>{pin.user}</b></span>
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