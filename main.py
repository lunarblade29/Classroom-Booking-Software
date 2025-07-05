from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
from schedule import schedule_bp
import os
import pandas as pd
from werkzeug.utils import secure_filename
from flask_httpauth import HTTPBasicAuth
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
auth = HTTPBasicAuth()

# Replace with your desired username/password
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
USER_CREDENTIALS = {
    ADMIN_USERNAME: ADMIN_PASSWORD
}


@auth.verify_password
def verify_password(username, password):
    if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
        return username

# Register blueprint
app.register_blueprint(schedule_bp)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/upload_excel", methods=["POST"])
def upload_excel():
    if 'excel_file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"})

    file = request.files['excel_file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"})

    if not file.filename.endswith('.xlsx'):
        return jsonify({"status": "error", "message": "Invalid file type. Please upload an .xlsx file"})

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(file_path)

    try:
        df = pd.read_excel(file_path, engine='openpyxl')

        # Check required columns
        required_columns = {"professor", "room", "date", "start_time", "end_time"}
        if not required_columns.issubset(df.columns):
            return jsonify({"status": "error", "message": "Missing required columns in Excel file"})

        # Format columns
        df["date"] = pd.to_datetime(df["date"]).dt.strftime('%Y-%m-%d')
        df["start_time"] = pd.to_datetime(df["start_time"].astype(str)).dt.strftime('%H:%M')
        df["end_time"] = pd.to_datetime(df["end_time"].astype(str)).dt.strftime('%H:%M')

        conn = sqlite3.connect("database.db")
        c = conn.cursor()

        for _, row in df.iterrows():
            c.execute("""INSERT INTO bookings (professor, room, date, start_time, end_time) 
                         VALUES (?, ?, ?, ?, ?)""",
                      (row["professor"], row["room"], row["date"], row["start_time"], row["end_time"]))

        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Database updated successfully!"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

    finally:
        # 🔥 Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
            print("its probably deleted")


# Initialize database
def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS bookings (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 professor TEXT NOT NULL,
                 room TEXT NOT NULL,
                 date TEXT NOT NULL,
                 start_time TEXT NOT NULL,
                 end_time TEXT NOT NULL)''')
    conn.commit()
    conn.close()


init_db()


@app.route("/")
@auth.login_required
def index():
    return render_template("index.html")


@app.route("/get_bookings")
def get_bookings():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM bookings ORDER BY date DESC, start_time DESC")
    bookings = c.fetchall()
    conn.close()
    return jsonify(bookings)


@app.route("/book", methods=["POST"])
def book():
    professor = request.form.get("professor")
    room = request.form.get("room")
    date = request.form.get("date", datetime.today().strftime('%Y-%m-%d'))  # Default to today
    start_time = request.form.get("start_time")
    end_time = request.form.get("end_time")

    if not professor or not room or not start_time or not end_time:
        return jsonify({"status": "error", "message": "All fields are required!"})

    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # Check if room is already booked for the given time slot
    c.execute('''SELECT * FROM bookings WHERE room = ? AND date = ? 
                 AND ((start_time <= ? AND end_time > ?) OR 
                      (start_time < ? AND end_time >= ?))''',
              (room, date, end_time, start_time, start_time, end_time))

    if c.fetchone():
        conn.close()
        return jsonify({"status": "error", "message": f"Room {room} is already booked for this time slot!"})

    c.execute("INSERT INTO bookings (professor, room, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
              (professor, room, date, start_time, end_time))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Booking successful!"})


@app.route("/delete/<int:booking_id>", methods=["POST"])
def delete_booking(booking_id):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("DELETE FROM bookings WHERE id = ?", (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Booking deleted successfully!"})


if __name__ == "__main__":
    app.run(debug=True)
