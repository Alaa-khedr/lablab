import speech_recognition as sr
import pyaudio
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start-recording')
def start_recording():
    recognizer = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            print("Say something...")
            audio = recognizer.listen(source)
        
        text = recognizer.recognize_google(audio)
        print("You said:", text)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        print("Sorry, I could not understand what you said.")
        return jsonify({"text": "Unknown value error"})
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        return jsonify({"text": "Request error"})

if __name__ == '__main__':
    app.run(debug=True)
