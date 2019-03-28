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
#### POST /user/plan
**Route:** `/user/plan`  
**Method:** POST  
**Desc:** Fetch student plan given preferences  
**Request:** 
```
{
  "fall": {
    "numberOfCourses": Number,
      "eveningTimePreference": Boolean,
      "requestedCourses": [String]
  },
  "winter": {
    "numberOfCourses": Number,
    "eveningTimePreference": Boolean,
      "requestedCourses": [String]
  },
  "summer": {
    "numberOfCourses": Number,
    "eveningTimePreference": Boolean,
    "requestedCourses": [String]
  }
}
```  
**Response:** 
```
{
  "message": String,
  "plan": {
    "schedules": {
      "fall": [Schedule],
      "winter": [Schedule],
      "summer": [Schedule],
    },
  "sequences": [Sequence]
  }
}
```
E.g.
```
{
    "message": "OK",
    "plan": {
        "schedules": {
            "fall": [
                {
                    "term": "FALL",
                    "sections": [
                        {
                            "courseCode": "COMP335",
                            "code": "H",
                            "title": "Introduction to Theoretical Computer Science",
                            "kind": "LEC",
                            "mode": "In Person",
                            "location": {
                                "code": "H820",
                                "building": "H",
                                "room": "820"
                            },
                            "times": [
                                {
                                    "startTime": "16.15.00",
                                    "endTime": "17.30.00",
                                    "weekDay": "MONDAY"
                                },
                                {
                                    "startTime": "16.15.00",
                                    "endTime": "17.30.00",
                                    "weekDay": "WEDNESDAY"
                                },
                                {
                                    "startTime": "16.15.00",
                                    "endTime": "17.30.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "COMP335",
                            "code": "H HB",
                            "title": "Introduction to Theoretical Computer Science",
                            "kind": "TUT",
                            "mode": "In Person",
                            "location": {
                                "code": "H619",
                                "building": "H",
                                "room": "619"
                            },
                            "times": [
                                {
                                    "startTime": "11.45.00",
                                    "endTime": "12.35.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "COMP346",
                            "code": "DD",
                            "title": "Operating Systems",
                            "kind": "LEC",
                            "mode": "In Person",
                            "location": {
                                "code": "FGB040",
                                "building": "FG",
                                "room": "B040"
                            },
                            "times": [
                                {
                                    "startTime": "17.45.00",
                                    "endTime": "20.15.00",
                                    "weekDay": "TUESDAY"
                                },
                                {
                                    "startTime": "17.45.00",
                                    "endTime": "20.15.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "COMP346",
                            "code": "DDDB",
                            "title": "Operating Systems",
                            "kind": "TUT",
                            "mode": "In Person",
                            "location": {
                                "code": "H564",
                                "building": "H",
                                "room": "564"
                            },
                            "times": [
                                {
                                    "startTime": "20.30.00",
                                    "endTime": "21.20.00",
                                    "weekDay": "TUESDAY"
                                },
                                {
                                    "startTime": "20.30.00",
                                    "endTime": "21.20.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "COMP348",
                            "code": "W",
                            "title": "Principles of Programming Languages",
                            "kind": "LEC",
                            "mode": "In Person",
                            "location": {
                                "code": "FGB060",
                                "building": "FG",
                                "room": "B060"
                            },
                            "times": [
                                {
                                    "startTime": "08.45.00",
                                    "endTime": "10.00.00",
                                    "weekDay": "MONDAY"
                                },
                                {
                                    "startTime": "08.45.00",
                                    "endTime": "10.00.00",
                                    "weekDay": "WEDNESDAY"
                                },
                                {
                                    "startTime": "08.45.00",
                                    "endTime": "10.00.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "COMP348",
                            "code": "W WD",
                            "title": "Principles of Programming Languages",
                            "kind": "TUT",
                            "mode": "In Person",
                            "location": {
                                "code": "H437",
                                "building": "H",
                                "room": "437"
                            },
                            "times": [
                                {
                                    "startTime": "08.45.00",
                                    "endTime": "09.35.00",
                                    "weekDay": "THURSDAY"
                                },
                                {
                                    "startTime": "08.45.00",
                                    "endTime": "09.35.00",
                                    "weekDay": "FRIDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "ENCS282",
                            "code": "BB",
                            "title": "Technical Writing and Communication",
                            "kind": "LEC",
                            "mode": "In Person",
                            "location": {
                                "code": "FGC070",
                                "building": "FG",
                                "room": "C070"
                            },
                            "times": [
                                {
                                    "startTime": "17.45.00",
                                    "endTime": "20.15.00",
                                    "weekDay": "TUESDAY"
                                },
                                {
                                    "startTime": "17.45.00",
                                    "endTime": "20.15.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "ENCS282",
                            "code": "BBBP",
                            "title": "Technical Writing and Communication",
                            "kind": "TUT",
                            "mode": "In Person",
                            "location": {
                                "code": "MBS2.465",
                                "building": "MB",
                                "room": "S2.465"
                            },
                            "times": [
                                {
                                    "startTime": "16.05.00",
                                    "endTime": "17.45.00",
                                    "weekDay": "THURSDAY"
                                },
                                {
                                    "startTime": "16.05.00",
                                    "endTime": "17.45.00",
                                    "weekDay": "FRIDAY"
                                }
                            ]
                        }
                    ]
                }
           ],
            "winter": [
                {
                    "term": "WINTER",
                    "sections": [
                        {
                            "courseCode": "ENGR201",
                            "code": "BL",
                            "title": "Professional Practice and Responsibility",
                            "kind": "LEC",
                            "mode": "Blended Learning",
                            "location": {
                                "code": "ONLINE",
                                "building": "",
                                "room": ""
                            },
                            "times": [
                                {
                                    "startTime": "00.00.00",
                                    "endTime": "00.00.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        },
                        {
                            "courseCode": "ENGR202",
                            "code": "R",
                            "title": "Sustainable Development and Environmental Stewardship",
                            "kind": "LEC",
                            "mode": "In Person",
                            "location": {
                                "code": "H110",
                                "building": "H",
                                "room": "110"
                            },
                            "times": [
                                {
                                    "startTime": "16.15.00",
                                    "endTime": "17.30.00",
                                    "weekDay": "THURSDAY"
                                }
                            ]
                        }
                    ]
                }
            ],
            "summer": []
        },
        "sequences": [
            {
                "term": "fall",
                "sections": [
                    "SOEN321",
                    "SOEN331",
                    "SOEN341",
                    "ENGR213"
                ]
            },
            {
                "term": "winter",
                "sections": [
                    "SOEN342",
                    "SOEN384",
                    "ELEC275",
                    "ENGR233"
                ]
            },
            {
                "term": "summer",
                "sections": [
                    "SOEN343",
                    "SOEN357",
                    "SOEN385",
                    "ENGR301"
                ]
            },
            {
                "term": "fall",
                "sections": [
                    "SOEN344",
                    "ENGR371",
                    "ENGR391",
                    "ENGR392"
                ]
            },
            {
                "term": "winter",
                "sections": [
                    "SOEN390",
                    "PHYS284",
                    "ENGR251",
                    "COMP353"
                ]
            },
            {
                "term": "summer",
                "sections": [
                    "SOEN490",
                    "SOEN387",
                    "COMP445"
                ]
            },
            {
                "term": "fall",
                "sections": [
                    "SOEN487"
                ]
            }
        ]
    }
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
---