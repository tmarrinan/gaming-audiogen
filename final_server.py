import os
import io
import base64
import torch
import torchaudio
from flask import Flask, request, Response, jsonify
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
from audiocraft.models import AudioGen, MusicGen
from audiocraft.data.audio import audio_write


# Create web application
app = Flask(__name__, static_url_path='', static_folder='dist')

# Initialize image-to-text processor
itt_cuda_device = 'cpu'
processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base')
model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base').to(itt_cuda_device)

# Initialize AudioCraft music and audio generators
audiogen_model = AudioGen.get_pretrained('facebook/audiogen-medium')
audiogen_model.set_generation_params(duration=5)
musicgen_model = MusicGen.get_pretrained('facebook/musicgen-small')
musicgen_model.set_generation_params(duration=8)

# Function to enhance descriptions with NLP
def enhance_description_with_nlp(description):
    try:
        classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')
        categories = ['nature', 'urban', 'indoor', 'quiet', 'loud', 'waterfront', 'forest', 'suburban', 'nightlife', 'industrial', 'rural', 'traffic', 'sports event', 'rainy', 'snowy']
        results = classifier(description, candidate_labels=categories)
        top_category = results['labels'][0]  # Assuming the first label is the highest scoring one
        sound_descriptions = {
            'nature': 'like birds chirping and leaves rustling in the breeze.',
            'urban': 'like cars honking and people talking, with the distant sound of music.',
            'indoor': 'like muffled voices and the hum of air conditioning, with occasional footsteps.',
            'quiet': 'like the soft whisper of the wind, with distant occasional sounds only.',
            'loud': 'like a cacophony of voices and constant background noise, overwhelming the senses.',
            'waterfront': 'like waves crashing against the shore, distant calls of seabirds overhead.',
            'forest': 'like twigs snapping underfoot, the rustle of animals moving through underbrush, and a symphony of bird calls.',
            'suburban': 'like children playing in yards, lawnmowers running in the distance, and family pets barking.',
            'nightlife': 'like laughter and chatter, the clinking of glasses, and music spilling out from bars.',
            'industrial': 'like machinery grinding, beeps of forklifts, and the clatter of construction.',
            'rural': 'like the distant mooing of cattle, the crowing of roosters at dawn, and tractors working the fields.',
            'traffic': 'like engines accelerating, the rhythmic thump of traffic lights, and the occasional siren.',
            'sports event': 'like crowds cheering, the whistle of referees, and the thud of a ball being kicked or thrown.',
            'rainy': 'like raindrops pattering on rooftops, splashing in puddles, and the occasional rumble of thunder.',
            'snowy': 'like the muffled quiet broken by crunching snow underfoot and the distant scraping of shovels.'
        }
        enhanced_description = f"{description}. You might hear sounds {sound_descriptions[top_category]}"
        return enhanced_description
    except Exception as e:
        print(f"Error in NLP enhancement: {str(e)}")
        return description  # Return original description if error occurs

# Audio Generation Endpoint
@app.route('/audiogen', methods=['POST'])
def generate_audio():
    try:
        req_data = request.get_json()
        if 'type' not in req_data or ('text' not in req_data and 'image' not in req_data):
            return jsonify({'error': 'Invalid request format'}), 400
        
        if req_data['type'] == 'text':
            description = req_data['text']
        else:
            png_b64 = req_data['image'][22:]
            png = base64.decodebytes(png_b64.encode('UTF-8'))
            img = Image.open(io.BytesIO(png)).convert('RGB')
            inputs = processor(img, return_tensors='pt').to(itt_cuda_device)
            out = model.generate(**inputs)
            basic_description = processor.decode(out[0], skip_special_tokens=True)
            description = enhance_description_with_nlp(basic_description)
        
        print(f'Generating audio for: "{description}"')
        wav = audiogen_model.generate([description])
        audio_write('output_audiogen', wav[0].cpu(), audiogen_model.sample_rate, strategy='loudness', loudness_compressor=True)
        with open('output_audiogen.wav', 'rb') as f_audio:
            audio = f_audio.read()
        return Response(audio, mimetype='audio/wav')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Music Generation Endpoint
@app.route('/musicgen', methods=['POST'])
def generate_music():
    try:
        req_data = request.get_json()
        if 'type' not in req_data or ('text' not in req_data and 'image' not in req_data):
            return jsonify({'error': 'Invalid request format'}), 400
        
        if req_data['type'] == 'text':
            description = req_data['text']
        else:
            png_b64 = req_data['image'][22:]
            png = base64.decodebytes(png_b64.encode('UTF-8'))
            img = Image.open(io.BytesIO(png)).convert('RGB')
            inputs = processor(img, return_tensors='pt').to(itt_cuda_device)
            out = model.generate(**inputs)
            description = processor.decode(out[0], skip_special_tokens=True)
        
        print(f'Generating music for: "{description}"')
        wav = musicgen_model.generate([description])
        audio_write('output_musicgen', wav[0].cpu(), musicgen_model.sample_rate, strategy='loudness', loudness_compressor=True)
        with open('output_musicgen.wav', 'rb') as f_audio:
            audio = f_audio.read()
        return Response(audio, mimetype='audio/wav')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# Run server
def main():
    app.run(host='0.0.0.0', port=8008)


# Home Page Endpoint
@app.route('/')
def index():
    try:
        with open(os.path.join('dist', 'index.html'), 'r', encoding='UTF-8') as f:
            home = f.read()
        return Response(home, mimetype='text/html')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    main()
