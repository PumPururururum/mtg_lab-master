class Mtg {

    constructor(baseUrl = "https://api.magicthegathering.io/v1/") {
        this.baseUrl = baseUrl;
    }

    loadCards(){
        const url = 'https://api.magicthegathering.io/v1/cards?pageSize=100';

    return fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.log(data.cards); 
           return data.cards;
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }
    searchCardsByName(name) {
        const url = `${this.baseUrl}cards?name=${encodeURIComponent(name)}&pageSize=100`;

        return fetch(url)
            .then(response => response.json())
            .then(data => data.cards)
            .catch(error => {
                console.error('Произошла ошибка:', error);
            });
    }
}


export {Mtg}
