from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import main

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ping', methods=['GET'])
def ping():
    try:
        result = main.ping()
        return jsonify({"success": True, "message": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/create-interview', methods=['POST'])
def create_interview():
    try:
        interview_id, interview_link = main.create_interview_link()
        return jsonify({
            "success": True, 
            "interview_id": interview_id, 
            "interview_link": interview_link
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/interview-results', methods=['GET'])
def get_results():
    try:
        results = main.get_interview_results()
        return jsonify({"success": True, "results": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 