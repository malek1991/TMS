sap.ui.define([
    "sap/ui/model/json/JSONModel"
],
    function (JSONModel) {
        "use strict";
        return {

            callServer: function (method, apiUrl, payload, async) {

                var oPromise = new Promise(function (fnResolve, fnReject) {

                    if (async !== false)
                        async = true;

                    if (payload === undefined)
                        payload = {};

                    if (method === undefined)
                        method = "GET";

                    let fetchData = {
                        method: method,
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }

                    if (method !== "GET" && method !== "DELETE") {
                        fetchData.body = JSON.stringify(payload);
                    }

                    const oUrl = 'https://localhost:5001';
                    try {
                        fetch(`${oUrl}${path}`, fetchData)
                            .then(res => {
                                if (res.status === 403 || res.status === 401) {
                                    return fnReject(res);
                                }
                                return res.json();
                            })
                            .then(function (oResponse) {
                                fnResolve(oResponse);
                            })
                            .catch(function (err) {
                                fnReject(err);
                            });
                    } catch (e) {
                        fnReject(e);
                    }
                });

                return oPromise;
            }

        };
    });
