import os
from collections import deque
from itertools import permutations
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory, jsonify

app = Flask(__name__)
app.config.from_pyfile('flaskapp.cfg')

SHRUTHIS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
RAGAS = [["mohanam","101010010100"], 
         ["madhyamavati", "101001010010"],
         ["hindolam", "100101001010"],
         ["shuddha saveri", "101001010100"],
         ["shuddha dhanyasi", "100101010010" ] ]
SWARAS = ["Sa", "Ri 1", "Ri 2", "Ga 1", "Ga 2", 
          "Ma 1", "Ma 2", "Pa", "Dha 1", "Dha 2", 
          "Ni 1", "Ni 2"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/', resource)

@app.route('/shrutis',methods=['GET'])
def showShrutis():
  return jsonify(SHRUTHIS)

@app.route('/ragas',methods=['GET'])
def showShruthis():
  return jsonify([raga[0] for raga in RAGAS])

@app.route('/transposes',methods=['GET'])
def showTransposes():
  shruthi = request.args.get('shruthi', '')
  raga = request.args.get('raga', '')

  return jsonify(_formatted_transposes(shruthi, raga))

def _formatted_transposes(shruthi, raga):
  return dict(transposes = _find_transposes(shruthi, raga), 
                          main_shruthi = shruthi, 
                          main_raga = raga)

def _find_transposes(shruthi, raga):
  #find raga code
  raga_code = next(r[1] for r in RAGAS if r[0] == raga)
  swara_iterator = deque(SWARAS)
  shruti_iterator = deque(SHRUTHIS)
  while shruthi != shruti_iterator[0]:
    shruti_iterator.rotate(1)

  codes = [dict(shruthi = shruti_iterator[0], 
                raga_code = raga_code,
                swara_code = swara_iterator[0]
                )]

  raga_iterator = deque(raga_code)

  condition = True
  while condition:
      shruti_iterator.rotate(-1)
      raga_iterator.rotate(-1)      
      swara_iterator.rotate(1)
      new_raga_code = "".join(raga_iterator)
      # loop body here
      condition = new_raga_code != raga_code
      if condition and raga_iterator[0] == "1":
        codes.append(dict(shruthi = shruti_iterator[0],
                          raga_code = new_raga_code,
                          swara_code = swara_iterator[0] 
                          )) 
  for code in codes:
    code["raga"] = next(r[0] for r in RAGAS if r[1] == code["raga_code"])
  return codes

@app.route("/test")
def test():
    return "<strong>It's Alive!</strong>"

if __name__ == '__main__':
    app.run()
