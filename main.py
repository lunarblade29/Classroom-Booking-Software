from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
from schedule import schedule_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(schedule_bp)


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
