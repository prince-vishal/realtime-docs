const timeSince = function (timeStamp) {
    let availableTime = new Date(timeStamp);
    let now = new Date();
    let secondsPast = (now.getTime() - availableTime.getTime()) / 1000;
    if (secondsPast < 60) {
        return parseInt(secondsPast) + ' s';
    }
    if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + ' m';
    }
    if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + ' h';
    }
    if (secondsPast > 86400) {
        let day = availableTime.getDate();
        let month = availableTime.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        let year = availableTime.getFullYear() == now.getFullYear() ? "" : " " + availableTime.getFullYear();
        return day + " " + month + " " + year;
    }
};

const makeid = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default {
    timeSince,
    makeid
};
