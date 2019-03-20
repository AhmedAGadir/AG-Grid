export const rows = [
    {
        mainCol1: 1233242,
        mainCol2: 'GEO EXPRESS'
    },
    {
        mainCol1: 13242342,
        mainCol2: 'TEST MARKETING NAME'
    }
]

export const tabDetails = {
    1233242: {
        gridTab1Data: [
            { col1: 123, col2: 'Test', col3: 'Test3' },
            { col1: 234, col2: 'Test6', col3: 'Test7' },
            { col1: 2345, col2: 'Test6', col3: 'Test7' },
            { col1: 2346, col2: 'Test6', col3: 'Test7' },
            { col1: 2347, col2: 'Test6', col3: 'Test7' },
            { col1: 2348, col2: 'Test6', col3: 'Test7' },
            { col1: 2349, col2: 'Test6', col3: 'Test7' },
            { col1: 2340, col2: 'Test6', col3: 'Test7' },
            { col1: 2344, col2: 'Test6', col3: 'Test7' },
            { col1: 2343, col2: 'Test6', col3: 'Test7' },
            { col1: 2342, col2: 'Test6', col3: 'Test7' },
            { col1: 2341, col2: 'Test6', col3: 'Test7' },
            { col1: 23445, col2: 'Test6', col3: 'Test7' },
            { col1: 23455, col2: 'Test6', col3: 'Test7' },
            { col1: 23477, col2: 'Test6', col3: 'Test7' },
            { col1: 23488, col2: 'Test6', col3: 'Test7' },

        ],
        nonGridTabData: { name: 'test', id: 121, imageURL: 'https://s7d2.scene7.com/is/image/academy/10340208?$grid-desktop$' },
        nested: [{ col1: 2, col2: 3 }]
    },
    13242342: {
        gridTab1Data: [
            { col1: 345, col2: 'Test2', col3: 'Test4' },
            { col1: 456, col2: 'Test8', col3: 'Test9' },
        ],
        nonGridTabData: { name: 'test', id: 121, imageURL: 'https://s7d2.scene7.com/is/image/academy/10340208?$grid-desktop$' },
        nested: [{ col1: 5, col2: 6 }]
    }
}

var res = [
    {
        "mainCol1": 1233242,
        "mainCol2": "GEO EXPRESS",
        "id": "69336d0c-3951-4314-9503-0d020333fd38",
        "detailData": {
            "gridTab1Data": [
                {
                    "col1": 1
                },
                {
                    "col2": 2
                }
            ],
            "nonGridTabData": {
                "name": "test",
                "id": 121,
                "imageURL": "https://s7d2.scene7.com/is/image/academy/10340208?$grid-desktop$"
            },
            "nested": [
                {
                    "col1": 2,
                    "col2": 3
                }
            ]
        }
    },
    {
        "mainCol1": 13242342,
        "mainCol2": "TEST MARKETING NAME",
        "id": "6ae0ff01-a7f3-47c3-aadc-392824967ace",
        "detailData": {
            "gridTab1Data": [
                {
                    "col1": 4
                },
                {
                    "col2": 5
                }
            ],
            "nonGridTabData": {
                "name": "test",
                "id": 121,
                "imageURL": "https://s7d2.scene7.com/is/image/academy/10340208?$grid-desktop$"
            },
            "nested": [
                {
                    "col1": 5,
                    "col2": 6
                }
            ]
        }
    }
]