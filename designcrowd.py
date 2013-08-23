from flask import Flask
from flask import render_template, request, url_for, jsonify, redirect
import requests, re
from urlparse import urljoin
from flask.ext.sqlalchemy import SQLAlchemy
import os.path, os
import base64


app = Flask(__name__)
app.debug = True
base_dir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(base_dir, 'templates/upload')
UPLOAD_IMAGE_FOLDER = os.path.join(base_dir, 'static/image_upload')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'designcrowd.db') 
db = SQLAlchemy(app)


HTML_REGEX = re.compile(r'((?:src|action|href)=["\'])/')
JQUERY_REGEX = re.compile(r'(\$\.(?:get|post)\(["\'])/')
JS_LOCATION_REGEX = re.compile(r'((?:window|document)\.location.*=.*["\'])/')
CSS_REGEX = re.compile(r'(url\(["\']?)/')

REGEXES = [HTML_REGEX, JQUERY_REGEX, JS_LOCATION_REGEX, CSS_REGEX]

class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    templateID = db.Column(db.String(200))
    posts = db.relationship('Post', backref='template', lazy='dynmaic', cascade='all, delete, delete-orphan')

    def __init__(self, templateID):
        self.templateID = templateID

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	userID = db.Column(db.String(100), unique=True)
	posts = db.relationship('Post', backref='user', lazy='dynamic', cascade="all, delete, delete-orphan")

	def __init__(self, userID):
		self.userID = userID

	def __repr__(self):
		return '<User %r>' % self.userID

class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	postID = db.Column(db.String(200))
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	template_id = db.Column(db.Integer, db.ForeignKey('template.id'))

	def __init__(self, postID):
		self.postID = postID

db.create_all()

@app.route('/')
def index_view():
	return render_template('index.html')

@app.route('/dragify/')
def test_view():
	host = request.args.get('w');
	return render_template('main.html', frame_src=host)

@app.route('/proxy/<path:other>')
def proxy(other):
    r = requests.get('http://'+other)
    root = u'/proxy/' + other
    modified_content = r.content
    root = url_for('.proxy', other=other)
    print root
    for regex in REGEXES:
    	modified_content = regex.sub(r'\1%s' % root, modified_content)
    	print regex.match(r.content)
    return modified_content

@app.route('/deluxe_templates/')
def deluxe_templates():
	return render_template('deluxe_templates.html')

@app.route('/upload', methods=['POST'])
def upload():
	if request.method == 'POST':
		f = request.files['blobfile']
		filename = request.form['fname']
		userID = request.form['uid']
		url = request.form['url']
		url = url.split('/')[-2]
		f.save(os.path.join(UPLOAD_FOLDER, filename))
		user = User.query.filter_by(userID=userID).first()
        if not user:
            user = User(userID)
            db.session.add(user)
        template = Template.query.filter_by(templateID=url).first()
        if not template:
        	template = Template(url)
        	db.session.add(template)
        # user.posts.append(Post(filename))
        post = Post(filename)
        user.posts.append(post)
        template.posts.append(post)
        db.session.commit()
        resultURL = "http://csclab12.cs.nthu.edu.tw/result/" + url
        return jsonify(url="/resultpage/" + url)
		# return os.path.join(UPLOAD_FOLDER, filename)

@app.route('/uploadImage', methods=['POST'])
def uploadImage():
	image = request.form['image']
	filename = request.form['fname']
	#userID = request.form['uid']
	f = open(os.path.join(UPLOAD_IMAGE_FOLDER, filename), "w")
	f.write(base64.decodestring(image))
	f.close()
	return "GREAT"



@app.route('/result/<templateID>', methods=['GET'])
def result(templateID):
	template = Template.query.filter_by(templateID=templateID).first()
	if not template:
		return jsonify(error="true")
	else:
		posts = map(lambda x: [x.postID, x.user.userID] ,template.posts)
		return jsonify(post=posts)

@app.route('/resultpage/<templateID>', methods=['GET'])
def resultPage(templateID):
	return render_template("resultpage.html", filename=templateID+".html")


@app.route('/new/', methods=['GET'])
def newpage():
	return render_template('new.html')

@app.route('/ilms/', methods=['GET'])
def ilms():
	return render_template('ilms.html')

@app.route('/webpage/<postID>', methods=['GET'])
def get_webpage(postID):
	post = Post.query.filter_by(postID=postID).first()
	if not post:
		return "not exist page"
	else:
		return render_template('/upload/' + postID)

@app.route('/get_started/')
def start():
	return render_template('get_started.html')
	
# @app.route('/result/<postid>')
# def result(postid=None):
# 	return render_template('result.html', postid=postid)

if __name__ == '__main__':
	app.run()
