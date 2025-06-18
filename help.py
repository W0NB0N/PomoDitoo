import requests

pixels = ["#000000" for _ in range(16)]
for i in range(16):
    if i<5:
        pixels[i] = ["#ff003c" for _ in range(16)]
    elif i<10:
        pixels[i] = ["#0d99e4" for _ in range(16)]
    else:
        pixels[i] = ["#bd13f1" for _ in range(16)]

requests.post('http://localhost:5000/set_grid', json={'pixels': pixels})