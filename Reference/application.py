from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/home/')
def home():
	return render_template('home.html')

@app.route('/result/<postid>')
def result(postid=None):
	return render_template('result.html', postid=postid)

@app.route('/getFriends/')
def getFriends():
	return render_template('getFriends.html')

if __name__=='__main__':
	app.run()