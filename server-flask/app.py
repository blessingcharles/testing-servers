from pprint import pprint
from flask import Flask, request

app = Flask(__name__)

@app.route("/" , methods=["GET" , "POST"])
def serve():
    data = request.get_data().decode()
    pprint(request.headers)
    pprint(data)
    message = f"\n--------\nRequest\n{request.headers}\nBody Length: {len(data)}\nBody: {data}\n"

    with open("output/fuzz.txt" , "a+") as f:
        f.write(message)

    return f"Body Length :{len(data)} Body {data}"

if __name__ == "__main__":

    open("output/fuzz.txt" , "w").close()
    app.run()
