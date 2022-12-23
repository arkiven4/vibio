import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import json
from pathlib import Path
import moviepy.editor as moviepy

import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import numpy
from scipy.io import wavfile

app = Flask(__name__)
CORS(app)

os.environ["CUDA_VISIBLE_DEVICES"]=""

processor = Wav2Vec2Processor.from_pretrained("./processor")
model = Wav2Vec2ForCTC.from_pretrained("./model")

print(os.getcwd())

def speech_file_to_array_fn(filename):
    speech_array, sampling_rate = torchaudio.load(filename)
    resampler = torchaudio.transforms.Resample(sampling_rate, 16_000)
    return resampler(speech_array).squeeze().numpy()

@app.route('/', methods=['GET'])
def test():
    return jsonify({
        "prediction": "How",
        "time_exec": "LOL"
    })

@app.route('/recognition', methods=['POST'])
def update_record():
    start_time = time.time()
    #print(request.form)
    #print(request.files)
    #base64_wav = request.form.get('base64')
    #print(coba)
    # language = request.form.get('language')
    # framework = request.form.get('framework')
    file = request.files['file_audio']

    #fs, data = wavfile.read(file)
    #inputAudio = data/(2**15)
    file.save(os.path.join("./temp/", "temp.wav"))

    #wav_file = open("./temp/temp.wav", "wb")
    #decode_string = base64.b64decode(base64_wav)
    #wav_file.write(decode_string)
    #call = os.system("ffmpeg -i "+os.getcwd()+"/temp/temp.wav -ar 16000 -ac 1 "+os.getcwd()+"/temp/temp_comp.wav -y > ouput_ffmpeg.txt")
    call  = os.system(f"ffmpeg -i {os.getcwd()}/temp/temp.wav -f wav -ar 16000 {os.getcwd()}/temp/temp_conv.wav -y -hide_banner -loglevel panic > out.txt")
    inputAudio = speech_file_to_array_fn("./temp/temp_conv.wav")

    #print(Path('./temp/temp.wav').stat().st_size)

    inputs = processor(inputAudio, sampling_rate=16_000, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = model(inputs.input_values, attention_mask=inputs.attention_mask).logits

    # predicted_ids = torch.argmax(logits, dim=-1)
    response = jsonify({
        "prediction": processor.batch_decode(torch.argmax(logits, dim=-1))[0],
        "time_exec": "{:.2f}".format((time.time() - start_time))
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    print(json.loads(response.get_data().decode("utf-8")))
    return response

if __name__ == '__main__':
    #context = ('localhost.crt', 'localhost.key')#certificate and key files
    # run app in debug mode on port 5000
    app.run(host='0.0.0.0', port=80, debug=True)


