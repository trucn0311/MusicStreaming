
from flask import Flask, render_template, url_for, redirect, send_file, jsonify, request
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate


##The following block contains the app  


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'thisisasecretkey'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
socketio = SocketIO(app)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

    
song_files = [
    "wave/Back 2 Boston.wav", "wave/Café rough.wav" , "wave/Call On.wav" , "wave/Mixed Signals.wav",
    "wave/Reminiscing.wav" , "wave/Serenity.wav"
    ] 
current_song_index = 0

song_art = [
    "Artwork/Back 2 Boston.jpg", "Artwork/Café rough.jpg" , "Artwork/Call On.jpg" , "Artwork/Mixed Signals.jpg",
    "Artwork/Reminiscing.jpg" , "Artwork/Serenity.jpg"
    ] 


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    firstname = db.Column(db.String(50), nullable=True) # add the country column
    lastname = db.Column(db.String(50), nullable=True) # add the country column
    password = db.Column(db.String(80), nullable=False)
    country = db.Column(db.String(50), nullable=True) # add the country column
   
class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    artist = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    image_path = db.Column(db.String(255), nullable=True)
    

db.create_all() 

# insert songs
# song = Song(name="Kill Bill", artist='SZA', file_path="static/Kill Bill.mp3")
# # song = Song(name="Serenity", artist='HashBrown', file_path="static/Serenity.wav", image_path="static/images/Serenity.JPG")
# db.session.add(song)
# db.session.commit()


# This is to remove songs
# song_id = 13 # replace with the id of the song you want to delete
# song = Song.query.get(song_id)  # load the song object by its id
# if song is not None:
#     db.session.delete(song)  # delete the song object
#     db.session.commit()  # commit the changes to the database

    
# user control section (delete)
# user_to_delete = User.query.filter_by(username='jarnell').first()
# if user_to_delete is not None:
#     db.session.delete(user_to_delete)
#     db.session.commit()
#     print(f"User with username {user_to_delete.username} has been deleted!")
# else:
#     print("User not found in the database.")

class RegisterForm(FlaskForm):

    username = StringField(validators=[
                           InputRequired(), Length(min=5, max=20)], render_kw={"placeholder": "Username"})

    firstname = StringField(validators=[InputRequired(), Length(max=50)], render_kw={"placeholder": "First Name"})

    lastname = StringField(validators=[InputRequired(), Length(max=50)], render_kw={"placeholder": "Last Name"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=5, max=20)], render_kw={"placeholder": "Password"})
   
    country = StringField(validators=[InputRequired(), Length(max=50)], render_kw={"placeholder": "Country"})

    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValueError(
                'That username already exists. Please choose a different one.')
        

class LoginForm(FlaskForm):

    username = StringField(validators=[
                           InputRequired(), Length(min=5, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=5, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')

#  route that serves an audio file
# @app.route('/play_audio')
# def play_audio():
#     # Replace the file path below with the path to your audio file
#     audio_file = "static/That's What I Like.mp3"  
#     return send_file(audio_file, mimetype='audio/mp3')


# # route for the page that will display the artist name and song name.
# @app.route('/song')
# def get_song_info():
#     # Send a GET request to the API endpoint
#     url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0ad0ac8cebf05b07eb961b5e492be718&artist=cher&track=believe&format=json"
#     response = requests.get(url)
#     data = response.json()

#     # Extract the artist name and song name from the parsed JSON data
#     artist_name = data['track']['artist']['name']
#     song_name = data['track']['name']

#     # Return the artist name and song name as a JSON response
#     return jsonify(artist_name=artist_name, song_name=song_name)



@app.route('/', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('home'))
    return render_template('login.html', form=form)



@app.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    song_path = None
    artist_name = None
    song_name = None
    image_path = None
    if request.method == 'POST':
        song_name = request.form.get('song_name')
        if song_name:
            # Extract the first 3 words from the song name
            first_3_words = ' '.join(song_name.split()[:3])
            # Query the database for the song with the matching name
            song = Song.query.filter(Song.name.ilike(f'%{first_3_words}%')).first()
            if song:
                song_path = url_for('static', filename=song.file_path)
                artist_name = song.artist
                song_name = song.name
                image_path = song.image_path

    return render_template('home.html', name = current_user.username, firstname = current_user.firstname,lastname= current_user.lastname, country = current_user.country, song_path=song_path, artist_name=artist_name,song_name=song_name, image_path=image_path)
    
@socketio.on('play_song')
def handle_play_song(song_path):
    # Code to play the song
    emit('song_started')

@socketio.on('stop_song')
def handle_stop_song():
    # Code to stop the song
    emit('song_stopped')



@app.route('/playlist', methods=['GET', 'POST'])
@login_required
def playlist():
    return render_template('playlist.html' , name = current_user.username, firstname = current_user.firstname,lastname= current_user.lastname, country = current_user.country)

@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    return render_template('account.html' , name = current_user.username, firstname = current_user.firstname,lastname= current_user.lastname, country = current_user.country)

@app.route('/setting', methods=['GET', 'POST'])
@login_required
def setting():
    return render_template('setting.html' , name = current_user.username, firstname = current_user.firstname,lastname= current_user.lastname, country = current_user.country)


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@ app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, firstname = form.firstname.data, lastname = form.lastname.data, password=hashed_password, country = form.country.data)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))

    return render_template('register.html', form=form)


if __name__ == "__main__":
    app.run(debug=True)


