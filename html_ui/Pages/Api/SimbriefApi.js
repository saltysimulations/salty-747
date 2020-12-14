class SimBriefApi {   
    static getFltPlan(userid) {
        if (!userid) {
            console.log("no user id");
            throw ("No SimBrief username provided");
        }

        return fetch(`${SimBriefApi.url}&userid=${userid}`)
            .then((response) => {
                console.log(response);
                if (!response.ok) {
                    throw (response);
                }

                return response.json();
            });
    }
}
SimBriefApi.url = "http://www.simbrief.com/api/xml.fetcher.php?json=1";