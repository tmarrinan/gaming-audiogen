import os
import time
import base64
from flask import Flask, request, Response
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

# Create web application
app = Flask(__name__, static_url_path='', static_folder='dist')

# Initialize Azure Computer Vision Client
f_azure = open('azure_key.txt', 'r', encoding='UTF-8')
subscription_key = f_azure.read()
f_azure.close()
endpoint = "https://audiocraft.cognitiveservices.azure.com/"
computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

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
        description = 'No description available.'
        png_b64 = req_data['image'][22:]
        png = base64.decodebytes(png_b64.encode('UTF-8'))
        f_img = open(os.path.join('tmp', 'screenshot.png'), 'wb')
        f_img.write(png)
        f_img.close()
        time.sleep(1)
        url = "https://upload.wikimedia.org/wikipedia/commons/3/38/Supertux010.jpg"
        analysis = computervision_client.describe_image(url)
        if len(analysis.captions) > 0:
            for caption in analysis.captions:
                print(f'\'{caption.text}\' with confidence {caption.confidence * 100:.2f}%')
        """
        f_img = open(os.path.join('tmp', 'screenshot.png'), 'rb')
        description_result = computervision_client.describe_image_in_stream(f_img, 3)
        f_img.close()
        print(description_result.captions)
        if len(description_result.captions) > 0:
            for caption in description_result.captions:
                print(f'\'{caption.text}\' with confidence {caption.confidence * 100:.2f}%')
            description = ' '.join([caption.text for caption in description_result.captions])
        """
        print(description)
    f_audio = open('test_10sec.wav', 'rb')
    audio = f_audio.read()
    f_audio.close()
    return Response(audio, mimetype='audio/wav')


if __name__ == '__main__':
    main()
