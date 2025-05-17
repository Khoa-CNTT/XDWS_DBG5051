from flask import Flask, request, jsonify # type: ignore
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import random

# Load dữ liệu và huấn luyện mô hình
# df = pd.read_csv("training_data.csv")
df = pd.read_csv(r"d:\XDWS_DBG5051\BE\Trainning_Chatbox\training_data.csv")
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(df['pattern'], df['intent'])

# Tạo Flask app
app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')
    intent = model.predict([user_input])[0]
    responses = df[df['intent'] == intent]['response'].tolist()
    response_text = random.choice(responses) if responses else "Xin lỗi, tôi chưa hiểu."
    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(debug=True)
