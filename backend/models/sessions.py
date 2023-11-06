import os
import requests
import json
url = "https://eu-central-1.aws.data.mongodb-api.com/app/data-rhvan/endpoint/data/v1/action/findOne"

payload = json.dumps({
    "collection": "sessions",
    "database": "LoreDump",
    "dataSource": "Cluster0",
    "projection": {
        "_id": 1
    }
})
headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': os.getenv("LOREDUMP_API"),
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
