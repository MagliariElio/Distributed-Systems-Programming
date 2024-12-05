
class WSMessage {
    constructor(type, userId, userName, filmId, filmTitle) {
        this.typeMessage = type;
        this.userId = parseInt(userId);
        if (userName) this.userName = userName;
        if (filmId) this.filmId = parseInt(filmId);
        if (filmTitle) this.filmTitle = filmTitle;
    }
};

module.exports = WSMessage;