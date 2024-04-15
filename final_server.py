import os
import base64
from flask import Flask, request, Response

app = Flask(__name__, static_url_path='', static_folder='dist')

def main():
    app.run(port=8000)


# Home page
@app.route('/')
def index():
    f = open(os.path.join('dist', 'index.html'), 'r', encoding='UTF-8')
    home = f.read()
    f.close()
    return Response(home, mimetype='text/html')

# POST: AudioGen
@app.route('/audiogen', methods=['POST'])
def generateAudio():
    req_data = request.get_json()
    return Response('Testing', mimetype='text/plain')

# POST: MusicGen
@app.route('/musicgen', methods=['POST'])
def generateMusic():
    req_data = request.get_json()
    if req_data['type'] == 'text':
        description = req_data['text']
        print(description)
    elif req_data['type'] == 'image':
        png_b64 = req_data['image'][22:]
        png = base64.decodebytes(png_b64.encode('UTF-8'))
        f_img = open(os.path.join('tmp', 'screenshot.png'), 'wb')
        f_img.write(png)
        f_img.close()
    f_audio = open('test_10sec.wav', 'rb')
    audio = f_audio.read()
    f_audio.close()
    return Response(audio, mimetype='audio/wav')


if __name__ == '__main__':
    main()
