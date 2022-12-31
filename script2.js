const API_URLs = {
    GET_IP_API_URL: "https://api.ipify.org?format=json",
    GET_IP_BASE_URL: "https://ipinfo.io/",
    GOOGLE_MAPS_BASE_URL: "https://maps.google.com/maps?q=",
    GET_POST_OFFICE_API_URL: "https://api.postalpincode.in/pincode/",
};

const ELEMENT_IDs = {
    _LAT: "lat",
    _LNG: "Long",
    _CITY: "City",
    _REGION: "Region",
    _ORGANISATION: "Organisation",
    _HOSTNAME: "hostname",
    _TIMEZONE: "Timezone",
    _DATE_TIME: "Date And Time",
    _PINCODE: "Pincode",
    _MSG: "Message",
    _MAP_CONTAINER: "map-container",
    _SEARCH: "_filter",
};
let post = undefined

function getIpAddress() {
    $.getJSON(API_URLs.GET_IP_API_URL, function(data) {
        $("#ip-address").html(data.ip);
        const userIp = data.ip;

        async function getLocationDataByIp(Ip) {
            try {
                const url = `${API_URLs.GET_IP_BASE_URL}${Ip}/geo`;
                const result = await fetch(url);
                output = await result.json();

                renderLocationDetails();
                renderLocationOnMapIframe();
                getPostOffices();
            } catch (err) {
                console.log(err);
            }
        }

        async function getPostOffices() {
            try {
                const target = await fetch(
                    `${API_URLs.GET_POST_OFFICE_API_URL}${output.postal}`
                );
                const responce = await target.json();
                const product = responce[0];
                post = product.PostOffice;
                const msg = document.getElementById(ELEMENT_IDs._MSG);

                msg.innerText = product.Message;
                let postData = " ";
                post.map((item) => {
                    postData += renderPostOfficeList(item)
                });

                document.getElementById("post-info-list-item").innerHTML = postData;
            } catch (error) {
                console.log(error);
            }
        }

        getLocationDataByIp(userIp);
    });
}

getIpAddress();


function renderLocationDetails() {
    const City = document.getElementById(ELEMENT_IDs._CITY);
    const region = document.getElementById(ELEMENT_IDs._REGION);
    const org = document.getElementById(ELEMENT_IDs._ORGANISATION);
    const host = document.getElementById(ELEMENT_IDs._HOSTNAME);
    const timezone = document.getElementById(ELEMENT_IDs._TIMEZONE);
    const DateAndTime = document.getElementById(ELEMENT_IDs._DATE_TIME);
    const pincode = document.getElementById(ELEMENT_IDs._PINCODE);

    City.innerHTML = output.city;
    region.innerHTML = output.region;
    org.innerHTML = output.org;
    host.innerText = output.ip;
    timezone.innerHTML = output.timezone;
    pincode.innerText = output.postal;
    let timeanddate = new Date().toLocaleString({
        timeZone: `${output.timezone}`,
    });
    DateAndTime.innerText = timeanddate;
}

function renderLocationOnMapIframe() {
    const lat = document.getElementById(ELEMENT_IDs._LAT);
    const long = document.getElementById(ELEMENT_IDs._LNG);

    const location = output.loc;
    const latLong = location.split(",", 2);
    lat.innerText = latLong[0];
    long.innerText = latLong[1];

    let link = `${API_URLs.GOOGLE_MAPS_BASE_URL}${latLong[0]},${latLong[1]} &output=embed`;
    const iframe = document.createElement("iframe");
    iframe.src = link;
    const map = document.getElementById(ELEMENT_IDs._MAP_CONTAINER);
    map.appendChild(iframe);
}


function renderPostOfficeList(item) {
    return `<ul style="height:399px ; width: 678px; border: 3px solid #000000;
    border-radius: 10px;">
    <li>Name: <span id="name">${item.Name}</span></li>
    <li>Branch Type: <span id="Branch Type"> ${item.BranchType}</span></li>
    <li>Delivery Status: <span id="Delivery Status"> ${item.DeliveryStatus}</span></li>
    <li>District: <span id="District"> ${item.District}</span></li>
    <li>Division: <span id=Division"> ${item.Division}</span></li>
</ul>
<br><br> `;
}

function search() {
    var searchText = document.getElementById(ELEMENT_IDs._SEARCH);
    console.log(searchText.value)
    let postData = " ";
    document.getElementById("post-info-list-item").innerHTML = postData;

    post.map((item) => {
        if (item.Name.toLowerCase().includes(searchText.value.toLowerCase().trim()))
            postData += renderPostOfficeList(item)
    });

    document.getElementById("post-info-list-item").innerHTML = postData;
}