import os
from itertools import permutations
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory, jsonify

app = Flask(__name__)
app.config.from_pyfile('flaskapp.cfg')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/', resource)

@app.route('/transposes',methods=['GET'])
def showTransposes():
  shruthi = request.args.get('shruthi', '')
  raga = request.args.get('raga', '')

  return jsonify(_formatted_transposes(shruthi, raga))

def _formatted_transposes(shruthi, raga):
  return dict(transposes = [ dict(shruthi = shruthi, raga = raga) ])

@app.route("/test")
def test():
    return "<strong>It's Alive!</strong>"

if __name__ == '__main__':
    app.run()
