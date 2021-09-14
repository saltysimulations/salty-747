class HoppieApi {

	/* SEND */
	static sendLogon(ats, fltNo) {
		return fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=type=cpdlc&packet=/data2/25//Y/REQUEST%20LOGON.`)
            .then((response) => {
                if (!response.ok) {
                    throw (response);
                }

                return response.json()
                    .then((data) => {
                        return data;
                });
            });
	}
	static sendLogoff() {
		fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=type=cpdlc&packet=/data2/49//N/LOGOFF`)
            .then((response) => {
                if (!response.ok) {
                    throw (response);
                }

                return response.json()
                    .then((data) => {
                        return data;
                });
        });
	}
	static sendRequest(request) {
		fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=type=cpdlc&packet=${request}`)
            .then((response) => {
                if (!response.ok) {
                    throw (response);
                }

                return response.json()
                    .then((data) => {
                        return data;
                });
        });
	}

	/* RECEIVE */
	static receiveLogon() {
		return `${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=type=cpdlc&packet=/data2/38/52/NE/LOGON%20ACCEPTED`
	}
	static receiveRequest() {
		/*			
			/data2/39//NE/STANDBY
		*/
		return `${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=type=cpdlc&packet=/data2/38/52/NE/LOGON%20ACCEPTED`
	}
	static receivePoll() {
	    fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=poll`)
	    	.then(function (response) {
				return response.text();
			})
			.then(function (html) {
				return html;
			}).catch(function (err) {
				console.warn('Something went wrong.', err);
		});
	}	
	static receivePeek() {
	    fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=peek`)
	    	.then(function (response) {
				return response.text();
			})
			.then(function (html) {
				return html;
			}).catch(function (err) {
				console.warn('Something went wrong.', err);
		});
	}
}
HoppieApi.url = "http://www.hoppie.nl/acars/system/connect.html";
HoppieApi.logon = "ddJdEtsq3s2v97";