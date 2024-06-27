from flask import Flask, flash, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from flask_socketio import SocketIO, emit, join_room, leave_room, send, SocketIO
import random
from string import ascii_uppercase
from datetime import datetime, timedelta, timezone
from flask import abort
from flask_mail import Mail, Message
import socketio
from sqlalchemy.orm import relationship
from flask_login import current_user
from flask_migrate import Migrate
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dateutil.relativedelta import relativedelta
from sqlalchemy import PickleType
from werkzeug.utils import secure_filename
import os 

#Create a scheduler instance
scheduler = BackgroundScheduler()
scheduler.start()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # SQLite

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Your SMTP server address
app.config['MAIL_PORT'] = 587  # Port for SMTP (usually 587 for TLS)
app.config['MAIL_USE_TLS'] = True  # Enable TLS
app.config['MAIL_USERNAME'] = 'simride529@gmail.com' 
app.config['MAIL_PASSWORD'] = 'kcxd goaj qhlu vxdw'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)
socketio = SocketIO(app)

# Define your models
class Report(db.Model):
    case_number = db.Column(db.Integer, primary_key=True)
    report_details = db.Column(db.String(255))
    reporting_user_username = db.Column(db.String(50))  
    reported_user_username = db.Column(db.String(50)) 
    date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='Open')

    def __init__(self, report_details, reporting_user_username, reported_user_username, date, status):
        self.report_details = report_details
        self.reporting_user_username = reporting_user_username
        self.reported_user_username = reported_user_username
        self.date = date
        self.status = status


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_username = db.Column(db.String(50))  
    user_type = db.Column(db.String(10))  # 'driver' or 'rider'
    question_text = db.Column(db.String(200))
    answer_text = db.Column(db.String(200), nullable=True)

# Model for FAQs
class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.Text, nullable=False)


# Define User and Ride models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    addresses = db.relationship('Address', backref='user', lazy=True)
    email = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer)
    birthday = db.Column(db.Date)
    gender = db.Column(db.String(10))
    phone = db.Column(db.String(15), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='active') 
    room_id = db.Column(db.String(20), nullable=False, unique=True, default=lambda: User.generate_unique_code())
    emergency_contacts = db.relationship('Emergency_Contact', backref='user', lazy=True)


    def __init__(self, username, password, email, age, birthday, gender, phone, role, status):
        self.username = username
        self.password = password
        self.email = email
        self.age = age
        self.birthday = birthday
        self.gender = gender
        self.phone = phone
        self.role = role
        self.status = status

    @staticmethod
    def generate_unique_code(length=4):
        import string
        return ''.join(random.choices(string.ascii_uppercase, k=length))

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def init(self, name, address, user_id):
        self.name = name
        self.address = address
        self.user_id = user_id

class Emergency_Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def init(self, name, phone, email, user_id):
        self.name = name
        self.phone = phone
        self.email = email
        self.user_id = user_id

class Ride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rider = db.Column(db.String(20))
    driver = db.Column(db.String(20))
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    seats_available = db.Column(db.Integer, nullable=False)
    gender_preference = db.Column(db.String(10))
    rider_response = db.Column(db.String(10))
    driver_response = db.Column(db.String(10))

    # Define relationship with RidePassenger
    passengers = relationship('RidePassenger', backref='ride', lazy=True)

class RidePassenger(db.Model):
    __tablename__ = 'ride_passenger'
    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    passenger_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Define relationship to User
    user = db.relationship('User', foreign_keys=[passenger_id])

    def __init__(self, ride_id, passenger_id):
        self.ride_id = ride_id
        self.passenger_id = passenger_id

# Define the Car model
class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    license_plate = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, make, model, year, license_plate, user_id):
        self.make = make
        self.model = model
        self.year = year
        self.license_plate = license_plate
        self.user_id = user_id

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating  = db.Column(db.Integer, nullable=False, default=5)
    num_of_ratings = db.Column(db.Integer, nullable=False, default=1)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def init(self, rating, num_of_ratings, user_id):
        self.rating = rating
        self.num_of_ratings = num_of_ratings
        self.user_id = user_id

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    reviewed_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviewed_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    review = db.Column(db.Text, nullable=True)
    
class RideSchedulingPattern(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver = db.Column(db.String(50), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    seats_available = db.Column(db.Integer, nullable=False)
    recurrence_pattern = db.Column(db.String(20), nullable=False)  
    specific_days = db.Column(PickleType)  # Use PickleType to store Python objects
    booked_by = db.Column(db.String(50), nullable=True)

class OfferedScheduledRide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver = db.Column(db.String(50), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    seats_available = db.Column(db.Integer, nullable=False)
    booked_by = db.Column(db.String(50), nullable=True)
    pickup_point = db.Column(db.String(50), nullable=True)
    
class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())
    
    # Add foreign key to reference User model
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('images', lazy=True))

class RideRequestPattern(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rider = db.Column(db.String(50), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    number_of_passengers = db.Column(db.Integer, nullable=False)
    recurrence_pattern = db.Column(db.String(20), nullable=False)  
    specific_days = db.Column(PickleType)  # Use PickleType to store Python objects
    driver = db.Column(db.String(50), nullable=True)
    
class RequestedScheduledRide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rider = db.Column(db.String(50), nullable=False)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    number_of_passengers = db.Column(db.Integer, nullable=False)
    driver = db.Column(db.String(50), nullable=True)
    driver_origin = db.Column(db.String(50), nullable=True)

with app.app_context():
  db.create_all()
    
@app.route('/')
def index():
    return render_template('index.html')

# Function to generate OTP
def generate_otp():
    return str(random.randint(1000, 9999))

def send_otp(email, otp):
    try:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        msg = Message('Forgot Password OTP', sender=('SIMRide', 'simride529@gmail.com'), recipients=[email])
        msg.html = f"""
        <p>Dear User,</p>
        <p>Below is your one-time-passcode (OTP):</p>
        <p style="font-size: 24px; color: red;">{otp}</p>
        <p>Please use this OTP to reset your password. The OTP is valid for 2 minutes.</p>
        <p>OTP generated at {current_time}.</p>
        <p>Thank you,<br>The SIMRide Team</p>
        """
        mail.send(msg)
        return True  # Email sent successfully
    except Exception as e:
        print(f"Error sending SOS email: {e}")
        return False  # Failed to send email

def send_sos_email(emergency_email, user_name, user_phone, latitude, longitude):
    try:
        map_url = f"https://www.google.com/maps?q={latitude},{longitude}"
    
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
        msg = Message('SOS Alert', sender=('SIMRide', 'simride529@gmail.com'), recipients=[emergency_email])
        msg.html = f"""
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }}
                .alert-box {{
                    border: 2px solid #ff0000;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }}
                .alert-box strong {{
                    color: #ff0000;
                }}
                .user-info {{
                    font-size: 15px;
                    margin-bottom: 10px;
                }}
                .timestamp {{
                    font-size: 15px;
                    color: #888;
                }}
            </style>
        </head>
        <body>
            <div class="alert-box">
                <p style="font-size: 16px;"><strong>Emergency SOS Alert:</strong></p>
                <p>This is an urgent SOS alert from SIMRide. Immediate action is required!</p>
                <div class="user-info">
                    <p><strong>Username:</strong> {user_name}</p>
                    <p><strong>Contact Number:</strong> {user_phone}</p>
                    <p><strong>Current Location:</strong> <a href="{map_url}" target="_blank">View on Google Maps</a></p>
                </div>
                <p class="timestamp">Time sent: {timestamp}</p>
                <p style="font-size: 14px; color: #888;">(This is an automated message. Do not reply.)</p>
            </div>
        </body>
        </html>
        """
        mail.send(msg)
        return True  # Email sent successfully
    except Exception as e:
        print(f"Error sending SOS email: {e}")
        return False  # Failed to send email

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        username_or_email = request.form['username_or_email']
        user = User.query.filter_by(username=username_or_email).first() or User.query.filter_by(email=username_or_email).first()

        if user:
            otp = generate_otp()

            session['reset_username'] = user.username
            session['reset_otp'] = otp
            session['otp_timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            send_otp(user.email, otp)
            flash('An OTP has been sent to your email. Please check and enter it below.', 'info')
            return redirect(url_for('verify_otp'))
        
        else:
            flash('Username or email not found. Please try again.', 'error')

    return render_template('forgot_password.html') 

@app.route('/verify-otp', methods=['GET', 'POST'])
def verify_otp():
    if 'reset_username' not in session or 'reset_otp' not in session:
        return redirect(url_for('forgot_password'))

    if request.method == 'POST':
        otp = request.form['otp']
        
        if otp == session['reset_otp']:
            now = datetime.now()
            otp_timestamp_str = session.get('otp_timestamp')  
            
            if otp_timestamp_str:                
                otp_timestamp = datetime.strptime(otp_timestamp_str, "%Y-%m-%d %H:%M:%S")
                if (now - otp_timestamp) <= timedelta(minutes=2):
                    session['reset_otp_verified'] = True
                    return redirect(url_for('reset_password'))
                else:
                    flash('OTP has expired. Please request a new one.', 'error')
            else:
                flash('OTP timestamp not found in session.', 'error')
                return redirect(url_for('forgot_password'))
        else:
            flash('Invalid OTP. Please try again.', 'error')

    return render_template('verify_otp.html')

@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if 'reset_username' not in session or 'reset_otp_verified' not in session or not session['reset_otp_verified']:
        return redirect(url_for('forgot_password'))

    if request.method == 'POST':
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if new_password != confirm_password:
            flash('New password and Confirm New Password do not match. Please try again.', 'error')
            return redirect(url_for('reset_password'))

        user = User.query.filter_by(username=session['reset_username']).first()
        if user:
            user.password = new_password

            if (len(new_password) < 8
                or not any(char.isdigit() for char in new_password)
                or not any(char.islower() for char in new_password)
                or not any(char.isupper() for char in new_password)
            ):
                flash('Password must be at least 8 characters, include at least one number, one uppercase letter and one lowercase letter.')

            else:
                db.session.commit()
                flash('Password reset successful! You can now log in with your new password.', 'success')

                session.pop('reset_username')
                session.pop('reset_otp')
                session.pop('reset_otp_verified')
                return redirect(url_for('login'))

    return render_template('reset_password.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username, password=password).first()
        if user:
            if user.status == 'suspended':
                flash('Your account is temporarily suspended. Please contact the administrator for further assistance.', 'error')
                return redirect(url_for('login'))

            if user.status == 'banned':
                flash('Your account is permanently banned from the platform. Please contact the administrator for further assistance.', 'error')
                return redirect(url_for('login'))

            if user.status != 'active':
                flash('Your account is not active. Please contact the administrator.', 'error')
                return redirect(url_for('login'))
            
            session['username'] = username
            if username == 'Admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('driver_or_rider'))

        else:
                flash('Invalid username or password. Please try again.', 'error')
                return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        address = request.form['address']
        email = request.form['email']
        age = request.form['age']
        birthday = request.form['birthday']
        gender = request.form['gender']
        phone = request.form['phone']
        emergency_phone = request.form['emergency_phone']
        emergency_email = request.form['emergency_email']
        
        session['form_data'] = {
            'username': username,
            'password': password,
            'confirm_password' : confirm_password,
            'address': address,
            'email': email,
            'age': age,
            'birthday': birthday,
            'gender': gender,
            'phone': phone,
            'emergency_phone': emergency_phone,
            'emergency_email': emergency_email
        }
        
        if (len(password) < 8
            or not any(char.isdigit() for char in password)
            or not any(char.islower() for char in password) 
            or not any(char.isupper() for char in password) 
        ):
            flash('Password must be at least 8 characters, include at least one number, one uppercase letter and one lowercase letter.')
            return redirect(url_for('register'))
        
        if password != confirm_password:
            flash("Passwords do not match. Please try again.", "error")
            return redirect(url_for('register'))
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists. Please choose a different one.', 'error')
            return redirect(url_for('register'))
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            flash('Email already exists. Please choose a different one.', 'error')
            return redirect(url_for('register'))
        
        existing_phone = User.query.filter_by(phone=phone).first()
        if existing_phone:
            flash('Phone already exists. Please choose a different one.', 'error')
            return redirect(url_for('register'))

        new_user = User(
            username=username,
            password=password,
            email=email,
            age=int(age) if age else None,
            birthday=datetime.strptime(birthday, '%Y-%m-%d').date() if birthday else None, 
            gender=gender,
            phone=phone,
            role='',
            status='active'
        )
        db.session.add(new_user)
        db.session.commit()
        
        new_address = Address(
            name='Registered Address',
            address=address,
            user_id=new_user.id
        )
        db.session.add(new_address)
        db.session.commit()

        new_emergency_contact = Emergency_Contact(
            name='Registered Emergenct Contact',
            phone=emergency_phone,
            email=emergency_email,
            user_id=new_user.id
        )
        db.session.add(new_emergency_contact)
        db.session.commit()

        new_rating = Rating(
            rating=5,
            num_of_ratings=1,
            user_id=new_user.id
        )
        db.session.add(new_rating)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        session.pop('form_data') 
        return redirect(url_for('login'))
    
    form_data = session.get('form_data', {})
    return render_template('register.html', form_data=form_data)

@app.route('/logout')
def logout():
    if 'username' in session:
        # Fetch the user from the database
        user = User.query.filter_by(username=session['username']).first()

        # Check if the user exists and update the role to empty
        if user:
            user.role = ''
            db.session.commit()

    # Clear the username from the session
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/driver_or_rider', methods=['GET', 'POST'])
def driver_or_rider():
    if request.method == 'POST':
        role = request.form.get('role')  
        session['role'] = role
        user = User.query.filter_by(username=session['username']).first()
        user.role = role
        db.session.commit()
        print("Role updated successfully:", role)  # Add a debug print
        return redirect(url_for('driver_dashboard' if role == 'Driver' else 'rider_dashboard'))

    return render_template('driver_or_rider.html', username=session['username'])

@app.route('/rider_dashboard')
def rider_dashboard():
    # Check if user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return render_template('rider_dashboard.html', error_message=error_message)
    
    # Fetch ride requests for the current rider
    ride_requests = Ride.query.filter_by(rider_response=None).all()
    rides = Ride.query.filter_by(rider=session['username']).all()

    
    return render_template('rider_dashboard.html', username=user.username, ride_requests=ride_requests, gender=user.gender, rides=rides)

@app.route('/driver_dashboard')
def driver_dashboard():
    # Check if user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return render_template('driver_dashboard.html', error_message=error_message)
    
    # Fetch rides offered by the current user
    rides = Ride.query.filter_by(driver=session['username']).all()
    return render_template('driver_dashboard.html', username=user.username, gender=user.gender, rides=rides)

@app.route('/admin_dashboard')
def admin_dashboard():
    # Check if user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()   
    return render_template('admin_dashboard.html', username=user.username)

@app.route('/settings')
def settings():
    # Check if user is logged in
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()
    ''' form = upload_image()
    if form.validate_on_submit():
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            user.image_file = picture_file
        db.session.commit()
        flash ('Your profile picture has been update!', 'success')
        return redirect(url_for('settings'))
    elif request.method == 'GET':
        image_file = url_for('uploads', filename='profile_pics/' + user.image_file) '''
            
    from sqlalchemy import desc

    image=Image.query.filter_by(user_id=user.id).order_by(desc(Image.id)).first()
    
    if user and image:
       ''' if request.method == 'GET':'''
       avatar_path = "/"+image.filepath
    else:
       avatar_path = None 
     
    # Fetch car associated with the user
    car = Car.query.filter_by(user_id=user.id).first()
    
    return render_template('settings.html', username=session['username'], car=car, avatar_path=avatar_path)

''' def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'static/profile_pics', picture_fn)
    output_size = (125,125)
    i = Image.open (form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)
    
    return picture_fn '''
    
UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['GET','POST'])
def upload_image():
    # Get username and image file from session and request
    username = session.get('username')
    image_file = request.files.get('file')

    if not image_file:
        return 'No image provided'

    if not username:
        return 'Username not found in session'

    # Save image to server
    filename = secure_filename(image_file.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(image_path)

    # Store image path and username in database
    user = User.query.filter_by(username=username).first()

    if user:
        # If the user exists, create a new Image instance and associate it with the user
        new_image = Image(
            filename=filename,
            filepath=image_path,
            description="User Profile Photo",  
            user=user  # Associate the image with the user
        )

        # Add the new image to the session and commit the transaction
        db.session.add(new_image)
        db.session.commit()
        return 'Image uploaded successfully'
    else:
        return 'User not found'
    
from flask import send_from_directory

@app.route('/upload/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    user = User.query.filter_by(username=session['username']).first()
    if request.method == 'POST':
        new_username = request.form['username']
        new_email = request.form['email']
        new_phone = request.form['phone']
         
        existing_user_with_username = User.query.filter(User.username == new_username, User.id != user.id).first()
        if existing_user_with_username:
            flash('Username already exists. Please choose a different one.', 'error')
            return redirect(url_for('profile'))
            
        existing_user_with_email = User.query.filter(User.email == new_email, User.id != user.id).first()
        if existing_user_with_email:
            flash('Email already exists. Please choose a different one.', 'error')
            return redirect(url_for('profile'))
            
        existing_user_with_phone = User.query.filter(User.phone == new_phone, User.id != user.id).first()
        if existing_user_with_phone:
            flash('Phone already exists. Please choose a different one.', 'error')
            return redirect(url_for('profile'))
            
        else:
            if new_username != session['username'] or new_email != user.email or new_phone != user.phone or request.form['age'] != str(user.age) or request.form['birthday'] != str(user.birthday) or request.form['gender'] != user.gender:
                 # Update profile data
                if new_username != session['username']:
                    session['username'] = new_username
                    user.username = new_username
                    db.session.commit() 
                    flash('Username changed successfully. Please log in again with the new username.', 'success')
                    return redirect(url_for('login'))
                
                else:
                    user.email = new_email
                    user.age = request.form['age']
                    user.age = int(user.age) if user.age else None
                    user.birthday = request.form['birthday']
                    user.birthday = datetime.strptime(user.birthday, '%Y-%m-%d').date() if user.birthday else None
                    user.gender = request.form['gender']
                    user.phone = new_phone        
                    db.session.commit()
                    flash('Profile updated successfully!', 'success')
            
    return render_template('profile.html', user=user)

@app.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    user = User.query.filter_by(username=session['username']).first()
    if request.method == 'POST':
        current_password = request.form['current_password']
        new_password = request.form['new_password']
        confirm_new_password = request.form['confirm_new_password']
        
        session['form_data'] = {
            'current_password': current_password,
            'new_password' : new_password,
        }

        if user and user.password == current_password:
            
            if (len(new_password) < 8
                or not any(char.isdigit() for char in new_password) 
                or not any(char.islower() for char in new_password)  
                or not any(char.isupper() for char in new_password) 
            ):
                flash('Password must be at least 8 characters, include at least one number, one uppercase letter and one lowercase letter.')
                return redirect(url_for('change_password'))
            
            if new_password == current_password:
                flash('New password cannot be same as Current Password! Please try again.')
                return redirect(url_for('change_password'))
                
            if new_password == confirm_new_password:
                user.password = new_password
                db.session.commit()
                session.pop('form_data')
                flash('Password changed successfully! You can now log in with your new password.', 'success')
                return redirect(url_for('login'))
            
            else:
                flash('New password and Confirm New Password do not match. Please try again.', 'error')
                
        else:
            flash('Incorrect current password. Please try again.', 'error')
    
    form_data = session.get('form_data', {})
    return render_template('change_password.html', form_data=form_data)

@app.route('/trip-history')
def trip_history():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    past_rides = Ride.query.filter(or_(Ride.driver == username, Ride.rider == username)).all()

    return render_template('trip_history.html', past_rides=past_rides, username=username)
    
@app.route('/saved-address', methods=['GET', 'POST'])
def saved_address():
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    if request.method == 'POST':
        name = request.form['name']
        address = request.form['address']
        
        new_address = Address(
            name=name, 
            address=address, 
            user_id=user.id
        )
        db.session.add(new_address)
        db.session.commit()
        flash('Address added successfully!', 'success')
        return redirect(url_for('saved_address'))

    return render_template('saved_address.html', user=user)

@app.route('/delete_address/<int:address_id>', methods=['POST'])
def delete_address(address_id):
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    address = Address.query.filter_by(id=address_id, user_id=user.id).first()

    if address:
        db.session.delete(address)
        db.session.commit()
        return redirect(url_for('saved_address'))

@app.route('/edit-address/<int:address_id>', methods=['GET', 'POST'])
def edit_address(address_id):
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    address = Address.query.filter_by(id=address_id, user_id=user.id).first()

    if request.method == 'POST':
        address.name = request.form['name']
        address.address = request.form['address']
        db.session.commit()
        flash('Address updated successfully!', 'success')
        return redirect(url_for('saved_address'))
    
    return render_template('edit_address.html', address=address)

@app.route('/emergency_contact', methods=['GET', 'POST'])
def emergency_contact():
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    if request.method == 'POST':
        if len(user.emergency_contacts) >= 3:
            flash('You already have the maximum number of emergency contacts.', 'error')
            return redirect(url_for('emergency_contact'))

        name = request.form['name']
        phone = request.form['phone']
        email = request.form['email'] 

        new_contact = Emergency_Contact(
            name=name,
            phone=phone,
            email=email,
            user_id=user.id
        )
        db.session.add(new_contact)
        db.session.commit()
        flash('Emergency contact added successfully!', 'success')
        return redirect(url_for('emergency_contact'))

    return render_template('emergency_contact.html', user=user)

@app.route('/delete_emergency_contact/<int:contact_id>', methods=['POST'])
def delete_emergency_contact(contact_id):
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    contact = Emergency_Contact.query.filter_by(id=contact_id, user_id=user.id).first()

    if contact:
        db.session.delete(contact)
        db.session.commit()
        return redirect(url_for('emergency_contact'))
    
@app.route('/edit_emergency_contact/<int:contact_id>', methods=['GET', 'POST'])
def edit_emergency_contact(contact_id):
    if 'username' not in session:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=session['username']).first()
    contact = Emergency_Contact.query.filter_by(id=contact_id, user_id=user.id).first()

    if not contact:
        flash('Emergency contact not found.', 'error')
        return redirect(url_for('emergency_contact'))

    if request.method == 'POST':
        contact.name = request.form['name']
        contact.phone = request.form['phone']
        contact.email = request.form['email']  
        db.session.commit()
        flash('Emergency contact updated successfully!', 'success')
        return redirect(url_for('emergency_contact'))

    return render_template('edit_emergency_contact.html', contact=contact)

@app.route('/delete-account', methods=['GET', 'POST'])
def delete_account():
    if 'username' in session:
        user = User.query.filter_by(username=session['username']).first()

        if user:
            # Delete related records
            Address.query.filter_by(user_id=user.id).delete()
            Emergency_Contact.query.filter_by(user_id=user.id).delete()
            Ride.query.filter_by(driver=user.username).delete()
            Ride.query.filter_by(rider=user.username).delete()
            Car.query.filter_by(user_id=user.id).delete()
            Rating.query.filter_by(user_id=user.id).delete()  # Add this line to delete related ratings

            db.session.commit()

            # Delete the user
            db.session.delete(user)
            db.session.commit()

            # Clear the session and show a success message
            session.clear()
            flash('Your account has been deleted successfully.', 'success')
            return redirect(url_for('index'))

        else:
            flash('Failed to delete the account. Please try again later.', 'error')

    return redirect(url_for('settings'))
    
@app.route('/sos')
def sos():
    if 'username' in session:
        return render_template('sos.html')
    else:
        flash('User not logged in.', 'error')
        return redirect(url_for('index'))

@app.route('/sos-send', methods=['POST'])
def send_sos():
    if 'username' in session:
        user = User.query.filter_by(username=session['username']).first()

        if user and user.emergency_contacts:
            latitude = request.form.get('latitude')
            longitude = request.form.get('longitude')

            for emergency_contact in user.emergency_contacts:
                send_sos_email(emergency_contact.email, user.username, user.phone, latitude, longitude)
            flash('SOS email sent successfully.', 'success')
            return redirect(url_for('sos'))
            
        else:
            flash('No emergency contact found.', 'error')
            
    else:
        flash('User not logged in.', 'error')
    
    return redirect(url_for('index'))

@app.route('/offer_ride', methods=['GET', 'POST'])
def offer_ride():
    if 'username' not in session:
        return redirect(url_for('login'))

    username=session['username']
    
    user = User.query.filter_by(username=session['username']).first()
    saved_addresses = Address.query.filter_by(user_id=user.id).all()

    if request.method == 'POST':
        origin = request.form.get('origin')
        destination = request.form.get('destination')
        date = request.form.get('date')
        time = request.form.get('time')
        seats_available = int(request.form.get('seats_available'))
        gender_preference = request.form['gender']

        # Check if the selected origin and destination are from saved addresses
        if not (origin and destination):
            flash('Please select or enter both origin and destination.', 'error')
            return redirect(url_for('offer_ride'))

        new_ride = Ride(
            driver=session['username'], 
            origin=origin,
            destination=destination,
            date=date,
            time=time,
            seats_available=seats_available,
            gender_preference=gender_preference
        )

        try:
            db.session.add(new_ride)
            db.session.commit()
            # Pass the ride_id to the client as a JSON response
            return jsonify({'ride_id': new_ride.id})
        except Exception as e:
            # Log the exception for debugging
            print(e)
            return render_template('error.html', message="An error occurred while offering the ride. Please try again.")
    
    # This block handles a specific action if it's sent in the form
    elif request.method == 'POST' and request.form.get('action') == 'privateMessage':  
        user_room = User.query.filter_by(username=session['username']).first() 
        if user_room:
            room = user_room.room_id
            session['room'] = room
            return redirect(url_for('room', room=room))
        else:
            flash('User or room not found.', 'error')  # Optionally add a message for the user.
            return redirect(url_for('offer_ride'))

    return render_template('offer_ride.html', user=user, username=username, saved_addresses=saved_addresses)


@app.route('/view_route/<int:id>')
def view_route(id):
    if id == 0:
        # Handle the case where the ride ID is 0
        return render_template('error.html', message="Invalid ride ID")
    
    ride = Ride.query.get(id)
    if ride is None:
        # Handle the case where the ride with the specified ID does not exist
        return render_template('error.html', message="Ride not found")

    origin = ride.origin
    destination = ride.destination

    return render_template('view_route.html', origin=origin, destination=destination)

@app.route('/car_detail', methods=['GET', 'POST'])
def car_detail():
    if request.method == 'POST':
        make = request.form['make']
        model = request.form['model']
        year = request.form['year']
        license_plate = request.form['license_plate']        
        # Retrieve the username from the session
        username = session.get('username')
        
        # Ensure username is set in the session
        if username is None:
            # Handle case where username is not set in session
            # Redirect to login or handle the error accordingly
            return redirect(url_for('login'))
        
        # Find the user based on the username
        user = User.query.filter_by(username=username).first()
        
        # Ensure user exists
        if user is None:
            # Handle case where user does not exist
            # Redirect to login or handle the error accordingly
            return redirect(url_for('login'))
        
        # Retrieve the user ID associated with the user
        user_id = user.id
        
        # Create a new car with the retrieved user ID
        new_car = Car(make=make, model=model, year=year, license_plate=license_plate,  user_id=user_id)
        db.session.add(new_car)
        db.session.commit()
        
        return redirect(url_for('car_added_successfully'))  # Redirect to success page or any other route
        
    return render_template('car_detail.html')

@app.route('/car_added_successfully')
def car_added_successfully():
    return '''Car added successfully!<br>
            <a href="{}">Back to Driver Dashboard</a>'''.format(url_for('driver_dashboard'))

@app.route('/view_car/<int:car_id>')
def view_car(car_id):
    car = Car.query.get(car_id)
    return render_template('view_car.html', car=car)

@app.route('/edit_car/<int:car_id>', methods=['GET', 'POST'])
def edit_car(car_id):
    car = Car.query.get(car_id)
    if request.method == 'POST':
        car.make = request.form['make']
        car.model = request.form['model']
        car.year = request.form['year']
        car.license_plate = request.form['license_plate']
        db.session.commit()
        return redirect(url_for('view_car', car_id=car.id))
    return render_template('view_car.html', car=car)

@app.route('/delete_car/<int:car_id>', methods=['POST'])
def delete_car(car_id):
    car = Car.query.get(car_id)
    db.session.delete(car)
    db.session.commit()
    return redirect(url_for('driver_dashboard'))

# FAQs page for admin
@app.route('/faqs')
def faqs_page():
    faqs = FAQ.query.all()
    return render_template('faqs.html', faqs=faqs)

# FAQs page for user
@app.route('/view_faq')
def view_faq():
    faqs = FAQ.query.all()
    return render_template('view_faq.html', faqs=faqs)

# Route for adding a new FAQ
@app.route('/add_faq', methods=['GET', 'POST'])
def add_faq():
    if request.method == 'POST':
        new_faq = FAQ(
            question=request.form['question'],
            answer=request.form['answer']
        )
        try:
            db.session.add(new_faq)
            db.session.commit()
            return redirect(url_for('faqs_page'))
        except Exception as e:
            db.session.rollback()
            print(f"Error adding FAQ: {str(e)}")
    return render_template('add_faq.html')

@app.route('/update_faq/<int:faq_id>', methods=['GET', 'POST'])
def update_faq(faq_id):
    faq = FAQ.query.get_or_404(faq_id)
    if request.method == 'POST':
        faq.question = request.form['question']
        faq.answer = request.form['answer']
        try:
            db.session.commit()
            return redirect(url_for('faqs_page'))
        except Exception as e:
            db.session.rollback()
            print(f"Error updating FAQ: {str(e)}")
    return render_template('update_faq.html', faq=faq)

@app.route('/delete_faq/<int:faq_id>', methods=['POST'])
def delete_faq(faq_id):
    faq = FAQ.query.get_or_404(faq_id)
    try:
        db.session.delete(faq)
        db.session.commit()
        return redirect(url_for('faqs_page'))
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting FAQ: {str(e)}")

# Define a teardown function to remove the database session at the end of each request
@app.teardown_request
def teardown_request(exception=None):
    db.session.remove()
    

# Route for user management
@app.route('/user_management')
def user_management():
    search_query = request.args.get('search')
    if search_query:
        users = User.query.filter(or_(User.username.like(f'%{search_query}%'))).all()
        if not users:
            return render_template('user_management.html', users=[], no_results=True)
    else:
        users = User.query.all()
    return render_template('user_management.html', users=users, no_results=False)

@app.route('/ask_question', methods=['GET', 'POST'])
def ask_question():
    if request.method == 'POST':
        user = User.query.filter_by(username=session['username']).first()
        user_username = request.form['user_username']
        user_type = request.form['user_type']
        question_text = request.form['question_text']

        # Save the question if validation passes
        question = Question(user_username=user_username, user_type=user_type, question_text=question_text)
        db.session.add(question)
        db.session.commit()

        flash("Question submitted successfully.", 'success')
        return redirect(url_for('driver_dashboard' if user.role == 'Driver' else 'rider_dashboard'))

    return render_template('ask_question.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin_panel():
    if request.method == 'POST':
        question_id = request.form['question_id']
        answer_text = request.form['answer_text']

        question = Question.query.get(question_id)
        question.answer_text = answer_text
        db.session.commit()

        return redirect(url_for('admin_panel'))

    questions = Question.query.all()
    return render_template('admin_panel.html', questions=questions)

@app.route('/view_questions')
def view_questions():
    username = session.get('username')
    if username:
        # Retrieve questions asked by the current user
        questions = Question.query.filter_by(user_username=username).all()
        # Render the view_questions.html template and pass the questions data to it
        return render_template('view_questions.html', questions=questions)
    else:
        # Handle case where user is not logged in
        return redirect(url_for('login'))  # Redirect to login page or handle as appropriate
    
@app.route('/driver_rate_review', methods=['GET', 'POST'])
def driver_rate_review():
    drivername = request.args.get('drivername', None)
    user = User.query.filter_by(username=drivername).first()
    user_id = user.id
    rating = Rating.query.filter_by(user_id=user_id).first()
    print("rating id ", rating.user_id)
    if request.method == 'POST':
        rating.num_of_ratings += 1
        new_rating = int(request.form['rating'])
        rating.rating = (new_rating + rating.rating)/rating.num_of_ratings
        db.session.commit()  
        return redirect(url_for('rider_dashboard'))
    return render_template('driver_rate_review.html', drivername=drivername)

@app.route('/passenger', methods=['GET', 'POST'])
def passenger():
    username = session.get("username")
    if request.method == 'POST':
        # Handle the POST request here
        action = request.form.get('action')
        if action == 'privateMessage':
            user_room = User.query.filter_by(username=session['username']).first() 
            if user_room:
                room = user_room.room_id
                session['room'] = room
                return redirect(url_for('room', room=room))
            else:
                flash('User or room not found.', 'error')  # Optionally add a message for the user.
                return redirect(url_for('passenger'))

    return render_template('passenger.html', username=username)

    
@app.route('/book_ride', methods=['GET', 'POST'])
def book_ride():
    if 'username' not in session:
        return redirect(url_for('login'))
    username=session['username'] 
    room = session.get('room')
    
    user = User.query.filter_by(username=session['username'] ).first()
    saved_addresses = Address.query.filter_by(user_id=user.id).all()
    
    if request.method == 'POST':   
        action = request.form.get('action')
        if action == 'bookRide':
            origin = request.form['origin']
            destination = '461 Clementi Rd, Singapore 599491'
            seats_available = int(request.form['seats_available'])
            gender_preference = request.form['gender']
            current_datetime = datetime.now()  # Get the current datetime
            current_date = current_datetime.date().isoformat()  # Extract the date
            current_time = current_datetime.strftime("%H:%M")  # Extract the time
           
            new_ride = Ride(
                rider=session['username'],
                origin=origin,
                destination = destination,
                date=current_date,
                time=current_time,
                seats_available=seats_available,
                gender_preference=gender_preference
            )
            try:
                db.session.add(new_ride)
                db.session.commit()
                # Pass the ride_id to the client as a JSON response
                return jsonify({'ride_id': new_ride.id})
            except Exception as e:
                # Log the exception for debugging
                print(e)
                return render_template('error.html', message="An error occurred while offering the ride. Please try again.")
        
        elif action == 'privateMessage':  
            user_room = User.query.filter_by(username=session['username'] ).first() 
            if user_room:
                room = user_room.room_id
                session['room'] = room
            else:
                flash('User or room not found.', 'error')  # Optionally add a message for the user.
                return redirect(url_for('driver'))
            return redirect(url_for('room', room=room))

    return render_template('book_ride.html', user=user, username=username, saved_addresses=saved_addresses)

@app.route('/driver', methods=['GET', 'POST'])
def driver():
    username = request.args.get('username')
    gender = request.args.get('gender')

    user = User.query.filter_by(username=username).first()
    if user:
        user_id = user.id
        rating = Rating.query.filter_by(user_id=user_id).first()
        if rating:
            rating_star = rating.rating
        car = Car.query.filter_by(user_id=user.id).first()
        if car:
            make = car.make
            model = car.model
            year = car.year
            license_plate = car.license_plate
        else:
            flash('Car not found')
    # Redirect if POST request (assuming room is correctly set in the session)
    if request.method == 'POST':
        rightname = request.form.get('rightname')
        # Now you can use the rightname to query the user and their room_id
        user_room = User.query.filter_by(username=rightname).first()
        if user_room:
            room = user_room.room_id
            session['room'] = room
            return redirect(url_for('room', room=room))
        else:
            flash('User or room not found.', 'error')  # Optionally add a message for the user.
            return redirect(url_for('driver')) 
    return render_template('driver.html', username=username, gender=gender, make=make, model=model, year=year, license_plate=license_plate, rating_star=rating_star)
    

@socketio.on('offer_ride')
def handle_offer_ride(data):
    print('Received offer_ride:', data)
    gender_preference = data.get('gender')
    # Get the ride_id from the database
    ride_id = data.get('ride_id')  # Assuming ride_id is passed from the client-side
    # Filter drivers based on gender preference and role
    drivers = User.query.filter_by(role='Driver', gender=gender_preference).all()
    for driver in drivers:
        # Emit ride_offered event to selected drivers
        emit('ride_offered', {**data, 'ride_id': ride_id}, broadcast=True)  # Include ride_id in the data

rooms = {}

@socketio.on('accept_ride')
def handle_accept_ride(data):
    ride_id = data.get('ride_id')
    ride = Ride.query.get(ride_id)
    if ride:
        ride.rider = data.get('rightname')
        ride.driver = data.get('drivername')  # Assign driver's username to the ride
        ride.driver_response = 'accepted'
        ride.rider_response = 'accepted'
        db.session.commit()
    print('Ride accepted by driver:', data)
    # Notify all clients that a ride has been accepted (you would target the specific passenger in a real app)
    emit('ride_accepted', data, broadcast=True)

@socketio.on('driver_location')
def handle_driver_location(data):
    emit('location_of_driver', data, broadcast=True)

@socketio.on('book_ride')
def handle_book_ride(data):
    print('Received ride:', data)
    gender_preference = data.get('gender')
    # Get the ride_id from the database
    ride_id = data.get('ride_id')  # Assuming ride_id is passed from the client-side
    # Filter rider based on gender preference and role
    riders = User.query.filter_by(role='Rider', gender=gender_preference).all()
    for rider in riders:
        # Emit ride_offered event to selected rider
        emit('offer_ride_offered', {**data, 'ride_id': ride_id}, broadcast=True)  # Include ride_id in the data

@socketio.on('accept_offer_ride')
def handle_accept_offer_ride(data):
    print('Ride accepted by rider:', data)
    ride_id = data.get('ride_id')
    ride = Ride.query.get(ride_id)
    if ride:
        ride.rider = data.get('rider')
        ride.rider_response = 'accepted'
        ride.driver_response = 'accepted'
        db.session.commit()
        emit('offer_ride_accepted', data, broadcast=True)  # Emit ride_accepted event to the rider
    else:
        print('Ride with ID {} not found'.format(ride_id))

@app.route('/reject_ride', methods=['POST'])
def reject_ride():
    ride_id = request.form.get('ride_id')

    # Update the ride status in the database to "rejected"
    ride = Ride.query.get(ride_id)
    if ride:
        ride.rider_response = 'rejected'
        db.session.commit()
        return 'Ride has been rejected successfully'
    else:
        return 'Ride not found', 404

@socketio.on('cancel_ride')
def handle_cancel_ride(data):
    print('cancel ride', data)
    emit('ride_cancel', data, broadcast=True)

@socketio.on('cancel_offer_ride')
def handle_cancel_offer_ride(data):
    ride_id = data.get('ride_id')
    # Find the ride in the database
    ride = Ride.query.get(ride_id)
    if ride:
        # Update ride status to "cancelled"
        ride.rider_response = 'cancelled'
        ride.driver_response = 'cancelled'
        db.session.commit()
        # Emit event to notify both passenger and driver about cancellation
        emit('ride_cancelled', {'ride_id': ride_id}, broadcast=True)
    else:
        print('Ride with ID {} not found'.format(ride_id))

@socketio.on('end_trip')
def handle_end_trip(data):
    print('end trip', data)
    emit('trip_end', data, broadcast=True)

@app.route('/check_ride_requests')
def check_ride_requests():
    # Query the database to get a list of new ride requests
    ride_requests = Ride.query.filter_by(driver_response=None).all()
    # Convert ride requests to a list of dictionaries
    ride_requests_data = [{
        'id': ride.id,
        'origin': ride.origin,
        'destination': ride.destination
    } for ride in ride_requests]
    return jsonify(ride_requests_data)

@app.route('/check_for_ride_requests')
def check_for_ride_requests():
    # Query the database to get a list of new ride requests
    ride_requests = Ride.query.filter_by(rider_response=None).all()
    # Convert ride requests to a list of dictionaries
    ride_requests_data = [{
        'id': ride.id,
        'origin': ride.origin,
        'destination': ride.destination
    } for ride in ride_requests]
    return jsonify(ride_requests_data)

@app.route("/room")
def room():
    room = session.get("room")
    name = session.get("username")
    if not room or not name:
        return
    if room not in rooms:
        rooms[room] = {"members": 0, "messages": []}
    messages = []
    if room and room in rooms:
        messages = rooms[room].get("messages", [])

    return render_template("room.html", room=room, messages=messages)

@socketio.on("message")
def message(data):
    room = session.get("room")
    if room not in rooms:
        return 
    
    content = {
        "name": session.get("username"),
        "message": data["data"]
    }
    send(content, to=room)
    rooms[room]["messages"].append(content)
    print(f"{session.get('name')} said: {data['data']}")

@socketio.on("connect")
def connect():
    room = session.get("room")
    name = session.get("username")
    if not room or not name:
        return
    if room not in rooms:
         if room not in rooms:
            rooms[room] = {"members": 0, "messages": []}
    
    join_room(room)
    send({"name": name, "message": "has entered the room"}, to=room)
    rooms[room]["members"] += 1
    print(f"{name} joined room {room}")

@socketio.on('disconnect_request')
def disconnect_request():
    # Call your disconnect logic here
    disconnect()

@socketio.on("disconnect")
def disconnect():
    room = session.get("room")
    name = session.get("username")
    if room in rooms:
        rooms[room]["members"] -= 1
        if rooms[room]["members"] <= 0:
            del rooms[room]
    leave_room(room)
    send({"name": name, "message": "has left the room"}, to=room)
    print(f"{name} has left the room {room}")
    
# Route to activate user
@app.route('/activate_user/<int:user_id>')
def activate_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.status = 'active'
        db.session.commit()
    return redirect(url_for('user_management'))

# Route to suspend user
@app.route('/suspend_user/<int:user_id>')
def suspend_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.status = 'suspended'
        db.session.commit()
    return redirect(url_for('user_management'))

# Route to ban user
@app.route('/ban_user/<int:user_id>')
def ban_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.status = 'banned'
        db.session.commit()
    return redirect(url_for('user_management'))

@app.route('/make_report', methods=['GET', 'POST'])
def make_report():
    if request.method == 'POST':
        # Handle POST request
        report_details = request.form['report_details']
        reported_user_username = request.form['reported_user_username']
        reporting_user_username = request.form['reporting_user_username']
        date_str = request.form['date']
        role = request.form.get('role')
        session['role'] = role
        user = User.query.filter_by(username=session['username']).first()
        user.role = role
        
        # Converts date string to datetime object
        date = datetime.strptime(date_str, '%d/%m/%Y')
        
        # Assuming 'status' defaults to 'open'
        status = 'open'

        # Insert the report into the database
        with app.app_context():
            report = Report(report_details=report_details, 
                            reporting_user_username=reporting_user_username,
                            reported_user_username=reported_user_username,
                            date=date,
                            status=status)
            db.session.add(report)
            db.session.commit()

        flash("Report submitted successfully.", 'success')
        return redirect(url_for('driver_dashboard' if user.role == 'Driver' else 'rider_dashboard'))

   # Handle GET request or rendering the form
    current_username = session.get('username')
    users = User.query.filter(User.username != current_username, User.username != "Admin").all()
    return render_template('make_report.html', users=users, now=datetime.now())

@app.route('/report_submitted')
def report_submitted():
    return 'Report submitted successfully.'

@app.route('/user_reports', methods=['GET', 'POST'])
def user_reports():
    # Fetch all reports from the database
    user_reports_data = Report.query.all()
    
    if request.method == 'POST':
        # Handle form submission to update report status
        for report in user_reports_data:
            status_key = f"status_{report.case_number}"
            new_status = request.form.get(status_key)
            # Update the status of the report in the database
            report_obj = Report.query.filter_by(case_number=report.case_number).first()
            if report_obj:
                report_obj.status = new_status
                db.session.commit()
        # Redirect to the same page after processing the form
        return redirect(url_for('user_reports'))
    else:
        # Handle GET request to render the user_reports.html template
        return render_template('user_reports.html', user_reports_data=user_reports_data)

@app.route('/driver_chat')
def driver_chat():
    username = request.args.get('username')
    if not username:
        return render_template('error.html', message="Username not provided")
    
    # Render the driver chat room template with the username
    return render_template('driver_chat.html', username=username)

@socketio.on('join_common_room')
def handle_join_common_room():
    room = 'common_room'  # Use a common room name
    join_room(room)
    emit('message', {'username': 'System', 'message': 'You have joined the common room.'}, room=room)

@socketio.on('leave_common_room')
def handle_leave_common_room():
    room = 'common_room'
    leave_room(room)
    emit('message', {'username': 'System', 'message': 'You have left the common room.'}, room=room)

# Modify the message handling to broadcast to the common room
@socketio.on('driver_message')
def handle_driver_message(data):
    username = data.get('username')
    message = data.get('message')
    room = 'common_room'  # Broadcast to the common room
    send({'username': username, 'message': message}, room=room)

        
        
     
@app.route('/offer_scheduled_ride', methods=['GET', 'POST'])
def offer_scheduled_ride():
    if request.method == 'POST':
        # Extract ride details from form
        driver = session['username']
        origin = request.form.get('origin')
        destination = request.form.get('destination')
        date = request.form.get('date')
        time = request.form.get('time')
        seats_available = int(request.form.get('seats_available'))
        recurrence_pattern = request.form.get('recurrence_pattern')
        specific_days = ','.join(request.form.getlist('days[]')) if recurrence_pattern == 'specific_days' else None

        # Create new ScheduledRide object
        new_ride = RideSchedulingPattern(
            driver=driver,
            origin=origin,
            destination=destination,
            date=date,
            time=time,
            seats_available=seats_available,
            recurrence_pattern=recurrence_pattern,
            specific_days=specific_days
        )

        # Add the new ride to the database
        db.session.add(new_ride)
        db.session.commit()

        # Call the schedule_ride function to schedule rides based on recurrence pattern
        schedule_ride(new_ride, recurrence_pattern)

        # Redirect to dashboard or wherever appropriate
        flash('Ride offered successfully!', 'success')
        return redirect(url_for('driver_dashboard'))

    return render_template('offer_scheduled_ride.html')

@app.route('/request_scheduled_ride', methods=['GET', 'POST'])
def request_scheduled_ride():
    if request.method == 'POST':
        # Extract ride details from form
        rider = session['username']
        origin = request.form.get('origin')
        destination = request.form.get('destination')
        date = request.form.get('date')
        time = request.form.get('time')
        number_of_passengers = int(request.form.get('num_of_pax'))
        recurrence_pattern = request.form.get('recurrence_pattern')
        specific_days = ','.join(request.form.getlist('days[]')) if recurrence_pattern == 'specific_days' else None

        # Create new ScheduledRide object
        new_ride = RideRequestPattern(
            rider=rider,
            origin=origin,
            destination=destination,
            date=date,
            time=time,
            number_of_passengers = number_of_passengers,
            recurrence_pattern=recurrence_pattern,
            specific_days=specific_days
        )

        # Add the new ride to the database
        db.session.add(new_ride)
        db.session.commit()

        # Call the schedule_ride function to schedule rides based on recurrence pattern
        schedule_ride(new_ride, recurrence_pattern)

        # Redirect to dashboard or wherever appropriate
        flash('Ride requested successfully!', 'success')
        return redirect(url_for('rider_dashboard'))

    return render_template('request_scheduled_ride.html')


def schedule_ride(ride, recurrence_pattern):
    start_date = datetime.strptime(ride.date, '%Y-%m-%d')
    end_date = start_date + relativedelta(months=2)  # Schedule rides for the next month

    current_date = start_date
   
    while current_date <= end_date:
        if recurrence_pattern == 'daily':
            schedule_ride_for_date(ride, current_date)
            current_date += timedelta(days=1)
        elif recurrence_pattern == 'weekly':
            schedule_ride_for_date(ride, current_date)
            current_date += timedelta(weeks=1)
        elif recurrence_pattern == 'monthly':
            schedule_ride_for_date(ride, current_date)
            current_date += relativedelta(months=1)
        elif recurrence_pattern == 'specific_days':
            if current_date.strftime('%A') in ride.specific_days.split(','):
                schedule_ride_for_date(ride, current_date)
            current_date += timedelta(days=1)
        

def schedule_ride_for_date(ride, scheduled_date):
    if (ride.driver):
        new_scheduled_ride = OfferedScheduledRide(
            driver=ride.driver,
            origin=ride.origin,
            destination=ride.destination,
            date=scheduled_date.strftime('%Y-%m-%d'),
            time=ride.time,
            seats_available=ride.seats_available
             )
        
    
    elif (ride.rider):
        new_scheduled_ride = RequestedScheduledRide(
            rider=ride.rider,
            origin=ride.origin,
            destination=ride.destination,
            date=scheduled_date.strftime('%Y-%m-%d'),
            time=ride.time,
            number_of_passengers=ride.number_of_passengers
             )
    
    db.session.add(new_scheduled_ride)
    db.session.commit()



    
# Adjust the route to view scheduled rides and book them
@app.route('/view_offered_scheduled_rides')
def view_offered_scheduled_rides():
    scheduled_rides = OfferedScheduledRide.query.all()
    return render_template('view_offered_scheduled_rides.html', scheduled_rides=scheduled_rides)

@app.route('/view_requested_scheduled_rides')
def view_requested_scheduled_rides():
    scheduled_rides = RequestedScheduledRide.query.all()
    return render_template('view_requested_scheduled_rides.html', scheduled_rides=scheduled_rides)

@app.route('/book_offered_scheduled_rides/<int:ride_id>', methods=['POST'])
def book_offered_scheduled_rides(ride_id):
    ride = OfferedScheduledRide.query.get(ride_id)
    if ride and ride.booked_by is None:
        # Retrieve origin (pick-up point) from the form submission
        pickup_point = request.form.get('pickup_point')

        # Logic to allow user to book the ride and save the origin to the database
        ride.booked_by = session['username']
        ride.pickup_point = pickup_point  # Update the origin with the user's input
        db.session.commit()
        flash('Ride booked successfully!', 'success')
    else:
        flash('Ride not found or already booked!', 'error')
    return redirect(url_for('view_offered_scheduled_rides'))

@app.route('/accept_scheduled_rides/<int:ride_id>', methods=['POST'])
def accept_scheduled_rides(ride_id):
    ride = RequestedScheduledRide.query.get(ride_id)
    if ride and ride.driver is None:
        # Retrieve origin (pick-up point) from the form submission
        driver_origin = request.form.get('driver_origin')

        # Logic to allow user to book the ride and save the origin to the database
        ride.driver = session['username']
        ride.driver_origin = driver_origin  # Update the origin with the user's input
        db.session.commit()
        flash('Ride Accepted successfully!', 'success')
    else:
        flash('Ride not found or already Accepted!', 'error')
    return redirect(url_for('view_requested_scheduled_rides'))

@app.route('/requests_or_offers', methods=['GET', 'POST'])
def requests_or_offers():
    return render_template('requests_or_offers.html')

@app.route('/filter_offered_rides')
def filter_offered_rides():
    selected_date_str = request.args.get('date')
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()

    # Query the database to fetch all rides for the selected date
    scheduled_rides = OfferedScheduledRide.query.filter_by(date=selected_date).all()

    html = render_template('offered_rides_list.html', scheduled_rides=scheduled_rides)
   
    return jsonify(html=html)
@app.route('/filter_requested_rides')
def filter_requested_rides():
    selected_date_str = request.args.get('date')
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()

    # Query the database to fetch all rides for the selected date
    scheduled_rides = RequestedScheduledRide.query.filter_by(date=selected_date).all()

    html = render_template('requested_rides_list.html', scheduled_rides=scheduled_rides)
   
    return jsonify(html=html)


@app.route('/filter_my_rides_driver')
def filter_my_rides_driver():
    selected_date_str = request.args.get('date')
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()

    if 'username' not in session:
        return jsonify(html="<p>You need to log in to view rides.</p>")
    
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return jsonify(html=render_template('error.html', error_message=error_message))

    booked_rides = OfferedScheduledRide.query.filter_by(booked_by=user.username, date=selected_date).all()
    scheduled_rides = OfferedScheduledRide.query.filter_by(driver=user.username, date=selected_date).all()
    today = datetime.today().strftime('%Y-%m-%d')

    html = render_template('my_rides_list_offers.html', booked_rides=booked_rides, scheduled_rides=scheduled_rides,  today=today, username=user.username, gender=user.gender)
    return jsonify(html=html)

@app.route('/filter_my_rides_rider')
def filter_my_rides_rider():
    selected_date_str = request.args.get('date')
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date()

    if 'username' not in session:
        return jsonify(html="<p>You need to log in to view rides.</p>")
    
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return jsonify(html=render_template('error.html', error_message=error_message))

    requested_rides = RequestedScheduledRide.query.filter_by(rider=user.username, date=selected_date).all()
    accepted_rides = RequestedScheduledRide.query.filter_by(driver=user.username, date=selected_date).all()
    today = datetime.today().strftime('%Y-%m-%d')

    html = render_template('my_rides_list_requests.html',  requested_rides=requested_rides, accepted_rides=accepted_rides, today=today, username=user.username, gender=user.gender)
    return jsonify(html=html)


@app.route('/scheduledRidesByRider')
def scheduledRidesByRider():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return render_template('my_scheduled_rides.html', error_message=error_message)
   
    # Query the database to fetch all rides booked by the current user or scheduled by the current user
    
    requested_rides = RequestedScheduledRide.query.filter_by(rider=user.username).all()
    accepted_rides = RequestedScheduledRide.query.filter_by(driver=user.username).all()
    today = datetime.today().strftime('%Y-%m-%d')
    
    return render_template('scheduledRidesByRider.html', requested_rides=requested_rides, accepted_rides=accepted_rides, today=today, username=user.username, gender=user.gender)
@app.route('/scheduledRidesByDriver')
def scheduledRidesByDriver():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    # Fetch user from the database
    user = User.query.filter_by(username=session['username']).first()
    if not user:
        error_message = "User not found"
        return render_template('my_scheduled_rides.html', error_message=error_message)
   
    # Query the database to fetch all rides booked by the current user or scheduled by the current user
    booked_rides = OfferedScheduledRide.query.filter_by(booked_by=user.username).all()
    scheduled_rides = OfferedScheduledRide.query.filter_by(driver=user.username).all()
    today = datetime.today().strftime('%Y-%m-%d')
    
    return render_template('scheduledRidesByDriver.html', booked_rides=booked_rides, scheduled_rides=scheduled_rides, today=today, username=user.username, gender=user.gender)

@app.route('/driver_scheduled_ride', methods=['GET', 'POST'])
def driver_scheduled_ride():
    username = request.args.get('username')
    gender = request.args.get('gender')
    destination = request.args.get('destination')
    date = request.args.get('date')
    time = request.args.get('time')
    seats_available = request.args.get('seats_available')
    booked_by = request.args.get('booked_by')
    pickup_point = request.args.get('pickup_point')
    ride_id = request.args.get('ride_id')

    user = User.query.filter_by(username=username).first()
    if user:
        car = Car.query.filter_by(user_id=user.id).first()
        if car:
            make = car.make
            model = car.model
            year = car.year
            license_plate = car.license_plate
        else:
            flash('Car not found')

    if request.method == 'POST':
        rightname = request.form.get('rightname')
        user_room = User.query.filter_by(username=rightname).first()
        if user_room:
            room = user_room.room_id
            session['room'] = room
            return redirect(url_for('room', room=room))
        else:
            flash('User or room not found.', 'error')
            return redirect(url_for('driver_scheduled_ride'))

    return render_template('driver_scheduled_ride.html', 
                           username=username, 
                           gender=gender, 
                           make=make, 
                           model=model, 
                           year=year, 
                           license_plate=license_plate,
                           destination=destination,
                           date=date,
                           time=time,
                           seats_available=seats_available,
                           booked_by=booked_by,
                           pickup_point=pickup_point,
                           ride_id=ride_id)



@app.route('/rider_scheduled_ride')
def rider_scheduled_ride():
    username = request.args.get('username')
    gender = request.args.get('gender')
    driver = request.args.get('driver')
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    date = request.args.get('date')
    time = request.args.get('time')
    seats_available = request.args.get('seats_available')
    pickup_point = request.args.get('pickup_point')
    ride_id = request.args.get('ride_id')
    user = User.query.filter_by(username=driver).first()
    if user:
        car = Car.query.filter_by(user_id=user.id).first()
        if car:
            make = car.make
            model = car.model
            year = car.year
            license_plate = car.license_plate
        else:
            make = model = year = license_plate = 'N/A'
    else:
        make = model = year = license_plate = 'N/A'
        
    if request.method == 'POST':
            user_room = User.query.filter_by(username=session['username'] ).first() 
            if user_room:
                room = user_room.room_id
                session['room'] = room
            else:
                flash('User or room not found.', 'error')  # Optionally add a message for the user.
                return redirect(url_for('scheduled_ride_request'))
            return redirect(url_for('room', room=room))
    
    return render_template(
        'rider_scheduled_ride.html',
        username=username,
        gender=gender,
        make=make,
        origin=origin,
        destination=destination,
        driver=driver,
        date=date,
        time=time,
        seats_available=seats_available,
        model=model,
        year=year,
        license_plate=license_plate,
        pickup_point=pickup_point,
        ride_id = ride_id
    )

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables before running the app
    app.run(debug=True)
        
