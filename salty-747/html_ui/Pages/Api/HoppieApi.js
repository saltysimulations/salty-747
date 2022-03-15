class HoppieApi {
	constructor() {
	 	this.messageId = 1;
		/*/ CHANGE TO 0 ONCE TESTED */
		this.isTestServer = true;
		this.server = "http://localhost:5000/acars/system/connect.html?";
	}

	Init() {
		this.isTestServer = true;
		console.log(this.isTestServer);
		/*if (!this.isTestServer) {
			let logon = SaltyDataStore.get("OPTIONS_HOPPIE_ID", "");
			this.url = HoppieApi.url+"?logon="+logon;
		} else {*/
			this.server = "http://localhost:5000/acars/system/connect.html?";
		/*}*/
	}

	/* increase message id */
	incMsgId() {
		this.messageId = this.messageId+1;
	}

	/* Response Expected 
		"R" Expects "ROGER"
		"WU" Expects "WILCO"/"UNABLE"
		"AN" Expects "AFFIRM"/"NEGATIVE"
		"NE" Self-closing (Not-Enabled)
		"Y" Expects Controller Response
		"N" Self-closing (No response expected)
	*/

	/* SEND */
	static sendLogon(ats, fltNo) {
		return fetch(`${this.server}logon=${logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/${this.messageId}//Y/REQUEST%20LOGON`)				
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
		fetch(`${this.server}logon=${logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=/data2/${this.messageId}//N/LOGOFF`)
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
		fetch(`${this.server}logon=${logon}&from=${fltNo}&to=${ats}&type=cpdlc&packet=${request}`)
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
	static sendTelex(ats, fltNo, msg, logon) {console.log( 'Sending data' );
		fetch(`${this.server}logon=${logon}&from=${fltNo}&to=${ats}&type=telex&packet=${msg}`)
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
				let msgParams = html.split("/");
				console.log(msgParams);
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
HoppieApi.server = "http://localhost:5000/acars/system/connect.html?";