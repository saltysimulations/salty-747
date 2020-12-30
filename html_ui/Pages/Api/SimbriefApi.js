class SimBriefApi {   
    static getFltPlan(userid) {
        if (!userid) {
            throw ("No SimBrief username provided");
        }

        return fetch(`${SimBriefApi.url}&userid=${userid}`)
            .then((response) => {
                if (!response.ok) {
                    throw (response);
                }

                return response.json();
            });
    }

    static getMetar(dept) {
        return fetch(`${SimBriefApi.vatsimMetar}${dept}`)
            .then((response) => {
                if (!response.ok) {
                    fmc.showErrorMessage("METAR UPLINK FAILED");
                    throw (response);
                }
                return response.json();
            });
    }

    static getAtis(dept) {
        fmc.showErrorMessage("API RECEIVED");
        return fetch("https://datis.clowd.io/api/klax")
            .then((response) => {
                fmc.showErrorMessage("API RETURNED");
                if (!response.ok) {
                    fmc.showErrorMessage("METAR UPLINK FAILED");
                    throw (response);
                }
                return response.json();
            });
    }
}
SimBriefApi.url = "http://www.simbrief.com/api/xml.fetcher.php?json=1";
SimBriefApi.vatsimMetar = "https://metar.vatsim.net/metar.php?id=";
SimBriefApi.faaAtis = "https://datis.clowd.io/api/";