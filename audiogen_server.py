from flask import Flask, request, render_template_string, url_for
import os
import io
import torchaudio
from audiocraft.models import AudioGen
import base64

app = Flask(__name__)

# Initialize the AudioGen model globally to avoid reloading it on each request
model = AudioGen.get_pretrained('facebook/audiogen-medium')
model.set_generation_params(duration=5)  # generate 5 seconds.

@app.route('/')
def index():
    return render_template_string('''
        <html>
        <head>
            <title>AudioGen Web App</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                h2 { text-align: center; }
                form { margin-top: 20px; }
                label { display: block; margin-bottom: 10px; }
                input[type="text"] { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 5px; }
                input[type="submit"] { display: block; width: 100%; padding: 10px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer; }
                input[type="submit"]:hover { background-color: #0056b3; }
                audio { display: block; margin-top: 20px; width: 100%; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Generate Audio from Description</h2>
                <form method="post" action="/generate">
                    <label for="description">Enter Description:</label>
                    <input type="text" id="description" name="description" placeholder="Describe the scene for audio generation">
                    <input type="submit" value="Generate Audio">
                </form>
            </div>
        </body>
        </html>
    ''')

@app.route('/generate', methods=['POST'])
def generate_audio():
    description = request.form['description']
    if description:
        wav = model.generate([description])  # Generate the audio based on the description

        byte_stream = io.BytesIO()
        torchaudio.save(byte_stream, src=wav[0].cpu(), format="wav", sample_rate=model.sample_rate)
        byte_stream.seek(0)
        audio_data = byte_stream.read()

        # Convert audio data to a data URL
        data_url = f"data:audio/wav;base64,{base64.b64encode(audio_data).decode()}"

        # Serve a webpage with an audio player for the generated audio
        return render_template_string('''
            <html>
                <body>
                    <h2>Generated Audio:</h2>
                    <audio controls>
                        <source src="{{ data_url }}" type="audio/wav">
                        Your browser does not support the audio element.
                    </audio>
                    <p><a href="/">Generate another audio</a></p>
                </body>
            </html>
        ''', data_url=data_url)
    else:
        return "No description provided", 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)
