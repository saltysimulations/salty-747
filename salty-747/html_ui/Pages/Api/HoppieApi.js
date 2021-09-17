class HoppieApi {
	constructor() {
	 	this.messageId = 1;
	}

	/* increase message id */
	incMsgId() {
		this.messageId = this.messageId+1;
	}
	
	/* SEND */
	static sendLogon(ats, fltNo) {
		console.log(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/${this.messageId}//Y/REQUEST%20LOGON`);
		return fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/${this.messageId}//Y/REQUEST%20LOGON`)				
            .then((response) => {
				console.log(response);
                if (!response.ok) {
                    throw (response);
                }

                return response.json()
                    .then((data) => {
						incMsgId()
                        return data;
                });
            });
	}
	static sendLogoff() {
		fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/${this.messageId}//N/LOGOFF`)
            .then((response) => {
                if (!response.ok) {
                    throw (response);
                }

                return response.json()
                    .then((data) => {
						incMsgId()
                        return data;
                });
        });
	}
	static sendRequest(ats, fltNo, request) {
		fetch(`${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=${request}`)
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
		return `${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/2/2/NE/LOGON%20ACCEPTED`
	}
	static receiveRequest() {
		/*			
			/data2/39//NE/STANDBY
		*/
		return `${HoppieApi.url}?logon=${HoppieApi.logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/2/2/NE/LOGON%20ACCEPTED`
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
HoppieApi.logon = "88QGz22eZ6eW4";