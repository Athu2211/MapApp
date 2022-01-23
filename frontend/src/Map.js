import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './Map.css';

function Map() {
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 5
    });
    const [showPopup, setShowPopup] = useState(false);

    const handlePopup = () => {
        setShowPopup(true)
    }
    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        >
            <Marker
                latitude={11.666400}
                longitude={76.629189}
                offsetLeft={-20}
                offsetTop={-10}
                onClick={handlePopup}
            >
                <Room style={{ fontSize: viewport.zoom * 5, color: 'red' }}></Room>
            </Marker>
            {showPopup && <Popup
                latitude={11.666400}
                longitude={76.629189}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
                anchor="bottom" >
                <div className='card'>
                    <label>Place</label>
                    <h4 className='place'>Bandipur</h4>
                    <label>Review</label>
                    <p className='review'>Beautiful place</p>
                    <label>Rating</label>
                    <div className='rating'>
                        <Star className='star'/><Star className='star'/><Star className='star'/><Star className='star'/><Star className='star'/>
                    </div>
                    <label>Info</label>
                    <span className='username'>Created by <b>Athu</b></span>
                    <span className='date'>1 hr ago</span>
                </div>
            </Popup>}
        </ReactMapGL>
    );
}

export default Map;