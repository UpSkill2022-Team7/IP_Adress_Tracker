// Making call the HTML file by using querySelector and selecting them by their class name 

const UI = document.querySelector('.ip_address');
const locationinfo = document.querySelector('.location_value');
const timeZone = document.querySelector('.time_zone_value');
const isp = document.querySelector('.isp_value');
const ipInput = document.querySelector('.ip_input');
const searchButton = document.querySelector('.search_button');
const map = document.querySelector('#map');
const vh = Math.max(document.documentElement.clientHeight)

// Initializing our ip key from ipgeolocation // 
const API_KEY = 'f62c08003cb646dcb698199c8a40cc6f';
const url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=f62c08003cb646dcb698199c8a40cc6f';
const url2 = 'https://ipgeolocation.abstractapi.com/v1/?api_key='
const urlForOwnip = 'https://api.db-ip.com/v2/free/self';

// below is a regular expression ( regex )

const validIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

let lattitude = 0;
let longitude = 0;

// what it does is to minus the actual height of devices by 225px  and and gives it anything that remains  
map.style.height = `${vh - 225}px`;

// Updating my app using your device ip address once the website is open//

fetch(url)
    .then(res => res.json())
    .then(res => {
        updateInfoSection(res);
        mymap.panTo(new L.LatLng(res.latitude, res.longitude));
        marker.setLatLng([res.latitude, res.longitude]).update();
    })
    .catch(err => {
        const Err = new Error(err);
    });

// Making call to my search button //
searchButton.addEventListener('click', () => {
    fetchIPAndUpdateUI(ipInput.value)
})

/**
 * calls the iplocation endpoint and updates the ui
 * @param {String} ipAddress the users ip address
 */
const fetchIPAndUpdateUI = (ipAddress) => {
    if (validIP.test(ipAddress)) {
        ipInput.value = '';
        ipInput.placeholder = 'Loading...';
        infoSectionLoading();
        fetch(url2 + API_KEY + '&ip_address=' + ipAddress)
            .then(res => res.json())
            .then(res => {
                updateInfoSection(res);
                mymap.panTo(new L.LatLng(res.latitude, res.longitude));
                marker.setLatLng([res.latitude, res.longitude]).update();
            })

        // catching error when and Invalid Ip Address is entered or when no ip Address is enter and the search button is clicked 
        .catch((res) => {
            err = new Error(res)
            const message = err.message.split(':');
            ipInput.placeholder = message[1]
        });
    } else if (ipInput.value == '') {
        ipInput.placeholder = 'Please enter an IP Address...';
    } else {
        ipInput.value = '';
        ipInput.placeholder = 'Invalid ip address...';
    }

}

/**
 * 
 * @param {Object} res 
 */
const updateInfoSection = (res) => {
    locationinfo.innerHTML = (res.city === null ? ' - ' : res.city) + ', ' + res.country;
    UI.innerHTML = res.ip_address;
    const fullTime = res.timezone.current_time.split(':');
    const time = fullTime[0] + ':' + fullTime[1];
    timeZone.innerHTML = res.timezone.abbreviation + ' - ' + time;
    isp.innerHTML = res.connection.isp_name;
    ipInput.placeholder = 'Search for any IP address or domain';
}

/**
 *  for loading once and ip address is entered //
 */
const infoSectionLoading = () => {
    locationinfo.innerHTML = '-';
    UI.innerHTML = '-';
    timeZone.innerHTML = '-';
    isp.innerHTML = '-'
}

// Map Setup From //
var mymap = L.map('map').setView([lattitude, longitude], 13);
var marker = L.marker([lattitude, longitude]).addTo(mymap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

visualViewport.addEventListener('resize', function() {
    const vh = Math.max(document.documentElement.clientHeight)
    map.style.height = `${vh-225}px`;
});

/**
 * Allowing User to Make use of enter button or key to search ip address
 */
document.addEventListener('keydown', (e) => {
    console.log('event', e);
    if (e.keyCode == 13 || e.key == "Enter" || e.code == "Enter") {
        searchButton.click();
    };
})