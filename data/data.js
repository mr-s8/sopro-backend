

export let jobs = [
    {
        id: "s35sds82",
        name: "Office - Feuerlöscher austauschen",
        status: "zugewiesen",
        buildingID: "ba1jcC2",
        buildingAddress: "Musterstraße 1, 12345 Musterstadt",
        buildingImage: "20240905172936_1.jpg",
        route: [
            {
                id: "20240905172936_1",
                routeImage: "20240905172936_1.jpg",
                type: "path",
                description: "Geh zum Haupteingang."
            },
            {
                id: "20240905172948_1",
                routeImage: "20240905172948_1.jpg",
                type: "path",
                description: "Geh die Treppen hoch."
            },
            {
                id: "20240905173008_1",
                routeImage: "20240905173008_1.jpg",
                type: "path",
                description: "Gehe den rechten Gang entlang."
            },
            {
                id: "20240905173028_1",
                routeImage: "20240905173028_1.jpg",
                type: "path",
                description: "Gehe geradeaus."
            },
            {
                id: "20240905173057_1",
                routeImage: "20240905173057_1.jpg",
                type: "object",
                description: "Tausche Feuerlöscher."
            },
        ]
    },
    {
        id: "s3rsds83",
        name: "Office - Feuerlöscher reparieren",
        status: "zugewiesen",
        buildingID: "ba1jcC2",
        buildingAddress: "Musterstraße 1, 12345 Musterstadt",
        buildingImage: "20240905172936_1.jpg",
        route: [
            {
                id: "20240905172936_1",
                routeImage: "20240905172936_1.jpg",
                type: "path",
                description: "Geh zum Haupteingang."
            },
            {
                id: "20240905172948_1",
                routeImage: "20240905172948_1.jpg",
                type: "path",
                description: "Geh die Treppen hoch."
            },
            {
                id: "20240905173008_1",
                routeImage: "20240905173008_1.jpg",
                type: "path",
                description: "Gehe den rechten Gang entlang."
            },
            {
                id: "20240905173028_1",
                routeImage: "20240905173028_1.jpg",
                type: "path",
                description: "Gehe geradeaus."
            },
            {
                id: "20240905173057_1",
                routeImage: "20240905173057_1.jpg",
                type: "object",
                description: "Repariere Feuerlöscher."
            },
        ]
    }
];



export let assignedJobs = [
    {
        jobId: "s35sds82",
        userID: "838cjd939",
    },
    {
        jobId: "s3rsds83",
        userID: "838cjd939",
    },
]

export let completedJobs = [

    {

    }
]

export let buildings = [
    {
        id: "ba1jcC2",
        address: "Musterstraße 1, 12345 Musterstadt",
        buildingImage: "20240905172936_1.jpg"
    }
]


export let users = [
    {
        id: "838cjd939",
        name: "HansPeter",
        password: "hanspeter",
        roles: ["worker"]
    },
    {
        id: "835cjh937",
        name: "DieterMueller",
        password: "dietermueller",
        roles: ["worker"]
    },
]


// in der datenbank sind manche objekte mit fremdschlüssel verknüpft. diese jsons sind da wo es nötig
// ist schon zusammengebaut und können direkt als response verschickt werden.