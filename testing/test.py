import requests

url = "http://localhost:8000/create_reading"
myobj = {
    "reading": "123.5",
    "tenant_id": "1",
    "date": "2017-03-10"
}
res = requests.post(url, json = myobj)

print(res.json())