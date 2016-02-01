var should = require('should')
var utils = require("../lib/utils.js");

var agentData = {
    "_id": "56acd6c56c3ed9b26b63bc0b",
    "dbo:birthDate": [
        {
            "objectLiteral": "1819-05-31",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "dbo:deathDate": [
        {
            "objectLiteral": "1819-05-31",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "dcterms:description": [
        {
            "objectLiteral": "American poet, essayist and journalist",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "foaf:depiction": [
        {
            "objectLiteral": "Walt_Whitman_-_George_Collins_Cox.jpg",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "foaf:isPrimaryTopicOf": [
        {
            "objectLiteral": "Walt_Whitman",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "rdf:type": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "edm:Agent",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "foaf:Person",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "skos:exactMatch": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "viaf:2478331",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "wikidata:Q81438",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "lc:n79081476",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "dbr:Walt_Whitman",
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "skos:prefLabel": [
        {
            "objectLiteral": "Whitman, Walt, 1819-1892",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-30T15:29:09.590Z",
                "creator": "RI",
                "recordIdentifier": "catalog11540496",
                "source": "data:10000"
            }
        }
    ],
    "uri": 10015506,
    "viaf": [
        2478331
    ]
}

var resourceForTerms = {
    "_id": "569f5deb3d281f0d4b649e5c",
    "allAgents": [
        10015506
    ],
    "allTerms": [
        10000080,
        10010474,
        10002615,
        10000046,
        10000033,
        10005087,
        10000424,
        10003962,
        10002622,
        10003964
    ],
    "classify:holdings": [
        {
            "objectLiteral": 844,
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "db:dateStart": [
        {
            "objectLiteral": "1875",
            "objectLiteralType": "xsd:date",
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "dcterms:contributor": [
        {
            "label": "Whitman, Walt, 1819-1892",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "agents:10015506",
            "provo": {
                "created": "2016-01-20T10:13:35.636Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "roles:aut": [
        {
            "label": "Whitman, Walt, 1819-1892",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "agents:10015506",
            "provo": {
                "created": "2016-01-20T01:55:58.854Z",
                "creator": "RI",
                "recordIdentifier": "72643750-c6b4-012f-30ff-58d385a7bc34",
                "source": "data:10002"
            }
        }
    ],
    "roles:app": [
        {
            "label": "NOT Whitman, Walt, 1819-1892",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "agents:10015522",
            "provo": {
                "created": "2016-01-20T01:55:58.854Z",
                "creator": "RI",
                "recordIdentifier": "72643750-c6b4-012f-30ff-58d385a7bc34",
                "source": "data:10002"
            }
        }
    ],    
    "roles:com": [
        {
            "label": "Whitman, Walt, 1819-1892",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "agents:10015506",
            "provo": {
                "created": "2016-01-20T01:55:58.854Z",
                "creator": "RI",
                "recordIdentifier": "72643750-c6b4-012f-30ff-58d385a7bc34",
                "source": "data:10002"
            }
        }
    ],
    "dcterms:created": [
        {
            "objectLiteral": "1875",
            "objectLiteralType": "xsd:date",
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "dcterms:identifier": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:callnum:*KLW(Whitman,W.MemorandaduringtheWar)",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:bnum:14202389",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:oclc:3907325",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:classmark:*klw",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:lccc:PS991-3390",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:owi:1843153822",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:dcc:811.3",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "urn:lcc:PS3231",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "dcterms:language": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "language:eng",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "dcterms:subject": [
        {
            "label": "United States",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10000080",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Electronic books",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10010474",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Civil War, 1861-1865",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10002615",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Biography",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10000046",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "History",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10000033",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Diaries",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10005087",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Personal narratives",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10000424",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Hospitals, charities, etc.",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10003962",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "American Civil War (1861-1865)",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10002622",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Civilian war relief",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "terms:10003964",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        },
        {
            "label": "Mr. Beard-O",
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "agents:10015506",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": null,
                "source": "data:10000"
            }
        }        
    ],
    "dcterms:title": [
        {
            "objectLiteral": "Memoranda during the War.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "dcterms:type": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "resourcetypes:txt",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "nypl:owner": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "orgs:1108",
            "provo": {
                "created": "2016-01-20T10:13:35.685Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "nypl:suppressed": [
        {
            "objectLiteral": false,
            "objectLiteralType": "xsd:boolean",
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "rdf:type": [
        {
            "objectLiteral": null,
            "objectLiteralType": null,
            "objectUri": "nypl:Item",
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "skos:note": [
        {
            "objectLiteral": "General:\nCover-title: Walt Whitman's Memoranda of the war written on the spot in 1863-'65.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Immediate Source of Acquisition:\n54R0913. Copy 1.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Immediate Source of Acquisition:\n54R0573. Copy 2.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Local Note:\nCopy 1: Original sheets from Two rivulets.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Local Note:\nCopy 2: In original maroon cloth, with light green patterned end papers.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Local Note:\nCopy 2: Without the \"Remembrance copy\" leaf and leaf with portrait, preceding t.-p.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Local Note:\nCopy 2: Author's advertisement, one leaf bound at end.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        },
        {
            "objectLiteral": "Local Note:\nCopy 2: Author's presentation copy to Walter S. Crispin.",
            "objectLiteralType": null,
            "objectUri": null,
            "provo": {
                "created": "2016-01-20T10:13:35.686Z",
                "creator": "RI",
                "recordIdentifier": 14202389,
                "source": "data:10000"
            }
        }
    ],
    "uri": 149694027
}

var resource2 = { "_id" : "569fad5647d41f1c4bc6b91b", "uri" : 157284995, "allAgents" : [ 11200183, 10014098, 10015506, 10082221, 10467205, 10058397 ], "allTerms" : [ 10000756, 10000033, 10002615, 10003889, 10010474, 10000080 ], "dcterms:contributor" : [ { "objectUri" : "agents:11200183", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Cushman, Stephen, 1956-...." } ], "dcterms:subject" : [ { "objectUri" : "agents:10014098", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Lincoln, Abraham, 1809-1865" }, { "objectUri" : "agents:10015506", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Whitman, Walt, 1819-1892" }, { "objectUri" : "agents:10082221", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Sherman, William T. (William Tecumseh), 1820-1891" }, { "objectUri" : "agents:10467205", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Chamberlain, Joshua Lawrence, 1828-1914" }, { "objectUri" : "agents:10058397", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 }, "label" : "Bierce, Ambrose, 1842-1914?" }, { "objectUri" : "terms:10000756", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Influences" }, { "objectUri" : "terms:10000033", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "History" }, { "objectUri" : "terms:10002615", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Civil War, 1861-1865" }, { "objectUri" : "terms:10003889", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Actium, Battle of, 31 B.C.--Historiography" }, { "objectUri" : "terms:10010474", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Electronic books" }, { "objectUri" : "terms:10000080", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "United States" } ], "nypl:owner" : [ { "objectUri" : "orgs:1000", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "nypl:suppressed" : [ { "objectUri" : null, "objectLiteral" : false, "objectLiteralType" : "xsd:boolean", "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "rdf:type" : [ { "objectUri" : "nypl:Item", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "dcterms:identifier" : [ { "objectUri" : "urn:bnum:20514895", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : "urn:lccc:E461-655", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : "urn:owi:1856779283", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : "urn:dcc:973.7072", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : "urn:lcc:E468.5", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "dcterms:title" : [ { "objectUri" : null, "objectLiteral" : "Belligerent muse [electronic resource] : five northern writers and how they shaped our understanding of the Civil War", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.116Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "skos:note" : [ { "objectUri" : null, "objectLiteral" : "Bibliography, etc.:\nIncludes bibliographical references and index.", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : null, "objectLiteral" : "Formatted Contents:\nWhen Lincoln met Emerson, and the two addresses -- Walt Whitman's real wars -- Sherman the writer -- Ambrose Bierce, Chickamauga, and ways to write history -- Joshua Lawrence Chamberlain repeats Appomattox.", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } }, { "objectUri" : null, "objectLiteral" : "Restrictions on Access:\nAccess restricted to authorized users.", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "classify:holdings" : [ { "objectUri" : null, "objectLiteral" : 198, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "dcterms:type" : [ { "objectUri" : "resourcetypes:txt", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "dcterms:language" : [ { "objectUri" : "language:eng", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "db:dateStart" : [ { "objectUri" : null, "objectLiteral" : "2014", "objectLiteralType" : "xsd:date", "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ], "dcterms:created" : [ { "objectUri" : null, "objectLiteral" : "2014", "objectLiteralType" : "xsd:date", "provo" : { "creator" : "RI", "created" : "2016-01-20T15:52:13.117Z", "source" : "data:10000", "recordIdentifier" : 20514895 } } ] }
var resource3 = { "_id" : "569f7fafc83598bd4af571e0", "uri" : 107911079, "allAgents" : [ 10015506, 10015506, 13714974 ], "allTerms" : [ 10005087, 10002615, 10000080, 10000046, 10000159, 10005764, 10000033, 10010474, 10010799, 10000424, 10002622 ], "dcterms:subject" : [ { "objectUri" : "agents:10015506", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.516Z", "source" : "data:10000", "recordIdentifier" : 16030481 }, "label" : "Whitman, Walt, 1819-1892" }, { "objectUri" : "terms:10005087", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Diaries" }, { "objectUri" : "terms:10002615", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Civil War, 1861-1865" }, { "objectUri" : "terms:10000080", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "United States" }, { "objectUri" : "terms:10000046", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Biography" }, { "objectUri" : "terms:10000159", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "19th century" }, { "objectUri" : "terms:10005764", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "War work" }, { "objectUri" : "terms:10000033", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "History" }, { "objectUri" : "terms:10010474", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Electronic books" }, { "objectUri" : "terms:10010799", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Poets, American" }, { "objectUri" : "terms:10000424", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "Personal narratives" }, { "objectUri" : "terms:10002622", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : null }, "label" : "American Civil War (1861-1865)" } ], "dcterms:contributor" : [ { "objectUri" : "agents:10015506", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.516Z", "source" : "data:10000", "recordIdentifier" : 16030481 }, "label" : "Whitman, Walt, 1819-1892" }, { "objectUri" : "agents:13714974", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.516Z", "source" : "data:10000", "recordIdentifier" : 16030481 }, "label" : "Coviello, Peter" } ], "nypl:owner" : [ { "objectUri" : "orgs:1101", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "dcterms:identifier" : [ { "objectUri" : "urn:callnum:JFD05-1706", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:barcode:33433066739883", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:bnum:16030481", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:oclc:53284941", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:isbn:0195167937", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:isbn:0195167945", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:classmark:jfd", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:lccc:PS991-3390", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:owi:1843153822", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:dcc:811.3", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : "urn:lcc:PS3231", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "nypl:suppressed" : [ { "objectUri" : null, "objectLiteral" : false, "objectLiteralType" : "xsd:boolean", "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "rdf:type" : [ { "objectUri" : "nypl:Item", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "dcterms:title" : [ { "objectUri" : null, "objectLiteral" : "Memoranda during the war", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "skos:note" : [ { "objectUri" : null, "objectLiteral" : "General:\nOriginally published: Camden, N.J. : Author's publication, 1876.", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } }, { "objectUri" : null, "objectLiteral" : "Bibliography, etc.:\nIncludes bibliographical references (p. lii-liv) and index.", "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "classify:holdings" : [ { "objectUri" : null, "objectLiteral" : 844, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "dcterms:type" : [ { "objectUri" : "resourcetypes:txt", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "dcterms:language" : [ { "objectUri" : "language:eng", "objectLiteral" : null, "objectLiteralType" : null, "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "db:dateStart" : [ { "objectUri" : null, "objectLiteral" : "2004", "objectLiteralType" : "xsd:date", "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ], "dcterms:created" : [ { "objectUri" : null, "objectLiteral" : "2004", "objectLiteralType" : "xsd:date", "provo" : { "creator" : "RI", "created" : "2016-01-20T12:37:29.546Z", "source" : "data:10000", "recordIdentifier" : 16030481 } } ] }



describe('utils', function () {
	it('process a triple store object and return an flattend object of arrays', function () {
		var r = utils.flatenTriples(agentData)
        r.objectLiteral['skos:prefLabel'][0].should.equal('Whitman, Walt, 1819-1892')
        r.objectUri['skos:exactMatch'][0].should.equal('viaf:2478331')
	})

    it('extract the terms assoicated with a record int an array', function () {
        var r = utils.extractTerms(resourceForTerms)

        r[0].should.equal('United States')
        r[10].should.equal('Mr. Beard-O')
            
        //tell it to exlude any agents subjects about the person we are searching for        
        var r = utils.extractTerms(resourceForTerms,10015506)
        r.length.should.equal(10)

    })

    it('return top five terms', function () {

        var r1 = utils.extractTerms(resourceForTerms,10015506)
        var r2 = utils.extractTerms(resource2,10015506)
        var r3 = utils.extractTerms(resource3,10015506)

            
        var r = utils.topFiveTerms([r1,r2,r3])

        r[0].should.equal('United States')

    })

    it('extract role assoicated with a agent', function () {
        var r = utils.extractRoles(resourceForTerms,10015506)
        r.length.should.equal(2)
        r[0].should.equal('Author')

        var r = utils.topFiveTerms([r])
        r[0].should.equal('Author')
        

    })

})




