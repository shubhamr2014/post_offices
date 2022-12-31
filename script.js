const API_URLs = {
    GET_IP_API_URL: "https://api.ipify.org?format=json",
};

function getIp() {
    $.getJSON(API_URLs.GET_IP_API_URL, function(data) {
        $("#ip-address").html(data.ip);
        const userIp = data.ip
        console.log(userIp)

    })
}
getIp();