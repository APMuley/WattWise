import requests

url = "http://localhost:8000/get_tenants"
myobj = {
    "reading": "123.5",
    "tenant_id": "1",
    "date": "2017-03-10"
}
res = requests.get(url)

print(res.json())