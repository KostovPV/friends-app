
import React, { useEffect, useState } from 'react';
import "./Contacts.css"
const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const friendsLocation = { lat: 42.525899, lng: 27.454538 };
  const GOOGLE_MAP = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log(GOOGLE_MAP);
  

  useEffect(() => {

    const initializeMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: friendsLocation,
        zoom: 15,
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Your Location',
          });

          calculateAndDisplayRoute(userLocation);
        },
        (error) => {
          console.error('Error getting user location:', error);

          const fallbackLocation = { lat: 42.525899, lng: 27.454538 };
          calculateAndDisplayRoute(fallbackLocation);
        }
      );

      const calculateAndDisplayRoute = (userLocation) => {
        const request = {
          origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
          destination: new window.google.maps.LatLng(friendsLocation.lat, friendsLocation.lng),
          travelMode: 'DRIVING',
        };

        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Error calculating route:', status);
          }
        });
      };
    };


    const loadScript = () => {
      const script = document.createElement('script');

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP}`;

      script.async = true;
      document.head.appendChild(script);

      script.onerror = () => {
        setLoading(false);
        console.error('Error loading Google Maps API.');
      };
    };


    window.initMap = initializeMap;


    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      loadScript();
    }

    return () => {
      delete window.initMap;
    };
  }, []);

  return (
    <div className='contacts-container'>

      <div id="map" style={{ height: '80vh', width: '100%' }} />
      <div className='contact-info'>

        <div className='town'>
          Бургас
        </div>
        <div>   <strong>жк. Изгрев</strong>,  Блок 3</div>

        <div>
          <strong>Телефон:</strong> +359-888-800-000
        </div>
        <div>
          <strong>email:</strong> partycenterfriends@gmail.com
        </div>
      </div>





    </div>
  );
};

export default Contacts;