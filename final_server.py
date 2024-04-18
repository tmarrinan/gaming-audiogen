import os
import io
import base64
import torch
import torchaudio
from flask import Flask, request, Response
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from audiocraft.models import AudioGen, MusicGen
from audiocraft.data.audio import audio_write


# Create web application
app = Flask(__name__, static_url_path='', static_folder='dist')

# Initialize image-to-text processor
itt_cuda_device = 'cuda:1'
processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base')
model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base').to(itt_cuda_device)


# Initialize AudioCraft music and audio generators
audiogen_model = AudioGen.get_pretrained('facebook/audiogen-medium')
audiogen_model.set_generation_params(duration=5)
musicgen_model = MusicGen.get_pretrained('facebook/musicgen-small')
musicgen_model.set_generation_params(duration=8)

# Run server
def main():
    cert = os.path.join('keys', 'fullchain.pem')
    key = os.path.join('keys', 'privkey.pem')
    app.run(ssl_context=(cert, key), host='0.0.0.0', port=8008)


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
    description = ''
    req_data = request.get_json();
    if req_data['type'] == 'text':
        description = req_data['text']
    else:
        png_b64 = req_data['image'][22:]
        png = base64.decodebytes(png_b64.encode('UTF-8'))
        img = Image.open(io.BytesIO(png)).convert('RGB')
        inputs = processor(img, return_tensors='pt').to(itt_cuda_device)
        out = model.generate(**inputs)
        description = processor.decode(out[0], skip_special_tokens=True)
    print(f'Generating audio sound effect for "{description}"')
    wav = audiogen_model.generate([description])
    audio_write('audiogen', wav[0].cpu(), audiogen_model.sample_rate, strategy='loudness', loudness_compressor=True)
    f_audio = open('audiogen.wav', 'rb')
    audio = f_audio.read()
    f_audio.close()
    return Response(audio, mimetype='audio/wav')

# POST: MusicGen
@app.route('/musicgen', methods=['POST'])
def generateMusic():
    description = ''
    req_data = request.get_json()
    if req_data['type'] == 'text':
        description = req_data['text']
    elif req_data['type'] == 'image':
        png_b64 = req_data['image'][22:]
        png = base64.decodebytes(png_b64.encode('UTF-8'))
        img = Image.open(io.BytesIO(png)).convert('RGB')
        inputs = processor(img, return_tensors='pt').to(itt_cuda_device)
        out = model.generate(**inputs)
        description = processor.decode(out[0], skip_special_tokens=True)
    print(f'Generating music for "{description}"')
    wav = musicgen_model.generate([description])
    audio_write('musicgen', wav[0].cpu(), musicgen_model.sample_rate, strategy='loudness', loudness_compressor=True)
    f_audio = open('musicgen.wav', 'rb')
    audio = f_audio.read()
    f_audio.close()
    return Response(audio, mimetype='audio/wav')


if __name__ == '__main__':
    main()

