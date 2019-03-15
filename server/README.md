# Server
## Routes
### User
#### GET /user
**Route:** `/user`  
**Method:** GET  
**Desc:** Get currently logged in user  
**Response:**
```
{ 
  "message": String, 
  "user": User 
}
```  
---
#### POST /user
**Route:** `/user`  
**Method:** POST  
**Desc:** User signup  
**Request:** 
```
{ 
  "username": String, 
  "password": String 
}
```  
**Response:**
```
{ 
  "message": String, 
  "user": User 
}
```  
---
#### POST /user/login
**Route:** `/user/login`  
**Method:** POST  
**Desc:** Login user  
**Request:** 
```
{ 
  "username": String, 
  "password": String 
}
``` 
**Response:** 
```
{ 
  "message": String, 
  "user": User 
}
```  
---
#### POST /user/logout
**Route:** `/user/logout`  
**Method:** POST  
**Desc:** Logout user  
**Request:** `{ }`  
**Response:**  
```
{ 
  "message": String 
}
```  
---
#### POST /user/schedule
**Route:** `/user/schedule`  
**Method:** POST  
**Desc:** Generate schedule for user  
**Request:** 
```
{ 
  "fall": {
    "requestedCourses": [String],
    "eveningTimePreference": Boolean,
    "numberOfCourses": Number
  }, 
  "winter": {
    "requestedCourses": [String],
    "eveningTimePreference": Boolean,
    "numberOfCourses": Number
  },
  "summer": {
    "requestedCourses": [String],
    "eveningTimePreference": Boolean,
    "numberOfCourses": Number
  } 
}
``` 
**Response:** 
```
{ 
  "message": String, 
  "user": User 
}
```  
---
### Catalog
#### GET /catalog
**Route:** `/catalog`  
**Method:** GET  
**Desc:** Fetch all catalog (Course) objects from database  
**Response:** 
```
{
  "message": String,
  "catalog": [ 
    { 
      "code": String,
      "title": String,
      "credits": Number,
      "prerequisiteCodes": [[String]] | null,
      "corequisiteCodes": [[String]] | null,
      "equivalentCodes": [[String]] | null,

    }, 
  ]
}
```
E.g.:
```
{
  "message": "OK",
  "catalog": [
    {
        "prerequisiteCodes": [
            [
                "MATH201"
            ]
        ],
        "corequisiteCodes": null,
        "equivalentCodes": null,
        "_id": "5c73390883db84c0865170ba",
        "code": "COMP201",
        "credits": 3,
        "rawpre": "   Course Prerequisite: MATH201",
        "title": "Introduction to Computing",
        "__v": 0
    },
    {
        "prerequisiteCodes": [
            [
                "MATH201"
            ]
        ],
        "corequisiteCodes": null,
        "equivalentCodes": [
            [
                "COMP248"
            ]
        ],
        "_id": "5c73390883db84c0865170c7",
        "code": "COMP218",
        "credits": 3,
        "rawpre": "   Never Taken/Not Registered: COMP248 You must complete 1 of the following rules   Course Prerequisite: MATH201",
        "title": "Fundamentals of Programming",
        "__v": 0
    },
    {
        "prerequisiteCodes": [
            [
                "COMP248"
            ]
        ],
        "corequisiteCodes": [
            [
                "MATH204,MATH203"
            ]
        ],
        "equivalentCodes": null,
        "_id": "5c73390883db84c0865170d1",
        "code": "COMP228",
        "credits": 3,
        "rawpre": "Course Co-requisite: MATH204, MATH203; Course Prerequisite: COMP248",
        "title": "System Hardware",
        "__v": 0
    },
    {
        "prerequisiteCodes": [
            [
                "COMP352"
            ],
            [
                "COEN352"
            ]
        ],
        "corequisiteCodes": null,
        "equivalentCodes": [
            [
                "COMP451"
            ],
            [
                "COMP454"
            ],
            [
                "COMP458"
            ],
            [
                "SOEN387"
            ]
        ],
        "_id": "5c73390983db84c086517139",
        "code": "COMP353",
        "credits": 4,
        "rawpre": "   Never Taken: COMP451, COMP454, COMP458, SOEN387 You must complete 1 of the following rules   Course Prerequisite: COMP352, COEN352",
        "title": "Databases",
        "__v": 0
    },
    ...
  ]
}
```
---
### Timetable
#### GET /timetable
**Route:** `/timetable`  
**Method:** GET  
**Desc:** Fetch all timetable (Section) objects from database  
**Response:** 
```
{
  "message": String,
  "timetable": [ 
    { 
      "code": String,
      "courseCode": String,
      "term": "FALL" | "WINTER" | "SPRING" | "SUMMER" | "SPRING/SUMMER",
      "mode": "In Person" | "Online",
      "kind": "LEC" | "TUT" | "LAB",
      "location": {
        "code": String,
        "room": String,
        "building": String
      },
      "times": [
        {
          "startTime": "hh.mm.ss",
          "endTime": "hh.mm.ss",
          "weekDay": "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY"
        }
      ]
    }, 
  ]
}
```
E.g.:
```
{
  "message": "OK",
  "timetable": [
    {
        "_id": "5c7416be14d29885ffb3854e",
        "courseCode": "COMP354",
        "code": "BB",
        "term": "SPRING/SUMMER",
        "mode": "In Person",
        "location": {
            "_id": "5c7416be14d29885ffb3854f",
            "code": "H435",
            "room": "435",
            "building": "H"
        },
        "kind": "LEC",
        "times": [
            {
                "_id": "5c7416be14d29885ffb38550",
                "startTime": "18.30.00",
                "endTime": "21.00.00",
                "weekDay": "WEDNESDAY"
            }
        ],
        "__v": 0
    },
    {
        "_id": "5c7416be14d29885ffb38551",
        "courseCode": "COMP354",
        "code": "BBBE",
        "term": "SPRING/SUMMER",
        "mode": "In Person",
        "location": {
            "_id": "5c7416be14d29885ffb38552",
            "code": "FGB040",
            "room": "B040",
            "building": "FG"
        },
        "kind": "TUT",
        "times": [
            {
                "_id": "5c7416be14d29885ffb38553",
                "startTime": "17.30.00",
                "endTime": "18.20.00",
                "weekDay": "WEDNESDAY"
            }
        ],
        "__v": 0
    },
    {
        "_id": "5c7416be14d29885ffb38554",
        "courseCode": "COMP354",
        "code": "BBBF",
        "term": "SPRING/SUMMER",
        "mode": "In Person",
        "location": {
            "_id": "5c7416be14d29885ffb38555",
            "code": "FGB050",
            "room": "B050",
            "building": "FG"
        },
        "kind": "TUT",
        "times": [
            {
                "_id": "5c7416be14d29885ffb38556",
                "startTime": "17.30.00",
                "endTime": "18.20.00",
                "weekDay": "WEDNESDAY"
            }
        ],
        "__v": 0
    },
    {
        "_id": "5c7416be14d29885ffb38557",
        "courseCode": "COMP354",
        "code": "BI-X",
        "term": "SPRING/SUMMER",
        "mode": "In Person",
        "location": {
            "_id": "5c7416be14d29885ffb38558",
            "code": "H967",
            "room": "967",
            "building": "H"
        },
        "kind": "LAB",
        "times": [
            {
                "_id": "5c7416be14d29885ffb38559",
                "startTime": "21.10.00",
                "endTime": "23.00.00",
                "weekDay": "WEDNESDAY"
            }
        ],
        "__v": 0
    },
    {
        "_id": "5c7416be14d29885ffb3855a",
        "courseCode": "COMP354",
        "code": "BJ-X",
        "term": "SPRING/SUMMER",
        "mode": "In Person",
        "location": {
            "_id": "5c7416be14d29885ffb3855b",
            "code": "H967",
            "room": "967",
            "building": "H"
        },
        "kind": "LAB",
        "times": [
            {
                "_id": "5c7416be14d29885ffb3855c",
                "startTime": "21.10.00",
                "endTime": "23.00.00",
                "weekDay": "WEDNESDAY"
            }
        ],
        "__v": 0
    },
    ...
  ]
}
```
---
### Degree
#### GET /degree/soen
**Route:** `/degree/soen`  
**Method:** GET  
**Desc:** Fetch all course codes for various SOEN degree requirements  
**Response:** 
```
{
  "message": String,
  "requirements": {
    "soen": {
      "numberOfCoursesRequired: Number,
      "numberOfCreditsRequired: Number,
      "courses": [String]
    },
    "comp": {
      "numberOfCoursesRequired: Number,
      "numberOfCreditsRequired: Number,
      "courses": [String]
    },
    "engr": {
      "numberOfCoursesRequired: Number,
      "numberOfCreditsRequired: Number,
      "courses": [String]
    },
    "science": {
      "numberOfCoursesRequired: Number,
      "numberOfCreditsRequired: Number,
      "courses": [String]
    },
    "generalOption": {
      "numberOfCoursesRequired: Number,
      "numberOfCreditsRequired: Number,
      "courses": [String]
    },
    "mandatory": [String],
    "optional": [String],
    "all": [String]
  }
}
```
E.g.:
```
{
  "message": "OK",
  "requirements": {
    "soen": {
        "numberOfCoursesRequired": 13,
        "courses": [
            "SOEN228",
            "SOEN287",
            "SOEN321",
            "SOEN331",
            "SOEN341",
            "SOEN342",
            "SOEN343",
            "SOEN344",
            "SOEN357",
            "SOEN384",
            "SOEN385",
            "SOEN390",
            "SOEN490"
        ]
    },
    "comp": {
        "numberOfCoursesRequired": 7,
        "courses": [
            "COMP232",
            "COMP248",
            "COMP249",
            "COMP335",
            "COMP346",
            "COMP348",
            "COMP352"
        ]
    },
    "engr": {
        "numberOfCoursesRequired": 10,
        "courses": [
            "ELEC275",
            "ENCS282",
            "ENGR201",
            "ENGR202",
            "ENGR213",
            "ENGR233",
            "ENGR301",
            "ENGR371",
            "ENGR391",
            "ENGR392"
        ]
    },
    "science": {
        "numberOfCoursesRequired": 2,
        "courses": [
            "BIOL206*",
            "BIOL261*",
            "CHEM217*",
            "CHEM221*",
            "CIVI231",
            "ELEC321",
            "ENGR242",
            "ENGR243",
            "ENGR251",
            "ENGR361",
            "ENGR221*",
            "PHYS252*",
            "PHYS284*",
            "PHYS385*"
        ]
    },
    "generalOption": {
        "numberOfCreditsRequired": 16,
        "courses": [
            "COMP345",
            "COMP353",
            "COMP371",
            "COMP426",
            "COMP428",
            "COMP442",
            "COMP445",
            "COMP451",
            "COMP465",
            "COMP472",
            "COMP473",
            "COMP474",
            "COMP478",
            "COMP479",
            "SOEN298",
            "SOEN422",
            "SOEN423",
            "SOEN448",
            "SOEN491",
            "ENGR411"
        ]
    },
    "mandatory": [
        "SOEN228",
        "SOEN287",
        "SOEN321",
        "SOEN331",
        "SOEN341",
        "SOEN342",
        "SOEN343",
        "SOEN344",
        "SOEN357",
        "SOEN384",
        "SOEN385",
        "SOEN390",
        "SOEN490",
        "COMP232",
        "COMP248",
        "COMP249",
        "COMP335",
        "COMP346",
        "COMP348",
        "COMP352",
        "ELEC275",
        "ENCS282",
        "ENGR201",
        "ENGR202",
        "ENGR213",
        "ENGR233",
        "ENGR301",
        "ENGR371",
        "ENGR391",
        "ENGR392"
    ],
    "optional": [
        "BIOL206*",
        "BIOL261*",
        "CHEM217*",
        "CHEM221*",
        "CIVI231",
        "ELEC321",
        "ENGR242",
        "ENGR243",
        "ENGR251",
        "ENGR361",
        "ENGR221*",
        "PHYS252*",
        "PHYS284*",
        "PHYS385*"
    ],
    "all": [
        [
            "SOEN228",
            "SOEN287",
            "SOEN321",
            "SOEN331",
            "SOEN341",
            "SOEN342",
            "SOEN343",
            "SOEN344",
            "SOEN357",
            "SOEN384",
            "SOEN385",
            "SOEN390",
            "SOEN490",
            "COMP232",
            "COMP248",
            "COMP249",
            "COMP335",
            "COMP346",
            "COMP348",
            "COMP352",
            "ELEC275",
            "ENCS282",
            "ENGR201",
            "ENGR202",
            "ENGR213",
            "ENGR233",
            "ENGR301",
            "ENGR371",
            "ENGR391",
            "ENGR392"
        ],
        "BIOL206*",
        "BIOL261*",
        "CHEM217*",
        "CHEM221*",
        "CIVI231",
        "ELEC321",
        "ENGR242",
        "ENGR243",
        "ENGR251",
        "ENGR361",
        "ENGR221*",
        "PHYS252*",
        "PHYS284*",
        "PHYS385*"
    ]
  }
}
```

