## Golang default net/http

##### LaxTe Plugin

1. te-and-cl
2. key-case-collapse
3. value-case-collapse
4. key-value-case-collapse
5. point-key-start-09
    - Header gets ignored
```bash
GET / HTTP/1.1
Host: localhost
Connection: Close
X-type: point-key-start-09
	Transfer-Encoding: chunked
Content-Length: 13

2
yy
0

X
HTTP/1.1 200 OK
Date: Wed, 04 May 2022 11:50:15 GMT
Content-Length: 45
Content-Type: text/plain; charset=utf-8
Connection: close

Body length: 13 Body: "2\r\nyy\r\n0\r\n\r\nX"
```
6. point-value-start-0d
```bash
GET / HTTP/1.1
Host: localhost
Connection: Close
X-type: point-value-start-0d
Transfer-Encoding: 
chunked
Content-Length: 13

2
yy
0

X
HTTP/1.1 200 OK
Date: Wed, 04 May 2022 11:50:34 GMT
Content-Length: 25
Content-Type: text/plain; charset=utf-8
Connection: close

Body length: 2 Body: "yy"
```
7. point-value-end-0d
```
GET / HTTP/1.1
Host: localhost
Connection: Close
X-type: point-value-end-0d
Transfer-Encoding: chunked

Content-Length: 13

2
yy
0

X
HTTP/1.1 200 OK
Date: Wed, 04 May 2022 11:50:34 GMT
Content-Length: 25
Content-Type: text/plain; charset=utf-8
Connection: close

Body length: 2 Body: "yy"
```

8. X-preheaders-09-end-lf
9. X-preheaders-end-0a
10. X-preheaders-after-colon-with-0a
11. X-preheaders-[0x20-0xff]-end-lf


#### HttpVersionPlugin

1. Invalid versions accepted 1.2 - 1.9
    1.01 , 1.0000001 ,  1.000000001 ,1.1010 , 1.0101
    01.1 , 01.10 ,01.01 , 1.30 ,

